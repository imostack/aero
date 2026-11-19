"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  passwordMatches,
  requireAdmin,
  setAdminSession,
} from "@/lib/auth";
import { getApplication, markApproved, setApplicationStatus } from "@/lib/applications";
import { inviteVendors, vendorsByIds } from "@/lib/dispatch";
import { sendFinderDeclined, sendFinderQuote, sendVendorRfq } from "@/lib/email";
import { CURRENCIES, equipmentCategories } from "@/lib/equipment";
import {
  createFinderQuote,
  createInvites,
  createVendor,
  declineRequest as markDeclined,
  submitVendorResponse,
  getRequest,
  listInvites,
  markInviteReminded,
  setRequestStatus,
  setVendorActive,
  markedUp,
  listVendors,
} from "@/lib/rfq";

const text = (fd: FormData, k: string, max = 2000) =>
  String(fd.get(k) ?? "").trim().slice(0, max);

/* -------------------------------- session -------------------------------- */

export async function login(formData: FormData) {
  if (passwordMatches(text(formData, "password", 200))) {
    await setAdminSession();
    redirect("/admin");
  }
  await new Promise((r) => setTimeout(r, 800)); // slow down guessing
  redirect("/admin/login?error=1");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}

/* -------------------------------- vendors -------------------------------- */

export async function addVendor(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name", 160);
  const email = text(formData, "email", 200).toLowerCase();
  const slugs = new Set(equipmentCategories.map((c) => c.slug));
  const categories = formData.getAll("categories").map(String).filter((c) => slugs.has(c));
  if (!name || !email || categories.length === 0) redirect("/admin/vendors?error=1");

  await createVendor({
    name,
    email,
    contact_name: text(formData, "contact_name", 120),
    phone: text(formData, "phone", 60),
    categories,
  });
  revalidatePath("/admin/vendors");
  redirect("/admin/vendors");
}

export async function toggleVendor(formData: FormData) {
  await requireAdmin();
  await setVendorActive(Number(formData.get("id")), formData.get("active") === "true");
  revalidatePath("/admin/vendors");
}

/* ------------------------------- requests -------------------------------- */

export async function addVendorsToRequest(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("requestId"));
  const request = await getRequest(id);
  if (!request) redirect("/admin");
  const ids = formData.getAll("vendorIds").map(Number);
  if (ids.length) await inviteVendors(request, await vendorsByIds(ids));
  revalidatePath(`/admin/requests/${id}`);
}

export async function remindVendor(formData: FormData) {
  await requireAdmin();
  const requestId = Number(formData.get("requestId"));
  const inviteId = Number(formData.get("inviteId"));
  const request = await getRequest(requestId);
  const invite = (await listInvites(requestId)).find((i) => i.id === inviteId);
  const vendor = (await listVendors()).find((v) => v.id === invite?.vendor_id);
  if (!request || !invite || !vendor) redirect("/admin");

  if (await sendVendorRfq(vendor, request, invite.token, true)) {
    await markInviteReminded(invite.id);
  }
  revalidatePath(`/admin/requests/${requestId}`);
}

export async function sendQuote(formData: FormData) {
  await requireAdmin();
  const requestId = Number(formData.get("requestId"));
  const inviteId = Number(formData.get("inviteId"));
  const markup = Number(text(formData, "markup", 10));

  const request = await getRequest(requestId);
  const invite = (await listInvites(requestId)).find((i) => i.id === inviteId);
  if (!request || !invite || !invite.available || invite.day_rate == null) {
    redirect(`/admin/requests/${requestId}?error=quote`);
  }
  if (!Number.isFinite(markup) || markup < 0 || markup > 200) {
    redirect(`/admin/requests/${requestId}?error=markup`);
  }
  if (request.status === "accepted" || request.status === "closed") {
    redirect(`/admin/requests/${requestId}`);
  }

  const currency = CURRENCIES.find((c) => c === invite.currency) ?? "USD";
  const quote = await createFinderQuote({
    request_id: requestId,
    request_vendor_id: invite.id,
    currency,
    day_rate: markedUp(invite.day_rate, markup),
    mob_cost: markedUp(invite.mob_cost ?? 0, markup),
    markup_pct: markup,
    lead_time: text(formData, "lead_time", 200) || invite.lead_time || "",
    valid_until: text(formData, "valid_until", 20) || invite.valid_until || "",
    notes: text(formData, "notes", 2000),
  });
  await sendFinderQuote(request, quote);
  revalidatePath(`/admin/requests/${requestId}`);
  redirect(`/admin/requests/${requestId}?sent=1`);
}

/** Log a quote you sourced off-platform (phone/WhatsApp) so it flows through the normal markup + send step. */
export async function addManualResponse(formData: FormData) {
  await requireAdmin();
  const requestId = Number(formData.get("requestId"));
  const request = await getRequest(requestId);
  if (!request) redirect("/admin");

  const back = `/admin/requests/${requestId}`;
  const name = text(formData, "vendor_name", 160);
  const rate = Number(text(formData, "day_rate", 30).replace(/,/g, ""));
  const mobRaw = text(formData, "mob_cost", 30).replace(/,/g, "");
  const mob = mobRaw ? Number(mobRaw) : 0;
  if (!name || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(mob) || mob < 0) {
    redirect(`${back}?error=manual`);
  }

  const contact = text(formData, "vendor_contact", 200);
  const vendors = await listVendors();
  const existing = vendors.find((v) => v.name.toLowerCase() === name.toLowerCase());
  // New off-platform vendors are saved inactive so they are never auto-emailed until you activate them.
  const vendorId =
    existing?.id ??
    (await createVendor({
      name,
      contact_name: "",
      email: contact.includes("@") ? contact : "",
      phone: contact.includes("@") ? "" : contact,
      categories: [request.category],
      active: false,
    }));

  await createInvites(requestId, [vendorId]);
  const invite = (await listInvites(requestId)).find((i) => i.vendor_id === vendorId);
  if (!invite) redirect(`${back}?error=manual`);

  await submitVendorResponse(invite.id, {
    available: true,
    currency: CURRENCIES.find((c) => c === text(formData, "currency")) ?? "USD",
    day_rate: rate,
    mob_cost: mob,
    lead_time: text(formData, "lead_time", 200),
    valid_until: text(formData, "valid_until", 20),
    vendor_notes: text(formData, "vendor_notes", 2000),
  });
  revalidatePath(back);
  redirect(`${back}?logged=1`);
}

/** Tell the finder we could not source their equipment. */
export async function declineRequest(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("requestId"));
  const request = await getRequest(id);
  if (!request) redirect("/admin");

  const note = text(formData, "note", 2000);
  if (!note) redirect(`/admin/requests/${id}?error=decline`);

  if (await markDeclined(id, note)) {
    await sendFinderDeclined(request, note);
  }
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/requests/${id}?declined=1`);
}

export async function closeRequest(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("requestId"));
  await setRequestStatus(id, "closed");
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/admin");
}

/* ---------------------------- vendor applications --------------------------- */

export async function updateApplication(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = text(formData, "status", 20);
  if (status !== "contacted" && status !== "rejected" && status !== "new") redirect("/admin/applications");
  await setApplicationStatus(id, status, text(formData, "notes", 2000));
  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}

/** Approving creates an active vendor, so they start receiving matching requests. */
export async function approveApplication(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const app = await getApplication(id);
  if (!app || app.status === "approved") redirect("/admin/applications");

  const slugs = new Set(equipmentCategories.map((c) => c.slug));
  const categories = formData.getAll("categories").map(String).filter((c) => slugs.has(c));
  if (categories.length === 0) redirect("/admin/applications?error=categories");

  const vendorId = await createVendor({
    name: app.company,
    contact_name: app.contact_name,
    email: app.email,
    phone: app.phone,
    categories,
  });
  await markApproved(id, vendorId, text(formData, "notes", 2000));
  revalidatePath("/admin/applications");
  revalidatePath("/admin/vendors");
  redirect("/admin/applications?approved=1");
}

"use server";

import { redirect } from "next/navigation";
import { sendAdminVendorResponded } from "@/lib/email";
import { CURRENCIES } from "@/lib/equipment";
import { getInviteByToken, listInvites, submitVendorResponse } from "@/lib/rfq";

const text = (fd: FormData, k: string, max = 1000) =>
  String(fd.get(k) ?? "").trim().slice(0, max);

function num(fd: FormData, k: string): number | null {
  const raw = text(fd, k, 30).replace(/,/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function submitResponse(formData: FormData) {
  const t = text(formData, "token", 100);
  const found = await getInviteByToken(t);
  if (!found) redirect("/");

  const { invite, request } = found;
  const back = `/vendor/quote/${t}`;
  if (request.status === "accepted" || request.status === "closed") {
    redirect(`${back}?error=closed`);
  }

  const available = text(formData, "available") === "yes";
  const currency = CURRENCIES.find((c) => c === text(formData, "currency")) ?? "USD";
  const day_rate = available ? num(formData, "day_rate") : null;
  if (available && day_rate === null) redirect(`${back}?error=rate`);

  await submitVendorResponse(invite.id, {
    available,
    currency,
    day_rate,
    mob_cost: available ? num(formData, "mob_cost") : null,
    lead_time: text(formData, "lead_time", 200),
    valid_until: text(formData, "valid_until", 20),
    vendor_notes: text(formData, "vendor_notes", 2000),
  });

  const updated = (await listInvites(request.id)).find((i) => i.id === invite.id);
  if (updated) await sendAdminVendorResponded(request, updated);

  redirect(`${back}?done=1`);
}

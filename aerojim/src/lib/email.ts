import { Resend } from "resend";
import { categoryName, getEquipmentCategory } from "./equipment";
import {
  fmtDate,
  money,
  type FinderQuote,
  type InviteRow,
  type RequestRow,
  type Vendor,
} from "./rfq";

export const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "sales@mail.aerojim.com";
const FROM_REQUESTS = "AeroJim Requests <requests@mail.aerojim.com>";
const FROM_NOREPLY = "AeroJim <noreply@mail.aerojim.com>";

export function siteUrl(): string {
  return (process.env.SITE_URL ?? "https://www.aerojim.com").replace(/\/$/, "");
}

export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let resend: Resend | null = null;
async function send(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send(opts);
  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }
}

/** Sends and swallows errors so one failed email never loses a saved request. */
async function trySend(opts: Parameters<typeof send>[0]) {
  try {
    await send(opts);
    return true;
  } catch {
    return false;
  }
}

const wrap = (body: string) => `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
  <div style="background:#0a1628;padding:24px 28px;border-radius:8px 8px 0 0"><span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:2px">AERO<span style="color:#fbbf24">JIM</span></span><p style="color:#fbbf24;font-size:11px;margin:2px 0 0;letter-spacing:3px;text-transform:uppercase">Energy Supply Solutions</p></div>
  <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;font-size:14px;line-height:1.55">${body}</div>
</div>`;

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${esc(href)}" style="background:#f59e0b;color:#0a1628;font-weight:700;padding:12px 22px;border-radius:6px;text-decoration:none;display:inline-block">${esc(label)}</a></p>`;

function row(label: string, value: string | null | undefined) {
  return `<tr><td style="padding:6px 0;color:#6b7280;width:170px;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;font-weight:600">${esc(value || "—")}</td></tr>`;
}

/** Spec table shared by vendor and admin emails. Never includes finder identity. */
export function specTable(r: RequestRow) {
  const cat = getEquipmentCategory(r.category);
  const detailRows = (cat?.fields ?? [])
    .filter((f) => r.details[f.name])
    .map((f) => row(f.label, r.details[f.name]))
    .join("");
  return `<table style="width:100%;border-collapse:collapse">
    ${row("Equipment", categoryName(r.category))}
    ${row("Location", r.location)}
    ${row("Required from", r.start_date ? fmtDate(r.start_date) : "")}
    ${row("Duration", r.duration)}
    ${detailRows}
  </table>${r.notes ? `<p style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px"><strong>Additional notes</strong><br/>${esc(r.notes).replace(/\n/g, "<br/>")}</p>` : ""}`;
}

/* ------------------------------ to vendors ----------------------------- */

export function sendVendorRfq(vendor: Vendor, r: RequestRow, inviteToken: string, reminder = false) {
  const link = `${siteUrl()}/vendor/quote/${inviteToken}`;
  return trySend({
    from: FROM_REQUESTS,
    to: vendor.email,
    replyTo: ADMIN_EMAIL,
    subject: `${reminder ? "Reminder: " : ""}Availability request ${r.ref} — ${categoryName(r.category)}`,
    html: wrap(`
      <p>Hello ${esc(vendor.contact_name || vendor.name)},</p>
      <p>${reminder ? "This is a reminder of a request we sent earlier. " : ""}We have a client looking to lease the equipment below. Please confirm whether you have it available and your day rate.</p>
      ${specTable(r)}
      ${button(link, "Confirm availability & rates")}
      <p style="color:#6b7280;font-size:13px">The link above is unique to you. It takes about two minutes. Rates should be your net rates; AeroJim handles the client relationship. Questions? Reply to this email.</p>`),
  });
}

/* ------------------------------ to finders ----------------------------- */

export function sendRequestReceived(r: RequestRow) {
  return trySend({
    from: FROM_NOREPLY,
    to: r.email,
    replyTo: ADMIN_EMAIL,
    subject: `We've received your request ${r.ref} — AeroJim`,
    html: wrap(`
      <p>Hi ${esc(r.name)},</p>
      <p>Thank you for your request for <strong>${esc(categoryName(r.category))}</strong>. Your reference is <strong>${esc(r.ref)}</strong>.</p>
      <p>We are now checking availability and rates with our vendors and will send you a quote, typically within <strong>24–72 hours</strong> on business days. You can follow the status of your request here:</p>
      ${button(`${siteUrl()}/quote/${r.token}`, "View your request")}
      ${specTable(r)}`),
  });
}

export function sendFinderQuote(r: RequestRow, q: FinderQuote) {
  return trySend({
    from: FROM_NOREPLY,
    to: r.email,
    replyTo: ADMIN_EMAIL,
    subject: `Your quote is ready — ${r.ref} (${categoryName(r.category)})`,
    html: wrap(`
      <p>Hi ${esc(r.name)},</p>
      <p>Good news — the equipment you requested is available.</p>
      <table style="width:100%;border-collapse:collapse">
        ${row("Day rate", money(q.day_rate, q.currency))}
        ${row("Mobilisation", money(q.mob_cost, q.currency))}
        ${row("Lead time", q.lead_time)}
        ${row("Quote valid until", q.valid_until ? fmtDate(q.valid_until) : "")}
      </table>
      ${q.notes ? `<p>${esc(q.notes).replace(/\n/g, "<br/>")}</p>` : ""}
      ${button(`${siteUrl()}/quote/${r.token}`, "View & accept quote")}`),
  });
}

export function sendFinderDeclined(r: RequestRow, note: string) {
  return trySend({
    from: FROM_NOREPLY,
    to: r.email,
    replyTo: ADMIN_EMAIL,
    subject: `Update on your request ${r.ref} — AeroJim`,
    html: wrap(`
      <p>Hi ${esc(r.name)},</p>
      <p>${esc(note).replace(/\n/g, "<br/>")}</p>
      <p>You are welcome to submit a new request at any time. If your requirements change (dates, specifications or location), please send it again and we will look again.</p>
      ${button(`${siteUrl()}/equipment/request`, "Submit a new request")}
      <p style="color:#6b7280;font-size:13px">Reference: ${esc(r.ref)} — ${esc(categoryName(r.category))}</p>`),
  });
}

export function sendFinderAccepted(r: RequestRow) {
  return trySend({
    from: FROM_NOREPLY,
    to: r.email,
    replyTo: ADMIN_EMAIL,
    subject: `Quote accepted — ${r.ref}`,
    html: wrap(`
      <p>Hi ${esc(r.name)},</p>
      <p>Thank you for accepting our quote for request <strong>${esc(r.ref)}</strong>. Our team will contact you shortly with the agreement and next steps.</p>`),
  });
}

/* ------------------------------- to admin ------------------------------ */

export function sendAdminNewRequest(r: RequestRow, invited: string[]) {
  return trySend({
    from: FROM_REQUESTS,
    to: ADMIN_EMAIL,
    replyTo: r.email,
    subject: `${invited.length ? "" : "[MANUAL] "}New request ${r.ref} — ${categoryName(r.category)} from ${r.company}`,
    html: wrap(`
      <p><strong>${esc(r.name)}</strong>, ${esc(r.company)} — <a href="mailto:${esc(r.email)}">${esc(r.email)}</a> ${r.phone ? "· " + esc(r.phone) : ""}</p>
      ${specTable(r)}
      <p>${invited.length ? `Sent to vendors: <strong>${esc(invited.join(", "))}</strong>` : `<strong style="color:#b91c1c">No vendors in the network for this category: source this one manually, then log the quote in admin.</strong>`}</p>
      ${button(`${siteUrl()}/admin/requests/${r.id}`, "Open in admin")}`),
  });
}

export function sendAdminVendorResponded(r: RequestRow, inv: InviteRow) {
  return trySend({
    from: FROM_REQUESTS,
    to: ADMIN_EMAIL,
    subject: `${inv.vendor_name} responded — ${r.ref}`,
    html: wrap(`
      <p><strong>${esc(inv.vendor_name)}</strong> ${inv.available ? `is <strong>available</strong> at ${esc(money(inv.day_rate, inv.currency))}/day` : "<strong>cannot supply</strong>"} for ${esc(r.ref)}.</p>
      ${button(`${siteUrl()}/admin/requests/${r.id}`, "Review & quote")}`),
  });
}

export function sendAdminAccepted(r: RequestRow, q: FinderQuote) {
  return trySend({
    from: FROM_REQUESTS,
    to: ADMIN_EMAIL,
    replyTo: r.email,
    subject: `QUOTE ACCEPTED — ${r.ref} by ${r.company}`,
    html: wrap(`
      <p><strong>${esc(r.company)}</strong> accepted the quote at <strong>${esc(money(q.day_rate, q.currency))}/day</strong> for ${esc(r.ref)}. Contact ${esc(r.name)} at <a href="mailto:${esc(r.email)}">${esc(r.email)}</a> to issue the agreement.</p>
      ${button(`${siteUrl()}/admin/requests/${r.id}`, "Open in admin")}`),
  });
}

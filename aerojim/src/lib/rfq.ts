import { randomBytes } from "crypto";
import { db } from "./db";

export type RequestStatus = "open" | "quoted" | "accepted" | "closed";

export interface Vendor {
  id: number;
  name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  categories: string[];
  active: boolean;
}

export interface RequestRow {
  id: number;
  ref: string;
  token: string;
  category: string;
  status: RequestStatus;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  location: string;
  start_date: string | null;
  duration: string | null;
  details: Record<string, string>;
  notes: string | null;
  accepted_quote_id: number | null;
  created_at: string | Date;
}

export interface InviteRow {
  id: number;
  request_id: number;
  vendor_id: number;
  token: string;
  sent_at: string | Date | null;
  reminded_at: string | Date | null;
  responded_at: string | Date | null;
  available: boolean | null;
  currency: string | null;
  day_rate: number | null;
  mob_cost: number | null;
  lead_time: string | null;
  valid_until: string | null;
  vendor_notes: string | null;
  vendor_name: string;
  vendor_email: string;
  vendor_contact: string | null;
}

export interface FinderQuote {
  id: number;
  request_id: number;
  request_vendor_id: number;
  currency: string;
  day_rate: number;
  mob_cost: number;
  markup_pct: number;
  lead_time: string | null;
  valid_until: string | null;
  notes: string | null;
  sent_at: string | Date;
}

const token = () => randomBytes(18).toString("hex");

/* ------------------------------- vendors ------------------------------- */

export async function listVendors(): Promise<Vendor[]> {
  const sql = await db();
  return (await sql`SELECT * FROM vendors ORDER BY active DESC, name`) as Vendor[];
}

export async function vendorsForCategory(category: string): Promise<Vendor[]> {
  const sql = await db();
  return (await sql`
    SELECT * FROM vendors WHERE active AND ${category} = ANY(categories) ORDER BY name
  `) as Vendor[];
}

export async function createVendor(v: {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  categories: string[];
}) {
  const sql = await db();
  await sql`
    INSERT INTO vendors (name, contact_name, email, phone, categories)
    VALUES (${v.name}, ${v.contact_name || null}, ${v.email}, ${v.phone || null}, ${v.categories})
  `;
}

export async function setVendorActive(id: number, active: boolean) {
  const sql = await db();
  await sql`UPDATE vendors SET active = ${active} WHERE id = ${id}`;
}

/* ------------------------------- requests ------------------------------ */

export async function createRequest(r: {
  category: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  start_date: string;
  duration: string;
  details: Record<string, string>;
  notes: string;
}): Promise<RequestRow> {
  const sql = await db();
  const rows = await sql`
    INSERT INTO requests
      (token, category, name, company, email, phone, location, start_date, duration, details, notes)
    VALUES
      (${token()}, ${r.category}, ${r.name}, ${r.company}, ${r.email}, ${r.phone || null},
       ${r.location}, ${r.start_date || null}, ${r.duration || null},
       ${JSON.stringify(r.details)}::jsonb, ${r.notes || null})
    RETURNING id
  `;
  const id = rows[0].id as number;
  const updated = await sql`
    UPDATE requests
    SET ref = 'AJ-' || to_char(now(), 'YY') || '-' || lpad(id::text, 4, '0')
    WHERE id = ${id}
    RETURNING *
  `;
  return updated[0] as RequestRow;
}

export async function getRequest(id: number): Promise<RequestRow | null> {
  const sql = await db();
  const rows = await sql`SELECT * FROM requests WHERE id = ${id}`;
  return (rows[0] as RequestRow) ?? null;
}

export async function getRequestByToken(t: string): Promise<RequestRow | null> {
  const sql = await db();
  const rows = await sql`SELECT * FROM requests WHERE token = ${t}`;
  return (rows[0] as RequestRow) ?? null;
}

export interface RequestSummary extends RequestRow {
  invited: number;
  responded: number;
  quotes: number;
}

export async function listRequests(): Promise<RequestSummary[]> {
  const sql = await db();
  const rows = await sql`
    SELECT r.*,
      (SELECT count(*) FROM request_vendors rv WHERE rv.request_id = r.id)::int AS invited,
      (SELECT count(*) FROM request_vendors rv WHERE rv.request_id = r.id AND rv.responded_at IS NOT NULL)::int AS responded,
      (SELECT count(*) FROM finder_quotes q WHERE q.request_id = r.id)::int AS quotes
    FROM requests r
    ORDER BY (r.status IN ('open','quoted')) DESC, r.created_at DESC
  `;
  return rows as RequestSummary[];
}

export async function setRequestStatus(id: number, status: RequestStatus) {
  const sql = await db();
  await sql`UPDATE requests SET status = ${status} WHERE id = ${id}`;
}

/* ------------------------------- invites ------------------------------- */

/** Creates invites for vendors that don't already have one. Returns the new ones. */
export async function createInvites(requestId: number, vendorIds: number[]) {
  const sql = await db();
  const created: { invite_id: number; token: string; vendor_id: number }[] = [];
  for (const vendorId of vendorIds) {
    const rows = await sql`
      INSERT INTO request_vendors (request_id, vendor_id, token)
      VALUES (${requestId}, ${vendorId}, ${token()})
      ON CONFLICT (request_id, vendor_id) DO NOTHING
      RETURNING id, token, vendor_id
    `;
    if (rows[0]) {
      created.push({
        invite_id: rows[0].id,
        token: rows[0].token,
        vendor_id: rows[0].vendor_id,
      });
    }
  }
  return created;
}

export async function markInviteSent(inviteId: number) {
  const sql = await db();
  await sql`UPDATE request_vendors SET sent_at = now() WHERE id = ${inviteId}`;
}

export async function markInviteReminded(inviteId: number) {
  const sql = await db();
  await sql`UPDATE request_vendors SET reminded_at = now() WHERE id = ${inviteId}`;
}

export async function listInvites(requestId: number): Promise<InviteRow[]> {
  const sql = await db();
  return (await sql`
    SELECT rv.*, v.name AS vendor_name, v.email AS vendor_email, v.contact_name AS vendor_contact
    FROM request_vendors rv JOIN vendors v ON v.id = rv.vendor_id
    WHERE rv.request_id = ${requestId}
    ORDER BY rv.id
  `) as InviteRow[];
}

export async function getInviteByToken(t: string) {
  const sql = await db();
  const rows = await sql`
    SELECT rv.*, v.name AS vendor_name, v.email AS vendor_email, v.contact_name AS vendor_contact
    FROM request_vendors rv JOIN vendors v ON v.id = rv.vendor_id
    WHERE rv.token = ${t}
  `;
  if (!rows[0]) return null;
  const invite = rows[0] as InviteRow;
  const request = await getRequest(invite.request_id);
  return request ? { invite, request } : null;
}

export async function submitVendorResponse(
  inviteId: number,
  r: {
    available: boolean;
    currency: string;
    day_rate: number | null;
    mob_cost: number | null;
    lead_time: string;
    valid_until: string;
    vendor_notes: string;
  }
) {
  const sql = await db();
  await sql`
    UPDATE request_vendors SET
      responded_at = now(),
      available = ${r.available},
      currency = ${r.currency},
      day_rate = ${r.day_rate},
      mob_cost = ${r.mob_cost},
      lead_time = ${r.lead_time || null},
      valid_until = ${r.valid_until || null},
      vendor_notes = ${r.vendor_notes || null}
    WHERE id = ${inviteId}
  `;
}

/* ---------------------------- finder quotes ---------------------------- */

export async function listFinderQuotes(requestId: number): Promise<FinderQuote[]> {
  const sql = await db();
  return (await sql`
    SELECT * FROM finder_quotes WHERE request_id = ${requestId} ORDER BY id
  `) as FinderQuote[];
}

export async function createFinderQuote(q: {
  request_id: number;
  request_vendor_id: number;
  currency: string;
  day_rate: number;
  mob_cost: number;
  markup_pct: number;
  lead_time: string;
  valid_until: string;
  notes: string;
}) {
  const sql = await db();
  const rows = await sql`
    INSERT INTO finder_quotes
      (request_id, request_vendor_id, currency, day_rate, mob_cost, markup_pct, lead_time, valid_until, notes)
    VALUES
      (${q.request_id}, ${q.request_vendor_id}, ${q.currency}, ${q.day_rate}, ${q.mob_cost},
       ${q.markup_pct}, ${q.lead_time || null}, ${q.valid_until || null}, ${q.notes || null})
    RETURNING *
  `;
  await sql`
    UPDATE requests SET status = 'quoted' WHERE id = ${q.request_id} AND status = 'open'
  `;
  return rows[0] as FinderQuote;
}

/** Returns the accepted quote, or null if the quote doesn't belong to the request or it is already settled. */
export async function acceptQuote(requestId: number, quoteId: number) {
  const sql = await db();
  const rows = await sql`
    UPDATE requests SET status = 'accepted', accepted_quote_id = ${quoteId}
    WHERE id = ${requestId}
      AND status IN ('open', 'quoted')
      AND EXISTS (SELECT 1 FROM finder_quotes WHERE id = ${quoteId} AND request_id = ${requestId})
    RETURNING id
  `;
  if (!rows[0]) return null;
  const q = await sql`SELECT * FROM finder_quotes WHERE id = ${quoteId}`;
  return q[0] as FinderQuote;
}

/* -------------------------------- helpers ------------------------------ */

export function markedUp(amount: number, pct: number) {
  return Math.round(amount * (1 + pct / 100) * 100) / 100;
}

export function money(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null) return "—";
  const n = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${currency === "NGN" ? "₦" : "$"}${n}${currency ? ` ${currency}` : ""}`;
}

export function fmtDate(v: string | Date | null | undefined) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime())
    ? String(v)
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

import { db } from "./db";

export type ApplicationStatus = "new" | "contacted" | "approved" | "rejected";

export interface Application {
  id: number;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  location: string;
  categories: string[];
  equipment_summary: string | null;
  rc_number: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  vendor_id: number | null;
  created_at: string | Date;
}

export async function createApplication(a: {
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  location: string;
  categories: string[];
  equipment_summary: string;
  rc_number: string;
}): Promise<Application> {
  const sql = await db();
  const rows = await sql`
    INSERT INTO vendor_applications
      (company, contact_name, email, phone, location, categories, equipment_summary, rc_number)
    VALUES
      (${a.company}, ${a.contact_name}, ${a.email}, ${a.phone}, ${a.location}, ${a.categories},
       ${a.equipment_summary || null}, ${a.rc_number || null})
    RETURNING *
  `;
  return rows[0] as Application;
}

export async function listApplications(): Promise<Application[]> {
  const sql = await db();
  return (await sql`
    SELECT * FROM vendor_applications
    ORDER BY (status = 'new') DESC, (status = 'contacted') DESC, created_at DESC
  `) as Application[];
}

export async function getApplication(id: number): Promise<Application | null> {
  const sql = await db();
  const rows = await sql`SELECT * FROM vendor_applications WHERE id = ${id}`;
  return (rows[0] as Application) ?? null;
}

export async function countNewApplications(): Promise<number> {
  const sql = await db();
  const rows = await sql`SELECT count(*)::int AS n FROM vendor_applications WHERE status = 'new'`;
  return rows[0].n as number;
}

export async function setApplicationStatus(
  id: number,
  status: Exclude<ApplicationStatus, "approved">,
  notes: string
) {
  const sql = await db();
  // An approved application is final; it already created a vendor.
  await sql`
    UPDATE vendor_applications
    SET status = ${status}, admin_notes = ${notes || null}
    WHERE id = ${id} AND status <> 'approved'
  `;
}

/** Returns false if it was already approved (prevents creating a duplicate vendor). */
export async function markApproved(id: number, vendorId: number, notes: string): Promise<boolean> {
  const sql = await db();
  const rows = await sql`
    UPDATE vendor_applications
    SET status = 'approved', vendor_id = ${vendorId}, admin_notes = ${notes || null}
    WHERE id = ${id} AND status <> 'approved'
    RETURNING id
  `;
  return rows.length > 0;
}

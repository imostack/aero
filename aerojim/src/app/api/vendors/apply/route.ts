import { NextResponse } from "next/server";
import { createApplication } from "@/lib/applications";
import { sendAdminNewApplication, sendApplicationReceived } from "@/lib/email";
import { equipmentCategories } from "@/lib/equipment";

const clean = (v: unknown, max = 300) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.website)) return NextResponse.json({ success: true });

  const valid = new Set(equipmentCategories.map((c) => c.slug));
  const categories = Array.isArray(body.categories)
    ? [...new Set(body.categories.map(String).filter((c) => valid.has(c)))]
    : [];

  const company = clean(body.company, 160);
  const contact_name = clean(body.contact_name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 60);
  const location = clean(body.location, 200);

  if (!company || !contact_name || !email || !phone || !location) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (categories.length === 0) {
    return NextResponse.json({ error: "Please select at least one equipment category." }, { status: 400 });
  }

  try {
    const saved = await createApplication({
      company,
      contact_name,
      email,
      phone,
      location,
      categories,
      equipment_summary: clean(body.equipment_summary, 3000),
      rc_number: clean(body.rc_number, 60),
    });
    await Promise.all([sendApplicationReceived(saved), sendAdminNewApplication(saved)]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vendor application error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email sales@aerojim.com." },
      { status: 500 }
    );
  }
}

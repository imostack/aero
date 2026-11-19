import { NextResponse } from "next/server";
import { autoDispatch } from "@/lib/dispatch";
import { sendAdminNewRequest, sendRequestReceived } from "@/lib/email";
import { getEquipmentCategory } from "@/lib/equipment";
import { createRequest } from "@/lib/rfq";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "aol.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
]);

const clean = (v: unknown, max = 500) =>
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

  const category = getEquipmentCategory(clean(body.category));
  if (!category) {
    return NextResponse.json({ error: "Please choose an equipment category." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 200).toLowerCase();
  const location = clean(body.location, 200);

  if (!name || !company || !email || !location) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (FREE_EMAIL_DOMAINS.has(email.split("@")[1])) {
    return NextResponse.json(
      { error: "Please use your company email address (not Gmail, Yahoo, etc.)." },
      { status: 400 }
    );
  }

  // Only keep the fields this category defines.
  const rawDetails = (body.details ?? {}) as Record<string, unknown>;
  const details: Record<string, string> = {};
  for (const f of category.fields) {
    const value = clean(rawDetails[f.name], 2000);
    if (f.required && !value) {
      return NextResponse.json({ error: `Please provide: ${f.label}.` }, { status: 400 });
    }
    if (value) details[f.name] = value;
  }

  try {
    const saved = await createRequest({
      category: category.slug,
      name,
      company,
      email,
      phone: clean(body.phone, 60),
      location,
      start_date: clean(body.start_date, 20),
      duration: clean(body.duration, 120),
      details,
      notes: clean(body.notes, 3000),
    });

    const invited = await autoDispatch(saved);
    await Promise.all([sendRequestReceived(saved), sendAdminNewRequest(saved, invited)]);

    return NextResponse.json({ success: true, ref: saved.ref, token: saved.token });
  } catch (err) {
    console.error("RFQ error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email sales@aerojim.com." },
      { status: 500 }
    );
  }
}

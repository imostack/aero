import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, company, email, phone, country, category, product, quantity, message } = body;

  if (!name || !company || !email || !country || !product) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "AeroJim Enquiries <onboarding@resend.dev>",
    to: "sales@aerojim.com",
    replyTo: email,
    subject: `New RFQ from ${company} — ${product}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#0a1628;padding:24px 28px;border-radius:8px 8px 0 0">
          <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:2px">AERO<span style="color:#fbbf24">JIM</span></span>
          <p style="color:#fbbf24;font-size:11px;margin:2px 0 0;letter-spacing:3px;text-transform:uppercase">Energy Supply Solutions</p>
        </div>
        <div style="background:#f9fafb;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="margin:0 0 20px;font-size:18px;color:#0a1628">New Quote Request</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:160px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Company</td><td style="padding:8px 0;font-weight:600">${company}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#f59e0b">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Phone / WhatsApp</td><td style="padding:8px 0">${phone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Country</td><td style="padding:8px 0">${country}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Category</td><td style="padding:8px 0">${category || "—"}</td></tr>
            <tr style="background:#fff8e1"><td style="padding:10px 8px;color:#6b7280;font-weight:600">Product / Item</td><td style="padding:10px 8px;font-weight:700;color:#0a1628">${product}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Quantity</td><td style="padding:8px 0">${quantity || "—"}</td></tr>
          </table>
          ${message ? `<div style="margin-top:16px;padding:14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;color:#374151"><strong>Additional Details:</strong><br/><br/>${message}</div>` : ""}
          <p style="margin-top:20px;font-size:12px;color:#9ca3af">Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

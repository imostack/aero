import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, company, email, phone, country, category, product, quantity, message } = body;

  if (!name || !company || !email || !country || !product) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const logo = `<div style="background:#0a1628;padding:24px 28px;border-radius:8px 8px 0 0"><span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:2px">AERO<span style="color:#fbbf24">JIM</span></span><p style="color:#fbbf24;font-size:11px;margin:2px 0 0;letter-spacing:3px;text-transform:uppercase">Energy Supply Solutions</p></div>`;

  const [internalResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: "AeroJim Enquiries <enquiries@mail.aerojim.com>",
      to: "sales@mail.aerojim.com",
      replyTo: email,
      subject: `New RFQ from ${company} — ${product}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          ${logo}
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
            <p style="margin-top:20px;font-size:12px;color:#9ca3af">Hit <strong>Reply</strong> to respond directly to ${name} at ${email}.</p>
          </div>
        </div>
      `,
    }),
    resend.emails.send({
      from: "AeroJim <noreply@mail.aerojim.com>",
      to: email,
      subject: "We've received your enquiry — AeroJim",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          ${logo}
          <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
            <p style="font-size:15px;margin:0 0 16px">Hi ${name},</p>
            <p style="font-size:15px;margin:0 0 16px">Thank you for reaching out. We've received your enquiry for <strong>${product}</strong> and a member of our team will get back to you within <strong>24 hours</strong> on business days.</p>
            <p style="font-size:15px;margin:0 0 24px">If you have additional specifications or documents to share, simply reply to this email.</p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;font-size:13px;color:#374151">
              <strong style="display:block;margin-bottom:8px;color:#0a1628">Your Enquiry Summary</strong>
              <p style="margin:4px 0"><span style="color:#6b7280">Product:</span> ${product}</p>
              ${quantity ? `<p style="margin:4px 0"><span style="color:#6b7280">Quantity:</span> ${quantity}</p>` : ""}
              ${category ? `<p style="margin:4px 0"><span style="color:#6b7280">Category:</span> ${category}</p>` : ""}
            </div>
            <p style="font-size:14px;margin:24px 0 4px">Best regards,</p>
            <p style="font-size:14px;margin:0;font-weight:600;color:#0a1628">AeroJim Energy Supply Solutions</p>
            <p style="font-size:13px;margin:4px 0 0;color:#6b7280"><a href="mailto:sales@mail.aerojim.com" style="color:#f59e0b">sales@mail.aerojim.com</a></p>
          </div>
        </div>
      `,
    }),
  ]);

  if (internalResult.error || confirmationResult.error) {
    const error = internalResult.error ?? confirmationResult.error;
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email", detail: error!.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

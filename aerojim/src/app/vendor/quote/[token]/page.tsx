import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { CURRENCIES, categoryName, getEquipmentCategory } from "@/lib/equipment";
import { getInviteByToken, fmtDate } from "@/lib/rfq";
import { inputCls, labelCls, primaryBtn } from "@/components/ui";
import { submitResponse } from "./actions";

export const metadata: Metadata = {
  title: "Availability & Rates | AeroJim",
  robots: { index: false, follow: false },
};

export default async function VendorQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ done?: string; error?: string }>;
}) {
  const { token } = await params;
  const { done, error } = await searchParams;
  const found = await getInviteByToken(token);
  if (!found) notFound();

  const { invite, request } = found;
  const cat = getEquipmentCategory(request.category);
  const closed =
    request.status === "accepted" || request.status === "closed" || request.status === "declined";
  const responded = !!invite.responded_at;

  return (
    <section className="py-12 bg-[#f8f9fa]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2">
          Request {request.ref}
        </p>
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">
          {categoryName(request.category)}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Hello {invite.vendor_contact || invite.vendor_name}. Please tell us whether you can supply
          the equipment below, and your net rates.
        </p>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-[#0a1628] mb-3 text-sm">Requirement</h2>
          <dl className="text-sm grid grid-cols-3 gap-y-2">
            <dt className="text-gray-500">Location</dt>
            <dd className="col-span-2 font-semibold">{request.location}</dd>
            <dt className="text-gray-500">Required from</dt>
            <dd className="col-span-2 font-semibold">{request.start_date ? fmtDate(request.start_date) : "—"}</dd>
            <dt className="text-gray-500">Duration</dt>
            <dd className="col-span-2 font-semibold">{request.duration || "—"}</dd>
            {cat?.fields
              .filter((f) => request.details[f.name])
              .map((f) => (
                <div key={f.name} className="contents">
                  <dt className="text-gray-500">{f.label}</dt>
                  <dd className="col-span-2 font-semibold whitespace-pre-line">{request.details[f.name]}</dd>
                </div>
              ))}
            {request.notes && (
              <>
                <dt className="text-gray-500">Notes</dt>
                <dd className="col-span-2 whitespace-pre-line">{request.notes}</dd>
              </>
            )}
          </dl>
        </div>

        {done && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 text-sm">
            <CheckCircle size={18} /> Thank you — your response has been recorded. You can update it below
            until the request is closed.
          </div>
        )}
        {error === "rate" && (
          <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            Please enter a valid day rate.
          </p>
        )}

        {closed ? (
          <p className="bg-white border border-gray-100 rounded-xl p-6 text-sm text-gray-600">
            This request has been closed. Thank you for your response.
          </p>
        ) : (
          <form action={submitResponse} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <input type="hidden" name="token" value={token} />

            <div>
              <label className={labelCls}>Is this equipment available? *</label>
              <select
                name="available"
                required
                defaultValue={invite.available === null ? "" : invite.available ? "yes" : "no"}
                className={inputCls}
              >
                <option value="">Select…</option>
                <option value="yes">Yes — available</option>
                <option value="no">No — not available</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>Currency</label>
                <select name="currency" defaultValue={invite.currency ?? "USD"} className={inputCls}>
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Day rate (net)</label>
                <input name="day_rate" inputMode="decimal" defaultValue={invite.day_rate ?? ""} placeholder="e.g. 4500" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Mobilisation / demob</label>
                <input name="mob_cost" inputMode="decimal" defaultValue={invite.mob_cost ?? ""} placeholder="e.g. 12000" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Lead time to mobilise</label>
                <input name="lead_time" defaultValue={invite.lead_time ?? ""} placeholder="e.g. 10 days" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Your quote valid until</label>
                <input type="date" name="valid_until" defaultValue={invite.valid_until ?? ""} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Notes (condition, certification, crew, exclusions…)</label>
              <textarea name="vendor_notes" rows={4} defaultValue={invite.vendor_notes ?? ""} className={`${inputCls} resize-none`} />
            </div>

            <button type="submit" className={`${primaryBtn} w-full`}>
              {responded ? "Update response" : "Submit response"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

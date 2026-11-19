import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { siteUrl } from "@/lib/email";
import { categoryName, getEquipmentCategory } from "@/lib/equipment";
import {
  fmtDate,
  getRequest,
  listFinderQuotes,
  listInvites,
  money,
  vendorsForCategory,
} from "@/lib/rfq";
import { CURRENCIES } from "@/lib/equipment";
import { inputCls, labelCls, primaryBtn, secondaryBtn } from "@/components/ui";
import AdminNav from "../../AdminNav";
import { addManualResponse, addVendorsToRequest, closeRequest, declineRequest, remindVendor } from "../../actions";
import MarkupForm from "./MarkupForm";

export const metadata: Metadata = {
  title: "Request | AeroJim Admin",
  robots: { index: false, follow: false },
};

const DEFAULT_MARKUP = Number(process.env.DEFAULT_MARKUP_PCT ?? 15);

export default async function AdminRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string; logged?: string; declined?: string; error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { sent, logged, declined, error } = await searchParams;
  const request = Number.isInteger(Number(id)) ? await getRequest(Number(id)) : null;
  if (!request) notFound();

  const [invites, quotes, categoryVendors] = await Promise.all([
    listInvites(request.id),
    listFinderQuotes(request.id),
    vendorsForCategory(request.category),
  ]);
  const cat = getEquipmentCategory(request.category);
  const invitedIds = new Set(invites.map((i) => i.vendor_id));
  const uninvited = categoryVendors.filter((v) => !invitedIds.has(v.id));
  const settled =
    request.status === "accepted" || request.status === "closed" || request.status === "declined";
  const allUnavailable =
    invites.length > 0 && invites.every((i) => i.responded_at && !i.available);
  const defaultDecline = `Thank you for your request for ${categoryName(request.category)}. Unfortunately, we are unable to source equipment matching your requirements at this time.`;

  return (
    <section className="py-10 bg-[#f8f9fa] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <AdminNav active="requests" />

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-600">
              {request.ref} · {request.status}
            </p>
            <h1 className="text-2xl font-black text-[#0a1628]">{categoryName(request.category)}</h1>
          </div>
          {!settled && (
            <form action={closeRequest}>
              <input type="hidden" name="requestId" value={request.id} />
              <button className={secondaryBtn}>Close request</button>
            </form>
          )}
        </div>

        {declined && <p className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-6 text-sm">The client has been told we can&apos;t source this.</p>}
        {request.status === "declined" && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm"><strong>Declined.</strong> Message sent to client: {request.decline_note}</p>}
        {allUnavailable && !settled && <p className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 mb-6 text-sm">Every vendor asked says they can&apos;t supply this. Log a quote from another source below, or tell the client we can&apos;t source it.</p>}
        {logged && <p className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-6 text-sm">Vendor quote logged. Set your markup below and send it to the client.</p>}
        {sent && <p className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-6 text-sm">Quote sent to client.</p>}
        {error === "decline" && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">Please write a message for the client.</p>}
        {error && error !== "decline" && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">Couldn&apos;t save that — check the vendor name, rate and markup.</p>}

        {/* Request details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0a1628] mb-3 text-sm">Client (private)</h2>
            <p className="font-semibold">{request.name}</p>
            <p className="text-sm text-gray-600">{request.company}</p>
            <p className="text-sm"><a className="text-amber-700" href={`mailto:${request.email}`}>{request.email}</a></p>
            {request.phone && <p className="text-sm text-gray-600">{request.phone}</p>}
            <p className="text-xs text-gray-400 mt-3">
              Client link:{" "}
              <a className="underline" href={`${siteUrl()}/quote/${request.token}`}>/quote/{request.token.slice(0, 8)}…</a>
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0a1628] mb-3 text-sm">Requirement</h2>
            <dl className="text-sm grid grid-cols-3 gap-y-1.5">
              <dt className="text-gray-500">Location</dt><dd className="col-span-2">{request.location}</dd>
              <dt className="text-gray-500">From</dt><dd className="col-span-2">{request.start_date ? fmtDate(request.start_date) : "—"}</dd>
              <dt className="text-gray-500">Duration</dt><dd className="col-span-2">{request.duration || "—"}</dd>
              {cat?.fields.filter((f) => request.details[f.name]).map((f) => (
                <div key={f.name} className="contents">
                  <dt className="text-gray-500">{f.label}</dt>
                  <dd className="col-span-2 whitespace-pre-line">{request.details[f.name]}</dd>
                </div>
              ))}
              {request.notes && (<><dt className="text-gray-500">Notes</dt><dd className="col-span-2 whitespace-pre-line">{request.notes}</dd></>)}
            </dl>
          </div>
        </div>

        {/* Vendor responses + quote builder */}
        <h2 className="text-lg font-black text-[#0a1628] mb-3">Vendor responses</h2>
        <div className="space-y-4 mb-6">
          {invites.length === 0 && (
            <p className="text-sm text-gray-500">No vendors contacted yet.</p>
          )}
          {invites.map((inv) => {
            const sentQuote = quotes.find((q) => q.request_vendor_id === inv.id);
            return (
              <div key={inv.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-[#0a1628]">{inv.vendor_name}</p>
                    <p className="text-xs text-gray-500">
                      {inv.sent_at ? `Emailed ${fmtDate(inv.sent_at)}` : inv.responded_at ? "Logged manually" : "Email not sent"}
                      {inv.reminded_at ? ` · reminded ${fmtDate(inv.reminded_at)}` : ""}
                    </p>
                  </div>
                  {!inv.responded_at ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Awaiting reply</span>
                      {!settled && (
                        <form action={remindVendor}>
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="inviteId" value={inv.id} />
                          <button className="text-xs underline text-amber-700">Send reminder</button>
                        </form>
                      )}
                    </div>
                  ) : inv.available ? (
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Available</span>
                  ) : (
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Not available</span>
                  )}
                </div>

                {inv.responded_at && inv.available && (
                  <>
                    <dl className="text-sm grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div><dt className="text-xs text-gray-500">Vendor day rate</dt><dd className="font-bold">{money(inv.day_rate, inv.currency)}</dd></div>
                      <div><dt className="text-xs text-gray-500">Mobilisation</dt><dd className="font-semibold">{money(inv.mob_cost, inv.currency)}</dd></div>
                      <div><dt className="text-xs text-gray-500">Lead time</dt><dd>{inv.lead_time || "—"}</dd></div>
                      <div><dt className="text-xs text-gray-500">Valid until</dt><dd>{inv.valid_until ? fmtDate(inv.valid_until) : "—"}</dd></div>
                    </dl>
                    {inv.vendor_notes && <p className="text-sm text-gray-600 mt-3 whitespace-pre-line bg-gray-50 rounded p-3">{inv.vendor_notes}</p>}

                    {sentQuote && (
                      <p className="text-sm text-green-700 mt-3">
                        ✓ Quoted to client at {money(sentQuote.day_rate, sentQuote.currency)}/day
                        ({sentQuote.markup_pct}% markup){request.accepted_quote_id === sentQuote.id ? " — ACCEPTED" : ""}
                      </p>
                    )}
                    {!settled && !sentQuote && (
                      <MarkupForm
                        requestId={request.id}
                        inviteId={inv.id}
                        currency={inv.currency ?? "USD"}
                        vendorRate={inv.day_rate ?? 0}
                        vendorMob={inv.mob_cost ?? 0}
                        defaultMarkup={DEFAULT_MARKUP}
                        leadTime={inv.lead_time ?? ""}
                        validUntil={inv.valid_until ?? ""}
                      />
                    )}
                  </>
                )}
                {inv.responded_at && !inv.available && inv.vendor_notes && (
                  <p className="text-sm text-gray-600 mt-3 bg-gray-50 rounded p-3">{inv.vendor_notes}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Manual (off-platform) quote */}
        {!settled && (
          <details className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6" open={invites.length === 0}>
            <summary className="font-bold text-[#0a1628] text-sm cursor-pointer">
              Log a quote from a vendor outside the network
            </summary>
            <form action={addManualResponse} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="hidden" name="requestId" value={request.id} />
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="vendor_name">Vendor / owner name *</label>
                <input id="vendor_name" name="vendor_name" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="vendor_contact">Phone or email</label>
                <input id="vendor_contact" name="vendor_contact" className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="currency">Currency</label>
                <select id="currency" name="currency" className={inputCls}>
                  {CURRENCIES.map((c) => (<option key={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="day_rate">Their day rate (net) *</label>
                <input id="day_rate" name="day_rate" required inputMode="decimal" className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="mob_cost">Mobilisation</label>
                <input id="mob_cost" name="mob_cost" inputMode="decimal" className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="lead_time">Lead time</label>
                <input id="lead_time" name="lead_time" className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="valid_until">Valid until</label>
                <input id="valid_until" type="date" name="valid_until" className={inputCls} />
              </div>
              <div className="sm:col-span-3">
                <label className={labelCls} htmlFor="vendor_notes">Private notes</label>
                <textarea id="vendor_notes" name="vendor_notes" rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div className="sm:col-span-3">
                <button type="submit" className={primaryBtn}>Log quote</button>
              </div>
            </form>
          </details>
        )}

        {/* Can't source it */}
        {!settled && (
          <details className="bg-white rounded-xl border border-red-100 shadow-sm p-5 mb-6">
            <summary className="font-bold text-red-700 text-sm cursor-pointer">
              Can&apos;t source this — tell the client
            </summary>
            <form action={declineRequest} className="mt-4 space-y-3">
              <input type="hidden" name="requestId" value={request.id} />
              <label className={labelCls} htmlFor="decline_note">
                Message to client (emailed, and shown on their request page)
              </label>
              <textarea id="decline_note" name="note" rows={4} required defaultValue={defaultDecline} className={`${inputCls} resize-none`} />
              <button type="submit" className={secondaryBtn}>Send &amp; mark as unavailable</button>
            </form>
          </details>
        )}

        {/* Add more vendors */}
        {!settled && uninvited.length > 0 && (
          <form action={addVendorsToRequest} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <input type="hidden" name="requestId" value={request.id} />
            <h3 className="font-bold text-[#0a1628] text-sm mb-3">Ask more vendors</h3>
            <div className="flex flex-wrap gap-4 mb-3">
              {uninvited.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="vendorIds" value={v.id} /> {v.name}
                </label>
              ))}
            </div>
            <button className={primaryBtn}>Send request</button>
          </form>
        )}
        <p className="mt-8 text-sm">
          <Link href="/admin" className="text-amber-700 hover:underline">← All requests</Link>
        </p>
      </div>
    </section>
  );
}

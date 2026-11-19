import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { categoryName } from "@/lib/equipment";
import { fmtDate, getRequestByToken, listFinderQuotes, money } from "@/lib/rfq";
import { primaryBtn } from "@/components/ui";
import { acceptFinderQuote } from "./actions";

export const metadata: Metadata = {
  title: "Your Quote | AeroJim",
  robots: { index: false, follow: false },
};

export default async function FinderQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const request = await getRequestByToken(token);
  if (!request) notFound();

  const quotes = await listFinderQuotes(request.id);
  const accepted = quotes.find((q) => q.id === request.accepted_quote_id);
  const open = request.status === "open" || request.status === "quoted";

  return (
    <section className="py-12 bg-[#f8f9fa]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2">
          Request {request.ref}
        </p>
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">{categoryName(request.category)}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {request.location} · Submitted {fmtDate(request.created_at)}
        </p>

        {accepted && (
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 mb-6 text-sm">
            <CheckCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <strong>Quote accepted.</strong> Our team will contact you shortly with the agreement and
              next steps.
            </div>
          </div>
        )}

        {request.status === "closed" && !accepted && (
          <p className="bg-white border border-gray-100 rounded-xl p-6 text-sm text-gray-600 mb-6">
            This request has been closed. Please submit a new request if you still need equipment.
          </p>
        )}

        {quotes.length === 0 && request.status !== "closed" && (
          <div className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-6 text-sm text-gray-600">
            <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              We&apos;re checking availability and rates with our vendors. You&apos;ll receive an email as
              soon as your quote is ready — typically within 24–48 hours.
            </div>
          </div>
        )}

        <div className="space-y-4">
          {quotes.map((q, i) => {
            const isAccepted = q.id === request.accepted_quote_id;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border shadow-sm p-6 ${isAccepted ? "border-green-300" : "border-gray-100"}`}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="font-bold text-[#0a1628]">
                    {quotes.length > 1 ? `Option ${String.fromCharCode(65 + i)}` : "Quote"}
                  </h2>
                  <span className="text-xs text-gray-400">Sent {fmtDate(q.sent_at)}</span>
                </div>
                <dl className="text-sm grid grid-cols-3 gap-y-2 mb-4">
                  <dt className="text-gray-500">Day rate</dt>
                  <dd className="col-span-2 font-black text-lg text-[#0a1628]">{money(q.day_rate, q.currency)}</dd>
                  <dt className="text-gray-500">Mobilisation</dt>
                  <dd className="col-span-2 font-semibold">{money(q.mob_cost, q.currency)}</dd>
                  <dt className="text-gray-500">Lead time</dt>
                  <dd className="col-span-2 font-semibold">{q.lead_time || "—"}</dd>
                  <dt className="text-gray-500">Valid until</dt>
                  <dd className="col-span-2 font-semibold">{q.valid_until ? fmtDate(q.valid_until) : "—"}</dd>
                </dl>
                {q.notes && <p className="text-sm text-gray-600 whitespace-pre-line mb-4">{q.notes}</p>}
                {open && (
                  <form action={acceptFinderQuote}>
                    <input type="hidden" name="token" value={token} />
                    <input type="hidden" name="quoteId" value={q.id} />
                    <button type="submit" className={primaryBtn}>
                      Accept this quote
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Questions? Email <a className="underline" href="mailto:sales@aerojim.com">sales@aerojim.com</a> and quote{" "}
          {request.ref}.
        </p>
      </div>
    </section>
  );
}

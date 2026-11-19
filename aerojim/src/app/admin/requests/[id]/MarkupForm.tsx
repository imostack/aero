"use client";

import { useState } from "react";
import { inputCls, labelCls, primaryBtn } from "@/components/ui";
import { sendQuote } from "../../actions";

interface Props {
  requestId: number;
  inviteId: number;
  currency: string;
  vendorRate: number;
  vendorMob: number;
  defaultMarkup: number;
  leadTime: string;
  validUntil: string;
}

const round = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number, c: string) =>
  `${c === "NGN" ? "₦" : "$"}${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function MarkupForm(p: Props) {
  const [markup, setMarkup] = useState(String(p.defaultMarkup));
  const m = Number(markup);
  const valid = Number.isFinite(m) && m >= 0;
  const rate = valid ? round(p.vendorRate * (1 + m / 100)) : null;
  const mob = valid ? round(p.vendorMob * (1 + m / 100)) : null;
  const profit = valid ? round((rate! - p.vendorRate)) : null;

  return (
    <form action={sendQuote} className="mt-4 border-t border-gray-100 pt-4 space-y-3">
      <input type="hidden" name="requestId" value={p.requestId} />
      <input type="hidden" name="inviteId" value={p.inviteId} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelCls}>Markup %</label>
          <input
            name="markup"
            inputMode="decimal"
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Lead time (to client)</label>
          <input name="lead_time" defaultValue={p.leadTime} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Quote valid until</label>
          <input type="date" name="valid_until" defaultValue={p.validUntil} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Note to client (optional — don&apos;t include vendor name)</label>
        <textarea name="notes" rows={2} className={`${inputCls} resize-none`} />
      </div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-gray-600">
          Client sees:{" "}
          <strong className="text-[#0a1628]">
            {rate != null ? `${fmt(rate, p.currency)}/day` : "—"}
          </strong>
          {" · mob "}
          <strong>{mob != null ? fmt(mob, p.currency) : "—"}</strong>
          {" · "}
          <span className="text-green-700">your margin {profit != null ? `${fmt(profit, p.currency)}/day` : "—"}</span>
        </p>
        <button type="submit" disabled={!valid} className={primaryBtn}>
          Send quote to client
        </button>
      </div>
    </form>
  );
}

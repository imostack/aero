import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import RequestForm from "./RequestForm";

export const metadata: Metadata = {
  title: "Request Equipment on Lease | AeroJim",
  description:
    "Submit a lease request for well testing equipment or barges. We source availability and day rates for you.",
};

export default function RequestPage() {
  return (
    <>
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Link href="/equipment" className="hover:text-white transition-colors">
              Equipment Leasing
            </Link>
            <span className="text-white/30">/</span>
            <span>Request</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Request equipment on lease</h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            The more detail you give, the faster and more accurate your quote.
          </p>
        </div>
      </section>
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <RequestForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

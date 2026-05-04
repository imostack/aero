import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Request a Quote | AeroJim Oil & Gas Supply",
  description:
    "Submit your RFQ or enquiry for oil and gas equipment. AeroJim responds to all wholesale quote requests within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#0a1628] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span>Contact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Request a Quote
          </h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Submit your RFQ, enquiry, or material requisition below. Our team
            will respond with pricing and availability within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, Target, Users, Globe2, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AeroJim Oil & Gas Supply",
  description:
    "Learn about AeroJim — a wholesale distributor of oil and gas equipment, parts, and ancillaries serving upstream and downstream markets globally.",
};

const values = [
  {
    icon: Target,
    title: "Precision Supply",
    body: "We don't just ship parts — we ensure every item meets the technical specification, pressure rating, and material grade required for safe operation.",
  },
  {
    icon: Users,
    title: "Partnership Approach",
    body: "We work as an extension of our customers' procurement teams — understanding their projects, timelines, and quality requirements.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    body: "Our supplier network spans major manufacturing hubs worldwide, giving us access to API, ASME, and ISO-certified stock at competitive wholesale prices.",
  },
  {
    icon: Award,
    title: "Standards Compliance",
    body: "Every product we supply comes with the appropriate certification — MTC, CoC, and third-party inspection reports available on request.",
  },
];

export default function AboutPage() {
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
            <span>About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4">About AeroJim</h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            A dedicated wholesale supplier of oil & gas equipment, parts, and
            ancillaries — serving upstream and downstream operators, EPC
            contractors, and MRO procurement teams worldwide.
          </p>
        </div>
      </section>

      {/* Mission / Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-[#0a1628] mb-5">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AeroJim is a wholesale distributor specialising in oil and gas
                  accessories, parts, and ancillary equipment for both upstream
                  and downstream sectors. We supply operators, drilling
                  contractors, EPC firms, and procurement teams who need
                  reliable, standards-compliant equipment at competitive
                  wholesale prices.
                </p>
                <p>
                  Our product range spans the full value chain — from wellhead
                  and drilling consumables to refinery valves, pipeline fittings,
                  instrumentation, and safety systems. Whether you need a single
                  critical part or a full bill of materials for a project, we
                  have the sourcing capability and logistics to deliver.
                </p>
                <p>
                  We operate with transparency and technical integrity. Every
                  order is backed by proper documentation — material test
                  reports, certificates of conformance, and third-party
                  inspection where required. Our team includes experienced
                  technical staff who can advise on product selection, material
                  compatibility, and compliance requirements.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-7 py-3 rounded text-sm transition-colors"
              >
                Get in Touch <ArrowRight size={15} />
              </Link>
            </div>

            {/* Stats panel */}
            <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
              <h3 className="text-amber-400 font-semibold text-xs tracking-widest uppercase mb-8">
                What We Offer
              </h3>
              <div className="space-y-6">
                {[
                  {
                    num: "10+",
                    label: "Product categories covering upstream to downstream",
                  },
                  {
                    num: "500+",
                    label: "Individual product lines sourced and supplied",
                  },
                  {
                    num: "API / ASME",
                    label: "Standards certified across all major product categories",
                  },
                  {
                    num: "24hr",
                    label: "Target response time on all quote requests",
                  },
                  {
                    num: "B2B",
                    label:
                      "Wholesale supply focused — bulk and project orders welcome",
                  },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-4">
                    <div className="text-2xl font-black text-amber-400 w-28 shrink-0">
                      {item.num}
                    </div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#0a1628] mb-3">
              Our Core Values
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              These principles guide how we source, supply, and support our
              customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-7 flex gap-5"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <v.icon size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1628] text-base mb-2">
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0a1628] mb-8 text-center">
            Sectors We Serve
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: "🛢️", label: "Upstream E&P" },
              { icon: "🔩", label: "Drilling" },
              { icon: "⛽", label: "Well Completion" },
              { icon: "🏭", label: "Gas Processing" },
              { icon: "⚙️", label: "Oil Refining" },
              { icon: "🚇", label: "Pipeline & Midstream" },
              { icon: "🌊", label: "Offshore" },
              { icon: "🏗️", label: "EPC / Construction" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-semibold text-[#0a1628]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Let&apos;s Work Together
          </h2>
          <p className="text-gray-400 mb-6">
            Whether you have a specific RFQ or want to discuss a supply
            partnership, we&apos;re ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-8 py-3.5 rounded text-sm transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white font-semibold px-8 py-3.5 rounded text-sm transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

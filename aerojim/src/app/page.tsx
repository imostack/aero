import Link from "next/link";
import { categories } from "@/lib/products";
import {
  CheckCircle,
  Globe,
  PackageCheck,
  Headphones,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

const stats = [
  { value: "10+", label: "Product Categories" },
  { value: "500+", label: "Product Lines" },
  { value: "Global", label: "Supply Chain" },
  { value: "B2B", label: "Wholesale Only" },
];

const whyUs = [
  {
    icon: PackageCheck,
    title: "API & ASME Certified Stock",
    body: "Every product we supply meets API, ASME, ANSI, and international standards required for oil & gas applications.",
  },
  {
    icon: Globe,
    title: "Global Sourcing Network",
    body: "We source from approved manufacturers worldwide so you get the best quality at competitive wholesale prices.",
  },
  {
    icon: Headphones,
    title: "Dedicated Technical Support",
    body: "Our engineering team helps you specify the right products — from material grades to pressure ratings and end connections.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    body: "Full material traceability, MTRs, and third-party inspection available on all orders.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Wholesale Pricing",
    body: "Volume pricing and framework agreements available for contractors, EPC companies, and operators.",
  },
  {
    icon: Wrench,
    title: "Upstream & Downstream Coverage",
    body: "From wellhead and drilling to refinery and pipeline — we cover the full value chain.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              Wholesale Oil & Gas Supply
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Your Trusted Source for{" "}
              <span className="text-amber-400">Oil & Gas</span> Equipment &
              Parts
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
              AeroJim supplies wholesale accessories, parts, and ancillaries for
              upstream and downstream oil & gas operations from wellhead
              components and API valves to flanges, instrumentation, and safety
              systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-7 py-3.5 rounded text-sm tracking-wide transition-colors"
              >
                Browse Products <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-amber-400 hover:text-amber-400 text-white font-semibold px-7 py-3.5 rounded text-sm tracking-wide transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#0d1f3c] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="text-3xl font-black text-amber-400">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1 tracking-wide uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] mb-3">
              Product Categories
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Comprehensive range of oil & gas equipment parts and accessories
              for all your upstream and downstream needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="group bg-[#f8f9fa] hover:bg-[#0a1628] border border-gray-100 hover:border-[#0a1628] rounded-xl p-6 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-[#0a1628] group-hover:text-white text-base mb-2 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed line-clamp-2 transition-colors">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-amber-500 group-hover:text-amber-400 text-xs font-semibold tracking-wide transition-colors">
                  View Products <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#0d2550] text-white font-semibold px-8 py-3 rounded text-sm transition-colors"
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why AeroJim */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] mb-3">
              Why Choose AeroJim?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We understand the demands of the oil & gas industry. Our supply
              solutions are built around reliability, compliance, and speed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-amber-500" />
                </div>
                <h3 className="font-bold text-[#0a1628] text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries served */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black text-[#0a1628] mb-10">
            Industries & Sectors We Supply
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Upstream Exploration & Production",
              "Drilling Operations",
              "Well Completion & Workover",
              "Gas Processing",
              "Oil Refining",
              "Pipeline & Midstream",
              "LNG / LPG Facilities",
              "Petrochemicals",
              "Offshore Platforms",
              "EPC Contractors",
              "MRO Procurement",
            ].map((sector) => (
              <span
                key={sector}
                className="bg-[#f0f4ff] text-[#0a1628] border border-[#c7d5f0] text-sm font-medium px-4 py-2 rounded-full"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-amber-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1628] mb-4">
            Ready to Place a Wholesale Order?
          </h2>
          <p className="text-[#0a1628]/70 text-lg mb-8">
            Send us your RFQ, material requisition, or enquiry and we will
            respond within 24 hours with pricing and availability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#0a1628] hover:bg-[#0d2550] text-white font-bold px-8 py-3.5 rounded text-sm transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/products"
              className="bg-white hover:bg-gray-100 text-[#0a1628] font-bold px-8 py-3.5 rounded text-sm transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

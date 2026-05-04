import Link from "next/link";
import { categories } from "@/lib/products";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | AeroJim Oil & Gas Supply",
  description:
    "Browse AeroJim's full range of wholesale oil and gas equipment — valves, wellhead, flanges, pipes, instrumentation, safety systems and more.",
};

export default function ProductsPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span>Products</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Our Product Range
          </h1>
          <p className="text-gray-400 max-w-2xl">
            AeroJim stocks and sources a comprehensive range of oil and gas
            equipment, parts, and ancillaries. All products supplied to API,
            ASME, and applicable international standards.
          </p>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="group bg-white rounded-xl border border-gray-100 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="bg-[#0a1628] group-hover:bg-[#0d2550] px-7 py-5 flex items-center gap-4 transition-colors">
                  <span className="text-3xl">{cat.icon}</span>
                  <h2 className="text-white font-bold text-lg">{cat.name}</h2>
                </div>

                {/* Card body */}
                <div className="px-7 py-5 flex-1">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cat.products.slice(0, 4).map((p) => (
                      <span
                        key={p.id}
                        className="text-xs bg-[#f0f4ff] text-[#0a1628] border border-[#c7d5f0] px-3 py-1 rounded-full font-medium"
                      >
                        {p.name}
                      </span>
                    ))}
                    {cat.products.length > 4 && (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-medium">
                        +{cat.products.length - 4} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 group-hover:text-amber-500 text-sm font-semibold transition-colors">
                    View all {cat.products.length} product types{" "}
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Can&apos;t find what you need?
          </h2>
          <p className="text-gray-400 mb-6">
            We source a wide range of oil & gas equipment beyond what is listed.
            Send us your enquiry and we&apos;ll find it for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-8 py-3.5 rounded text-sm transition-colors"
          >
            Contact Our Team <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

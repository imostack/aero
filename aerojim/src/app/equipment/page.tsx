import Link from "next/link";
import type { Metadata } from "next";
import { categoriesByGroup } from "@/lib/equipment";

export const metadata: Metadata = {
  title: "Lease Upstream Oil & Gas Equipment | AeroJim",
  description:
    "Lease drilling, well testing, production, marine and support equipment for upstream oil and gas in Nigeria. Tell AeroJim what you need and we source availability and day rates.",
};

export default function EquipmentPage() {
  return (
    <>
      <section className="bg-[#0a1628] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Lease Equipment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Upstream equipment, sourced for you
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Choose a category, describe what you need, and AeroJim finds
            available equipment from trusted owners. You deal with us only, and you get one quote.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {categoriesByGroup().map(({ group, categories }) => (
            <div key={group.slug}>
              <h2 className="text-xl font-black text-[#0a1628]">{group.name}</h2>
              <p className="text-sm text-gray-500 mb-5">{group.blurb}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/equipment/request?category=${c.slug}`}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-300 transition p-6 flex flex-col"
                  >
                    <div className="text-3xl mb-2">{c.icon}</div>
                    <h3 className="font-bold text-[#0a1628] mb-1">{c.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{c.tagline}</p>
                    <p className="text-xs text-gray-400 mb-4">{c.examples.slice(0, 4).join(" · ")}</p>
                    <span className="mt-auto text-sm font-bold text-amber-600 group-hover:text-amber-500">
                      Request this →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

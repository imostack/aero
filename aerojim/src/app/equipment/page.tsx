import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import { equipmentCategories } from "@/lib/equipment";

export const metadata: Metadata = {
  title: "Equipment Leasing | AeroJim",
  description:
    "Lease well testing equipment and barges in Nigeria. Tell us what you need and AeroJim sources availability and day rates from vetted vendors.",
};

const steps = [
  ["Submit your request", "Tell us the equipment, specs, location and dates."],
  ["We source it", "We check availability and rates with our vetted vendors."],
  ["Receive your quote", "You get a clear day rate and terms, usually within 24–48 hours."],
  ["Accept & mobilise", "Accept online and we handle the agreement and logistics."],
];

export default function EquipmentPage() {
  return (
    <>
      <section className="bg-[#0a1628] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Equipment Leasing
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Lease oil &amp; gas equipment, sourced for you
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            One request, one quote. AeroJim works with vetted equipment owners
            to find available equipment at competitive day rates — you deal
            with us only.
          </p>
        </div>
      </section>

      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {equipmentCategories.map((c) => (
            <div key={c.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h2 className="text-xl font-bold text-[#0a1628] mb-1">{c.name}</h2>
              <p className="text-sm text-amber-600 font-semibold mb-3">{c.tagline}</p>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{c.description}</p>
              <ul className="space-y-1.5 mb-6 text-sm text-gray-600">
                {c.examples.map((e) => (
                  <li key={e} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-amber-500 mt-1 shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
              <Link
                href={`/equipment/request?category=${c.slug}`}
                className="mt-auto bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold text-sm px-5 py-3 rounded-lg text-center transition-colors"
              >
                Request {c.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0a1628] mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(([title, text], i) => (
              <div key={title}>
                <div className="w-9 h-9 rounded-full bg-[#0a1628] text-amber-400 font-bold flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#0a1628] mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

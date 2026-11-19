import Link from "next/link";
import { ArrowRight, ClipboardList, Handshake, Mail, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import { categoriesByGroup, equipmentCategories } from "@/lib/equipment";
import HeroSearch from "@/components/HeroSearch";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    body: "Describe the equipment, location and dates. It takes two minutes.",
  },
  {
    icon: PackageSearch,
    title: "We check with owners",
    body: "We ask our vetted equipment owners for availability and day rates.",
  },
  {
    icon: Handshake,
    title: "Get one clear quote",
    body: "You get a single quote from AeroJim, usually within 24–72 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Inspect and approve",
    body: "Accept online, then inspect and pressure test the equipment before it moves.",
  },
  {
    icon: Truck,
    title: "Mobilise",
    body: "Once you are satisfied, we coordinate mobilisation to your site.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero: what we do + the one thing to do */}
      <section className="bg-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase mb-5">
            Oil &amp; gas equipment leasing
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-5">
            Need equipment?
            <br />
            <span className="text-amber-400">Tell us. We&apos;ll find it.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Describe what you need to lease. AeroJim sources it from trusted
            owners and sends you one quote, with no calls to chase.
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-gray-400">Popular:</span>
            {equipmentCategories.filter((c) => c.featured).map((c) => (
              <Link
                key={c.slug}
                href={`/equipment/request?category=${c.slug}`}
                className="border border-white/20 hover:border-amber-400 hover:text-amber-400 rounded-full px-4 py-1.5 transition-colors"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a1628] text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 relative">
                  <s.icon size={24} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#0a1628] text-amber-400 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#0a1628] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can lease */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a1628] text-center mb-3">
            What you can lease
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Upstream oil &amp; gas equipment, sourced for you. Pick a category to start.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesByGroup()
              .filter(({ group }) => group.slug !== "other")
              .map(({ group, categories }) => (
                <div key={group.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-[#0a1628] mb-1">{group.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{group.blurb}</p>
                  <ul className="space-y-1.5">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/equipment/request?category=${c.slug}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-amber-600 transition-colors"
                        >
                          <span aria-hidden>{c.icon}</span> {c.name}
                          <ArrowRight size={13} className="ml-auto opacity-40" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            <Link
              href="/equipment/request?category=other-equipment"
              className="rounded-xl border-2 border-dashed border-amber-300 hover:bg-amber-50 transition p-6 flex flex-col justify-center text-center"
            >
              <div className="text-3xl mb-2">❓</div>
              <h3 className="font-bold text-[#0a1628] mb-1">Don&apos;t see it?</h3>
              <p className="text-sm text-gray-600">Tell us what you need and we&apos;ll find it.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className="py-16 bg-[#0a1628] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Own equipment? <span className="text-amber-400">Get it leased.</span>
          </h2>
          <p className="text-gray-300 mb-7">
            Join our vendor network. We bring you qualified lease requests, and
            you just confirm availability and your rate.
          </p>
          <Link
            href="/vendors/apply"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-7 py-3.5 rounded text-sm transition-colors"
          >
            <Mail size={16} /> Become a vendor
          </Link>
        </div>
      </section>

      {/* Parts, de-emphasised */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-600 text-sm">
            <strong className="text-[#0a1628]">Looking to buy, not lease?</strong>{" "}
            We also supply wholesale valves, flanges, wellhead equipment and other oil &amp; gas parts.
          </p>
          <Link
            href="/products"
            className="shrink-0 text-sm font-bold text-amber-600 hover:text-amber-500 inline-flex items-center gap-1.5"
          >
            Browse parts supply <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

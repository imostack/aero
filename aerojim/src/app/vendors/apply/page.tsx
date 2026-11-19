import Link from "next/link";
import type { Metadata } from "next";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "Become a Vendor | AeroJim",
  description:
    "Own upstream oil and gas equipment? Join the AeroJim vendor network and receive qualified lease requests.",
};

export default function ApplyPage() {
  return (
    <>
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span>Become a vendor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Own equipment? Get it leased.</h1>
          <p className="text-gray-400 max-w-xl leading-relaxed">
            Tell us what you own. We bring you qualified lease requests; you confirm availability and
            your rate. A representative will contact you after you apply.
          </p>
        </div>
      </section>
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}

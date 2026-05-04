import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const productLinks = [
  { label: "Valves", href: "/products/valves" },
  { label: "Wellhead & Christmas Trees", href: "/products/wellhead" },
  { label: "Flanges & Fittings", href: "/products/flanges-fittings" },
  { label: "Pipes, Casing & Tubing", href: "/products/pipes-tubing" },
  { label: "Pressure & Flow Control", href: "/products/pressure-control" },
  { label: "Instrumentation", href: "/products/flow-measurement" },
  { label: "Pumps & Compressors", href: "/products/pumps-compressors" },
  { label: "Seals & Gaskets", href: "/products/seals-gaskets" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060f1e] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-black tracking-widest text-white">
                AERO<span className="text-amber-400">JIM</span>
              </span>
              <p className="text-[10px] tracking-[0.2em] text-amber-400 uppercase font-medium mt-0.5">
                Energy Supply Solutions
              </p>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Wholesale supplier of oil & gas accessories, parts, and ancillaries
              for upstream and downstream operations worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-white/10 hover:bg-amber-500 hover:text-[#0a1628] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Products
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Request a Quote", href: "/contact" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <a
                  href="mailto:sales@aerojim.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  sales@aerojim.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <span>+234 906 489 2994</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <span>Aba ExpressWay, Port Harcourt, Nigeria</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-block bg-amber-500 hover:bg-amber-400 text-[#0a1628] text-xs font-bold px-5 py-2.5 rounded transition-colors tracking-wide"
            >
              Request a Quote →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} AeroJim Energy Supply Solutions. All rights reserved.</p>
          <p>Oil & Gas Wholesale Distributor</p>
        </div>
      </div>
    </footer>
  );
}

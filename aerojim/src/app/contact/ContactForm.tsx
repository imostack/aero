"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const productCategories = [
  "Valves",
  "Wellhead & Christmas Tree Equipment",
  "Flanges & Fittings",
  "Pipes, Casing & Tubing",
  "Pressure & Flow Control",
  "Flow Measurement & Instrumentation",
  "Pumps & Compressors",
  "Safety & Pressure Protection",
  "Seals, Gaskets & Packing",
  "Structural & Fasteners",
  "Other / Not Listed",
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefilledProduct = searchParams.get("product") || "";
  const prefilledCategory = searchParams.get("category") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    category: prefilledCategory,
    product: prefilledProduct,
    quantity: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Contact info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#0a1628] rounded-xl p-7 text-white">
          <h2 className="font-bold text-lg mb-5 text-amber-400">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={17} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Email</div>
                <a
                  href="mailto:sales@aerojim.com"
                  className="text-sm hover:text-amber-400 transition-colors"
                >
                  sales@aerojim.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={17} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Phone</div>
                <span className="text-sm">+234 703 447 9774</span>
                <span className="text-sm">+234 802 817 3123</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={17} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Coverage</div>
                <span className="text-sm">
                  Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#0a1628] mb-4">
            What to include in your RFQ
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Product name / description",
              "Tag number or item number",
              "Quantity required",
              "Pressure class & size",
              "Material grade (e.g. A105, SS316)",
              "End connections / flange type",
              "Applicable standard (API, ASME, etc.)",
              "Required delivery date / location",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle
                  size={13}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-[#0a1628] mb-2">
                Enquiry Received!
              </h2>
              <p className="text-gray-500 max-w-sm mb-6">
                Thank you for contacting AeroJim. Our team will review your
                request and respond within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-amber-600 hover:text-amber-500 font-semibold transition-colors"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-[#0a1628] mb-1">
                Quote Request Form
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Fields marked * are required.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Emeka Morris"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your Company Ltd"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="morris@company.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+234 908 000 0000"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Country *
                  </label>
                  <input
                    required
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Nigeria"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Product Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition bg-white"
                  >
                    <option value="">Select a category</option>
                    {productCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Product / Item Description *
                  </label>
                  <input
                    required
                    type="text"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    placeholder='e.g. Gate Valve 4" Class 600 API 6D'
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Quantity Required
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 10 units"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Additional Details / Specifications
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Include any additional specifications, tag numbers, standards, delivery requirements, or project details..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#0a1628] font-bold py-3.5 rounded-lg text-sm transition-colors"
              >
                <Send size={16} /> {loading ? "Sending…" : "Submit Enquiry"}
              </button>
              <p className="text-xs text-gray-400 text-center">
                We respond to all enquiries within 24 hours on business days.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

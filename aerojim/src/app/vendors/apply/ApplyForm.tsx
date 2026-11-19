"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { categoriesByGroup } from "@/lib/equipment";
import { inputCls, labelCls } from "@/components/ui";

export default function ApplyForm() {
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    email: "",
    phone: "",
    location: "",
    rc_number: "",
    equipment_summary: "",
    website: "", // honeypot
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggle = (slug: string) =>
    setCategories((p) => (p.includes(slug) ? p.filter((c) => c !== slug) : [...p, slug]));

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (categories.length === 0) {
      setError("Please select at least one equipment category.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vendors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, categories }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Application received</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Thank you. A representative from AeroJim will reach out to you shortly to discuss next
          steps. We&apos;ve also sent a confirmation to your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls} htmlFor="company">Company name *</label>
          <input id="company" required name="company" value={form.company} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="rc_number">CAC / RC number</label>
          <input id="rc_number" name="rc_number" value={form.rc_number} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="contact_name">Contact person *</label>
          <input id="contact_name" required name="contact_name" value={form.contact_name} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Phone / WhatsApp *</label>
          <input id="phone" required type="tel" name="phone" value={form.phone} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email *</label>
          <input id="email" required type="email" name="email" value={form.email} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="location">Where is your equipment based? *</label>
          <input id="location" required name="location" value={form.location} onChange={onChange} placeholder="e.g. Port Harcourt" className={inputCls} />
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>What equipment do you lease out? * (select all that apply)</legend>
        <div className="space-y-4 mt-2 border border-gray-100 rounded-lg p-4 max-h-80 overflow-y-auto">
          {categoriesByGroup()
            .filter(({ group }) => group.slug !== "other")
            .map(({ group, categories: cats }) => (
              <div key={group.slug}>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{group.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  {cats.map((c) => (
                    <label key={c.slug} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={categories.includes(c.slug)}
                        onChange={() => toggle(c.slug)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </fieldset>

      <div>
        <label className={labelCls} htmlFor="equipment_summary">Tell us about your equipment</label>
        <textarea
          id="equipment_summary"
          name="equipment_summary"
          rows={4}
          value={form.equipment_summary}
          onChange={onChange}
          placeholder="Types, sizes, quantities, condition, certifications, whether you can offer inspection at your yard…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#0a1628] font-bold py-3.5 rounded-lg text-sm transition-colors"
      >
        <Send size={16} /> {loading ? "Submitting…" : "Apply to join"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Your details stay with AeroJim. They are never shared with clients.
      </p>
    </form>
  );
}

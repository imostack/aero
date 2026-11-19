"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Send } from "lucide-react";
import { categoriesByGroup, equipmentCategories } from "@/lib/equipment";
import { inputCls, labelCls } from "@/components/ui";

export default function RequestForm() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") ?? "";

  const [category, setCategory] = useState(
    equipmentCategories.some((c) => c.slug === initial) ? initial : ""
  );
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    start_date: "",
    duration: "",
    notes: searchParams.get("q") ?? "",
    website: "", // honeypot
  });
  const [details, setDetails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ ref: string; token: string } | null>(null);

  const selected = equipmentCategories.find((c) => c.slug === category);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category, details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone({ ref: data.ref ?? "", token: data.token ?? "" });
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
        <h2 className="text-xl font-bold text-[#0a1628] mb-2">Request received</h2>
        {done.ref && (
          <p className="text-gray-500 mb-1">
            Your reference: <strong className="text-[#0a1628]">{done.ref}</strong>
          </p>
        )}
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We&apos;re checking availability and rates with our vendors and will email you a
          quote, typically within 24–72 hours.
        </p>
        {done.token && (
          <Link
            href={`/quote/${done.token}`}
            className="text-sm text-amber-600 hover:text-amber-500 font-semibold"
          >
            Track this request →
          </Link>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-5"
    >
      <div>
        <label className={labelCls}>Equipment category *</label>
        <select
          required
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setDetails({});
          }}
          className={inputCls}
        >
          <option value="">Select equipment…</option>
          {categoriesByGroup().map(({ group, categories }) => (
            <optgroup key={group.slug} label={group.name}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {selected && (
        <div className="space-y-5 border-l-4 border-amber-400 pl-5">
          <h3 className="font-bold text-[#0a1628] text-sm">{selected.name} — specifications</h3>
          {selected.fields.map((f) => (
            <div key={f.name}>
              <label className={labelCls}>
                {f.label}
                {f.required ? " *" : ""}
              </label>
              {f.type === "select" ? (
                <select
                  required={f.required}
                  value={details[f.name] ?? ""}
                  onChange={(e) => setDetails((p) => ({ ...p, [f.name]: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  required={f.required}
                  rows={4}
                  value={details[f.name] ?? ""}
                  onChange={(e) => setDetails((p) => ({ ...p, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <input
                  required={f.required}
                  type="text"
                  value={details[f.name] ?? ""}
                  onChange={(e) => setDetails((p) => ({ ...p, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <label className={labelCls}>Operating location *</label>
          <input required name="location" value={form.location} onChange={onChange} placeholder="e.g. Port Harcourt" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Required from</label>
          <input type="date" name="start_date" value={form.start_date} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Lease duration</label>
          <input name="duration" value={form.duration} onChange={onChange} placeholder="e.g. 45 days" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Anything else we should know?</label>
        <textarea name="notes" rows={3} value={form.notes} onChange={onChange} className={`${inputCls} resize-none`} />
      </div>

      <hr className="border-gray-100" />
      <h3 className="font-bold text-[#0a1628] text-sm">Your details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full name *</label>
          <input required name="name" value={form.name} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company *</label>
          <input required name="company" value={form.company} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company email *</label>
          <input required type="email" name="email" value={form.email} onChange={onChange} placeholder="you@company.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone / WhatsApp</label>
          <input type="tel" name="phone" value={form.phone} onChange={onChange} className={inputCls} />
        </div>
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
        <Send size={16} /> {loading ? "Submitting…" : "Submit request"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Your details are shared only with AeroJim — never with equipment vendors.
      </p>
    </form>
  );
}

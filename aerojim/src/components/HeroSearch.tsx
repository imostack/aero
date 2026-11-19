"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Best-effort guess of the category from free text; the form lets the user change it. */
function guessCategory(q: string): string {
  const t = q.toLowerCase();
  if (/barge|vessel|tug|deck|crane barge|accommodation/.test(t)) return "barges";
  if (/well|test|separator|choke|flowback|burner|surge|heat exchanger|dst/.test(t)) return "well-testing";
  return "";
}

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const category = guessCategory(q);
    if (category) params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/equipment/request${params.size ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-2 shadow-2xl max-w-2xl mx-auto"
    >
      <label className="flex items-center gap-3 flex-1 px-3">
        <Search size={20} className="text-gray-400 shrink-0" />
        <span className="sr-only">What equipment do you need?</span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you need? e.g. 2-phase separator, deck barge…"
          className="w-full py-3 text-gray-900 placeholder-gray-400 text-base focus:outline-none bg-transparent"
        />
      </label>
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-bold px-7 py-3.5 rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        Request quotes
      </button>
    </form>
  );
}

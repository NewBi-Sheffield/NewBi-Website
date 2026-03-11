"use client";

import { useState, useMemo } from "react";
import { Provider, averageRating } from "@/lib/db";
import ProviderCard from "./ProviderCard";

type Props = {
  providers: Provider[];
};

export default function ProviderSearch({ providers }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of providers) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    const top5 = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);
    return ["All", ...top5];
  }, [providers]);

  const filtered = useMemo(() => {
    let results = providers;

    if (category !== "All") {
      results = results.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return [...results].sort((a, b) => averageRating(b.reviews) - averageRating(a.reviews));
  }, [query, category, providers]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by business name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
        />
      </div>

      {/* Category pill filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-[#125a40] to-[#a5de57] text-white shadow-sm"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:border-[#a5de57]/50 hover:text-[#a5de57]"
              }`}
            >
              {c === "All" ? "All Services" : c}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400 mb-4">
        {filtered.length > 0
          ? `Found ${filtered.length} ${filtered.length === 1 ? "provider" : "providers"}`
          : "No providers found"}
      </p>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">{query.trim() ? <>No results for &ldquo;{query}&rdquo;</> : "No search results"}</p>
          <p className="text-sm mt-1">Try a different search or browse all categories.</p>
        </div>
      )}
    </div>
  );
}

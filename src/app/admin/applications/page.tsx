"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { type Provider } from "@/lib/db";
import AdminShell from "../_components/AdminShell";

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function ApplicationsScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const res = await fetch("/api/admin/providers", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setProviders(await res.json());
      setLoading(false);
    });
  }, []);

  const all = providers.filter((p) => !!p.user_id && p.status === "pending");
  const q = query.toLowerCase();
  const filtered = q
    ? all.filter((p) => p.name.toLowerCase().includes(q) || p.categories.some((c) => c.toLowerCase().includes(q)))
    : all;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search applications…"
          className="w-full text-sm bg-white border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-xl pl-9 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9E7580]">Self-signed providers awaiting approval — click to review</p>
        <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{loading ? "…" : filtered.length}</span>
      </div>

      {loading && <p className="text-xs text-[#B09098]">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-xs text-[#B09098]">{all.length === 0 ? "No pending applications." : "No results."}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/admin/providers/${p.id}/edit`}
            className="bg-[#FFF5F0] border border-amber-300/60 rounded-2xl p-5 flex flex-col hover:border-amber-400/60 transition-colors"
          >
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {p.profile_picture_url ? (
                <Image src={p.profile_picture_url} alt={p.name} width={72} height={72}
                  className="rounded-full object-cover border-2 border-[#2D1A1F]/10" />
              ) : (
                <div className="w-[72px] h-[72px] rounded-full bg-[#F0D8DC] border-2 border-[#2D1A1F]/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#A87580]">{p.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-base font-bold text-[#2D1A1F] leading-tight">{p.name}</h2>
              <span className="shrink-0 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {p.categories.map((cat) => (
                <span key={cat} className="text-xs font-medium text-[#A87580] bg-[#C4909A]/10 px-2.5 py-0.5 rounded-full">
                  {toTitleCase(cat)}
                </span>
              ))}
            </div>
            {p.email && <p className="text-xs text-[#9E7580] mt-auto pt-3 border-t border-[#2D1A1F]/6">{p.email}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <AdminShell activeTab="applications">
      <ApplicationsScreen />
    </AdminShell>
  );
}

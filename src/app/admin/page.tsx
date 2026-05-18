"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { type Provider } from "@/lib/db";

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconProviders() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconApplications() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconRequests() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function IconSuggestions() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

// ─── Providers screen ─────────────────────────────────────────────────────────

function InviteButton({ providerId }: { providerId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${providerId}/invite`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) { setError(body.error); return; }
    setLink(body.link);
  }

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (link) return (
    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
      <input readOnly value={link} className="w-52 text-xs bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#6B4550] rounded-lg px-2 py-1 truncate" />
      <button onClick={copy} className="text-xs text-[#C4909A] hover:underline font-medium">{copied ? "Copied!" : "Copy"}</button>
      <button onClick={() => setLink(null)} className="text-xs text-[#B09098] hover:text-[#9E7580]">Regenerate</button>
    </div>
  );

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <button onClick={generate} disabled={loading} className="text-xs text-[#A87580] hover:underline font-medium disabled:opacity-50">
        {loading ? "Generating…" : "Generate invite link"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

function ProviderAvatar({ p, size = 36 }: { p: Provider; size?: number }) {
  if (p.profile_picture_url) {
    return <Image src={p.profile_picture_url} alt={p.name} width={size} height={size} className="rounded-full object-cover shrink-0" />;
  }
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-[#F0D8DC] flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-[#A87580]">{p.name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function matches(p: Provider, q: string) {
  const s = q.toLowerCase();
  return p.name.toLowerCase().includes(s) || p.categories.some((c) => c.toLowerCase().includes(s));
}

// ─── Applications screen ──────────────────────────────────────────────────────

function ApplicationsScreen({ providers, loading }: { providers: Provider[]; loading: boolean }) {
  const [query, setQuery] = useState("");
  const all = providers.filter((p) => !!p.user_id && p.status === "pending");
  const filtered = query ? all.filter((p) => matches(p, query)) : all;

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
          className="w-full text-sm bg-[#FFF5F0] border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9E7580]">Self-signed providers awaiting approval - click to review</p>
        <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{loading ? "…" : filtered.length}</span>
      </div>
      {loading && <p className="text-xs text-[#B09098]">Loading…</p>}
      {!loading && filtered.length === 0 && <p className="text-xs text-[#B09098]">{all.length === 0 ? "No pending applications." : "No results."}</p>}
      <div className="flex flex-col gap-2">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/admin/providers/${p.id}/edit`}
            className="bg-[#FFF5F0] border border-amber-400/20 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-amber-400/40 hover:bg-[#FAF0E6] transition-colors"
          >
            <ProviderAvatar p={p} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[#2D1A1F] truncate">{p.name}</p>
                <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-medium">Pending</span>
              </div>
              <p className="text-xs text-[#9E7580]">{p.categories.map(toTitleCase).join(", ")}</p>
              {p.email && <p className="text-xs text-[#B09098] mt-0.5">{p.email}</p>}
            </div>
            <svg className="w-4 h-4 text-[#B09098] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Providers screen ─────────────────────────────────────────────────────────

function ProvidersScreen({
  providers,
  loading,
  deleting,
  onDelete,
}: {
  providers: Provider[];
  loading: boolean;
  deleting: string | null;
  onDelete: (id: string, name: string) => void;
}) {
  const [query, setQuery] = useState("");

  const allUnlinked = providers.filter((p) => !p.user_id);
  const allActive   = providers.filter((p) => !!p.user_id && p.status === "approved");
  const allUnlisted = providers.filter((p) => !!p.user_id && p.status === "unlisted");

  const unlinked = query ? allUnlinked.filter((p) => matches(p, query)) : allUnlinked;
  const active   = query ? allActive.filter((p) => matches(p, query))   : allActive;
  const unlisted = query ? allUnlisted.filter((p) => matches(p, query)) : allUnlisted;

  return (
    <div className="flex flex-col gap-8">

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search providers…"
          className="w-full text-sm bg-[#FFF5F0] border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
        />
      </div>

      {/* Pending invites */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-[#2D1A1F]">Pending invites</h2>
            <p className="text-xs text-[#9E7580] mt-0.5">Admin-created listings without an account - click to manage</p>
          </div>
          <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{loading ? "…" : unlinked.length}</span>
        </div>
        {loading && <p className="text-xs text-[#B09098]">Loading…</p>}
        {!loading && unlinked.length === 0 && <p className="text-xs text-[#B09098]">{allUnlinked.length === 0 ? "All admin-created providers have accounts." : "No results."}</p>}
        <div className="flex flex-col gap-2">
          {unlinked.map((p) => (
            <Link
              key={p.id}
              href={`/admin/providers/${p.id}/edit`}
              className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#2D1A1F]/20 hover:bg-[#FAF0E6] transition-colors"
            >
              <ProviderAvatar p={p} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2D1A1F] truncate">{p.name}</p>
                <p className="text-xs text-[#9E7580]">{p.categories.map(toTitleCase).join(", ")}</p>
              </div>
              <svg className="w-4 h-4 text-[#B09098] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Active accounts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-[#2D1A1F]">Active</h2>
            <p className="text-xs text-[#9E7580] mt-0.5">Approved providers live on the site</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{loading ? "…" : active.length}</span>
            <Link href="/admin/providers/new" className="bg-[#C4909A] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#A87580] transition-colors">
              + Add provider
            </Link>
          </div>
        </div>
        {!loading && active.length === 0 && <p className="text-xs text-[#B09098]">{allActive.length === 0 ? "No active providers yet." : "No results."}</p>}
        <div className="flex flex-col gap-2">
          {active.map((p) => (
            <div key={p.id} className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-4 py-3 flex items-center gap-3">
              <ProviderAvatar p={p} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2D1A1F] truncate">{p.name}</p>
                <p className="text-xs text-[#9E7580]">{p.categories.map(toTitleCase).join(", ")}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/admin/providers/${p.id}/edit`} className="text-xs text-[#C4909A] hover:underline font-medium">Edit</Link>
                <button onClick={() => onDelete(p.id, p.name)} disabled={deleting === p.id} className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50">
                  {deleting === p.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unlisted */}
      {(allUnlisted.length > 0 || (query && unlisted.length > 0)) && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#2D1A1F]">Unlisted</h2>
              <p className="text-xs text-[#9E7580] mt-0.5">Hidden from the site - edit to relist or delete</p>
            </div>
            <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{unlisted.length}</span>
          </div>
          {unlisted.length === 0 && <p className="text-xs text-[#B09098]">No results.</p>}
          <div className="flex flex-col gap-2">
            {unlisted.map((p) => (
              <div key={p.id} className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
                <ProviderAvatar p={p} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#2D1A1F] truncate">{p.name}</p>
                    <span className="text-xs bg-[#2D1A1F]/10 text-[#9E7580] px-2 py-0.5 rounded-full">Unlisted</span>
                  </div>
                  <p className="text-xs text-[#9E7580]">{p.categories.map(toTitleCase).join(", ")}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link href={`/admin/providers/${p.id}/edit`} className="text-xs text-[#C4909A] hover:underline font-medium">Edit</Link>
                  <button onClick={() => onDelete(p.id, p.name)} disabled={deleting === p.id} className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50">
                    {deleting === p.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Listing Requests screen ──────────────────────────────────────────────────

type ListingRequest = { id: string; name: string; email: string; business: string; category: string; phone?: string; message: string; created_at: string };

function ListingRequestsScreen() {
  const [items, setItems] = useState<ListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/listing-requests", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setItems(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  async function dismiss(id: string) {
    setDeleting(id);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/admin/listing-requests", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  if (loading) return <p className="text-xs text-[#B09098]">Loading…</p>;
  if (items.length === 0) return <p className="text-xs text-[#B09098]">No listing requests.</p>;

  return (
    <div className="flex flex-col gap-2">
      {items.map((r) => (
        <div key={r.id} className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D1A1F]">{r.business}</p>
              <p className="text-xs text-[#C4909A] font-medium mt-0.5">{r.category}</p>
              <p className="text-xs text-[#9E7580] mt-1.5">
                {r.name} · {r.email}{r.phone ? ` · ${r.phone}` : ""}
              </p>
              <p className="text-sm text-[#6B4550] mt-1.5 whitespace-pre-wrap">{r.message}</p>
            </div>
            <button
              onClick={() => dismiss(r.id)}
              disabled={deleting === r.id}
              className="shrink-0 text-xs text-[#B09098] hover:text-red-500 transition-colors disabled:opacity-50 mt-0.5"
            >
              {deleting === r.id ? "…" : "Dismiss"}
            </button>
          </div>
          <p className="text-xs text-[#B09098] mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Suggestions screen ───────────────────────────────────────────────────────

type Suggestion = { id: string; name: string; email: string; message: string; created_at: string };

function SuggestionsScreen() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/suggestions", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setItems(await res.json());
      setLoading(false);
    }
    load();
  }, []);

  async function dismiss(id: string) {
    setDeleting(id);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/admin/suggestions", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  }

  if (loading) return <p className="text-xs text-[#B09098]">Loading…</p>;
  if (items.length === 0) return <p className="text-xs text-[#B09098]">No suggestions.</p>;

  return (
    <div className="flex flex-col gap-2">
      {items.map((s) => (
        <div key={s.id} className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D1A1F]">{s.name}</p>
              <p className="text-xs text-[#9E7580]">{s.email}</p>
              <p className="text-sm text-[#6B4550] mt-1.5 whitespace-pre-wrap">{s.message}</p>
            </div>
            <button
              onClick={() => dismiss(s.id)}
              disabled={deleting === s.id}
              className="shrink-0 text-xs text-[#B09098] hover:text-red-500 transition-colors disabled:opacity-50 mt-0.5"
            >
              {deleting === s.id ? "…" : "Dismiss"}
            </button>
          </div>
          <p className="text-xs text-[#B09098] mt-2">{new Date(s.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Screen = "providers" | "applications" | "listing-requests" | "suggestions";

const NAV: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: "providers",        label: "Providers",        icon: <IconProviders /> },
  { id: "applications",     label: "Applications",     icon: <IconApplications /> },
  { id: "listing-requests", label: "Listing requests", icon: <IconRequests /> },
  { id: "suggestions",      label: "Suggestions",      icon: <IconSuggestions /> },
];

export default function AdminPage() {
  const { loading: authLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("providers");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) router.replace("/login?from=/admin");
    else if (!isAdmin) router.replace("/");
  }, [authLoading, isLoggedIn, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const res = await fetch("/api/admin/providers", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) setProviders(await res.json());
      setLoadingProviders(false);
    });
  }, [isAdmin]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    setDeleteError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (!res.ok) {
      const body = await res.json();
      setDeleteError(body.error ?? "Delete failed");
      setDeleting(null);
      return;
    }
    setProviders((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  if (authLoading) return null;
  if (!isLoggedIn || !isAdmin) return null;

  const screenTitles: Record<Screen, string> = {
    "providers": "Providers",
    "applications": "Applications",
    "listing-requests": "Listing requests",
    "suggestions": "Suggestions",
  };

  return (
    <div className="min-h-screen bg-transparent flex">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#2D1A1F]/8 flex flex-col">
        <div className="px-5 py-6 border-b border-[#2D1A1F]/8">
          <Link href="/">
            <img src="/logo-Transparent.png" alt="NewBi" className="h-7" />
          </Link>
          <p className="text-xs text-[#B09098] mt-1">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  active
                    ? "bg-[#C4909A]/15 text-[#2D1A1F] border border-[#C4909A]/20"
                    : "text-[#9E7580] hover:text-[#2D1A1F] hover:bg-[#2D1A1F]/5"
                }`}
              >
                <span className={active ? "text-[#C4909A]" : ""}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[#2D1A1F]/8">
          <Link href="/" className="text-xs text-[#B09098] hover:text-[#2D1A1F] transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-5 border-b border-[#2D1A1F]/8 flex items-center justify-between">
          <h1 className="text-base font-semibold text-[#2D1A1F]">{screenTitles[screen]}</h1>
        </header>

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {deleteError && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">{deleteError}</p>
          )}

          {screen === "providers" && (
            <ProvidersScreen
              providers={providers}
              loading={loadingProviders}
              deleting={deleting}
              onDelete={handleDelete}
            />
          )}
          {screen === "applications" && (
            <ApplicationsScreen providers={providers} loading={loadingProviders} />
          )}
          {screen === "listing-requests" && <ListingRequestsScreen />}
          {screen === "suggestions" && <SuggestionsScreen />}
        </main>
      </div>

    </div>
  );
}

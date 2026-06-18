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

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

// ─── Invite button ────────────────────────────────────────────────────────────

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
    <div className="flex items-center gap-2 flex-wrap">
      <input readOnly value={link} className="w-40 text-xs bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#6B4550] rounded-lg px-2 py-1 truncate" />
      <button onClick={copy} className="text-xs text-[#C4909A] hover:underline font-medium">{copied ? "Copied!" : "Copy"}</button>
      <button onClick={() => setLink(null)} className="text-xs text-[#B09098] hover:text-[#9E7580]">Regen</button>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <button onClick={generate} disabled={loading} className="text-xs text-[#A87580] hover:underline font-medium disabled:opacity-50">
        {loading ? "Generating…" : "Generate invite"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

// ─── Admin provider card ──────────────────────────────────────────────────────

function AdminProviderCard({
  p,
  deleting,
  onDelete,
}: {
  p: Provider;
  deleting: boolean;
  onDelete: () => void;
}) {
  const isUnlinked = !p.user_id;
  const isPending  = p.status === "pending";
  const isUnlisted = p.status === "unlisted";

  return (
    <div className={`bg-[#FFF5F0] rounded-2xl border p-5 flex flex-col transition-colors duration-200
      ${isPending  ? "border-amber-300/60" : ""}
      ${isUnlisted ? "border-[#2D1A1F]/10 opacity-60" : ""}
      ${!isPending && !isUnlisted ? "border-[#2D1A1F]/10 hover:border-[#C4909A]/40" : ""}
    `}>
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

      {/* Name + status badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-bold text-[#2D1A1F] leading-tight">{p.name}</h2>
        {isPending  && <span className="shrink-0 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>}
        {isUnlisted && <span className="shrink-0 text-[10px] font-semibold bg-[#2D1A1F]/8 text-[#9E7580] px-2 py-0.5 rounded-full">Unlisted</span>}
        {isUnlinked && !isPending && <span className="shrink-0 text-[10px] font-semibold bg-[#F0D8DC] text-[#A87580] px-2 py-0.5 rounded-full">No account</span>}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {p.categories.map((cat) => (
          <span key={cat} className="text-xs font-medium text-[#A87580] bg-[#C4909A]/10 px-2.5 py-0.5 rounded-full">
            {toTitleCase(cat)}
          </span>
        ))}
      </div>

      {/* Description */}
      {p.description && (
        <p className="text-sm text-[#2D1A1F]/70 line-clamp-2 mb-3 flex-1">{stripHtml(p.description)}</p>
      )}

      {/* Invite link for unlinked */}
      {isUnlinked && (
        <div className="mb-3">
          <InviteButton providerId={p.id} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#2D1A1F]/6">
        <Link
          href={`/admin/providers/${p.id}/edit`}
          className="flex-1 text-center text-sm font-semibold text-white bg-[#C4909A] py-2 rounded-xl hover:bg-[#A87580] transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-sm text-red-400 hover:text-red-500 disabled:opacity-50 transition-colors px-2"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  count,
  loading,
  empty,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  count: number;
  loading: boolean;
  empty: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#2D1A1F]">{title}</h2>
          <p className="text-xs text-[#9E7580] mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#B09098] bg-[#2D1A1F]/5 px-2 py-0.5 rounded-full">{loading ? "…" : count}</span>
          {action}
        </div>
      </div>
      {loading && <p className="text-xs text-[#B09098]">Loading…</p>}
      {!loading && count === 0 && <p className="text-xs text-[#B09098]">{empty}</p>}
      {children}
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
    } else {
      setProviders((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  }

  function matches(p: Provider) {
    const q = query.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.categories.some((c) => c.toLowerCase().includes(q));
  }

  const unlinked = providers.filter((p) => !p.user_id).filter(matches);
  const active   = providers.filter((p) => !!p.user_id && p.status === "approved").filter(matches);
  const unlisted = providers.filter((p) => !!p.user_id && p.status === "unlisted").filter(matches);

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
          className="w-full text-sm bg-white border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-xl pl-9 pr-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
        />
      </div>

      {deleteError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{deleteError}</p>}

      {/* Pending invites */}
      <Section
        title="Pending invites"
        subtitle="Admin-created listings without an account"
        count={unlinked.length}
        loading={loading}
        empty="All admin-created providers have accounts."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlinked.map((p) => (
            <AdminProviderCard key={p.id} p={p} deleting={deleting === p.id} onDelete={() => handleDelete(p.id, p.name)} />
          ))}
        </div>
      </Section>

      {/* Active */}
      <Section
        title="Active"
        subtitle="Approved providers live on the site"
        count={active.length}
        loading={loading}
        empty="No active providers yet."
        action={
          <Link href="/admin/providers/new" className="bg-[#C4909A] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#A87580] transition-colors">
            + Add provider
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map((p) => (
            <AdminProviderCard key={p.id} p={p} deleting={deleting === p.id} onDelete={() => handleDelete(p.id, p.name)} />
          ))}
        </div>
      </Section>

      {/* Unlisted */}
      {(unlisted.length > 0 || (!loading && providers.some((p) => p.status === "unlisted"))) && (
        <Section
          title="Unlisted"
          subtitle="Hidden from the site"
          count={unlisted.length}
          loading={loading}
          empty="No results."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlisted.map((p) => (
              <AdminProviderCard key={p.id} p={p} deleting={deleting === p.id} onDelete={() => handleDelete(p.id, p.name)} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProvidersPage() {
  return (
    <AdminShell activeTab="providers">
      <ProvidersScreen />
    </AdminShell>
  );
}

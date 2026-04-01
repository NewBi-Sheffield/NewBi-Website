"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getProviders, type Provider } from "@/lib/db";

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
import PageHeader from "@/components/PageHeader";

export default function AdminPage() {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn === false) router.replace("/login?from=/admin");
    else if (isLoggedIn && !isAdmin) router.replace("/");
  }, [isLoggedIn, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin) return;
    getProviders().then((data) => {
      setProviders(data);
      setLoading(false);
    });
  }, [isAdmin]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Delete failed");
      setDeleting(null);
      return;
    }

    setProviders((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <>
      <PageHeader title="Admin" subtitle="Manage providers" backHref="/" backLabel="Back to site" />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            {loading ? "Loading…" : `${providers.length} providers`}
          </p>
          <Link
            href="/admin/providers/new"
            className="bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            + Add provider
          </Link>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg mb-4">{error}</p>
        )}

        {!loading && (
          <div className="flex flex-col gap-2">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-[#0f2236] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                {p.profile_picture_url ? (
                  <Image
                    src={p.profile_picture_url}
                    alt={p.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1a3550] flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-slate-500">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.categories.map(toTitleCase).join(", ")}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/admin/providers/${p.id}/edit`}
                    className="text-xs text-[#45c97a] hover:underline font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deleting === p.id}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    {deleting === p.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

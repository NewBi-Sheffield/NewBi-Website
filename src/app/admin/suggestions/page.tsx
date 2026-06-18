"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminShell from "../_components/AdminShell";

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
    <div className="flex flex-col gap-3">
      {items.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-[#2D1A1F]/8 shadow-sm px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2D1A1F]">{s.name}</p>
              <p className="text-xs text-[#9E7580]">{s.email}</p>
              <p className="text-sm text-[#6B4550] mt-2 whitespace-pre-wrap">{s.message}</p>
            </div>
            <button
              onClick={() => dismiss(s.id)}
              disabled={deleting === s.id}
              className="shrink-0 text-xs text-[#B09098] hover:text-red-500 transition-colors disabled:opacity-50 mt-0.5"
            >
              {deleting === s.id ? "…" : "Dismiss"}
            </button>
          </div>
          <p className="text-xs text-[#B09098] mt-3">{new Date(s.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminSuggestionsPage() {
  return (
    <AdminShell activeTab="suggestions">
      <SuggestionsScreen />
    </AdminShell>
  );
}

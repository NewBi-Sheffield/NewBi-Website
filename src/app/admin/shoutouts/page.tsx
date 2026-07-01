"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminShell from "../_components/AdminShell";

// ─── Types ────────────────────────────────────────────────────────────────────

type Shoutout = {
  id: string;
  instagramHandle?: string;
  businessName?: string;
  lastShoutedAt?: string; // YYYY-MM-DD
  notes?: string;
};

type ShoutoutRow = {
  id: string;
  instagram_handle: string | null;
  business_name: string | null;
  date: string | null;
  notes: string | null;
};

type ContactOption = { id: string; instagramHandle?: string; businessName: string };

const today = () => new Date().toISOString().split("T")[0];

const EMPTY_FORM: Omit<Shoutout, "id"> = {
  instagramHandle: "", businessName: "", lastShoutedAt: today(), notes: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fromRow(r: ShoutoutRow): Shoutout {
  return {
    id:              r.id,
    instagramHandle: r.instagram_handle ?? undefined,
    businessName:    r.business_name    ?? undefined,
    lastShoutedAt:   r.date             ?? undefined,
    notes:           r.notes            ?? undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso + "T00:00:00").getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function needsShoutout(s: Shoutout): boolean {
  if (!s.lastShoutedAt) return true;
  return daysSince(s.lastShoutedAt) >= 30;
}

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token}` };
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ShoutoutCard({ s, onEdit, onDelete }: { s: Shoutout; onEdit: () => void; onDelete: () => void }) {
  const label = s.instagramHandle ? `@${s.instagramHandle}` : (s.businessName ?? "—");
  const initial = (s.instagramHandle ?? s.businessName ?? "?").charAt(0).toUpperCase();
  const overdue = needsShoutout(s);
  const days = s.lastShoutedAt ? daysSince(s.lastShoutedAt) : null;

  return (
    <div className={`bg-[#FFF5F0] rounded-2xl p-4 flex flex-col gap-3 border transition-colors ${overdue ? "border-amber-300/60 hover:border-amber-400/80" : "border-[#2D1A1F]/10 hover:border-[#C4909A]/40"}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F0D8DC] flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#A87580]">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          {s.instagramHandle ? (
            <a
              href={`https://instagram.com/${s.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#2D1A1F] leading-tight hover:text-[#C4909A] transition-colors"
            >
              {label}
            </a>
          ) : (
            <p className="font-bold text-[#2D1A1F] leading-tight">{label}</p>
          )}
          {s.businessName && s.instagramHandle && (
            <p className="text-xs text-[#9E7580] mt-0.5">{s.businessName}</p>
          )}
        </div>
        {overdue && (
          <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            Due
          </span>
        )}
      </div>

      {s.notes && <p className="text-sm text-[#6B4550] leading-snug line-clamp-2">{s.notes}</p>}

      <div className="border-t border-[#2D1A1F]/6 pt-3 flex items-center gap-3">
        {s.lastShoutedAt ? (
          <span className={`text-xs ${overdue ? "text-amber-600 font-medium" : "text-[#B09098]"}`}>
            {overdue ? "⚠ " : ""}Last shouted {formatDate(s.lastShoutedAt)}
            {days !== null && <span className="text-[#B09098] font-normal"> ({days}d ago)</span>}
          </span>
        ) : (
          <span className="text-xs text-amber-600 font-medium">⚠ Never shouted out</span>
        )}
        <button onClick={onEdit} className="text-sm font-medium text-[#2D1A1F] hover:text-[#C4909A] transition-colors ml-auto">Edit</button>
        <button onClick={onDelete} className="text-[#D8B4B8] hover:text-red-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function ShoutoutsScreen({ onOpenAdd }: { onOpenAdd: (fn: () => void) => void }) {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dueOnly, setDueOnly] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Shoutout | null>(null);
  const [form, setForm] = useState<Omit<Shoutout, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  async function load() {
    const headers = await authHeaders();
    const [shoutoutsRes, contactsRes] = await Promise.all([
      fetch("/api/admin/shoutouts", { headers }),
      fetch("/api/admin/contacts", { headers }),
    ]);
    if (shoutoutsRes.ok) {
      const rows: ShoutoutRow[] = await shoutoutsRes.json();
      setShoutouts(rows.map(fromRow));
    }
    if (contactsRes.ok) {
      const rows: { id: string; instagram_handle: string | null; business_name: string }[] = await contactsRes.json();
      setContacts(rows.map((r) => ({ id: r.id, instagramHandle: r.instagram_handle ?? undefined, businessName: r.business_name })));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { onOpenAdd(openAdd); }, []);

  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM, lastShoutedAt: today() }); setContactSearch(""); setPanelOpen(true); }
  function openEdit(s: Shoutout) {
    setEditing(s);
    setForm({ instagramHandle: s.instagramHandle, businessName: s.businessName, lastShoutedAt: s.lastShoutedAt ?? today(), notes: s.notes });
    setContactSearch("");
    setPanelOpen(true);
  }
  function closePanel() { setPanelOpen(false); setEditing(null); setContactSearch(""); }

  function pickContact(c: ContactOption) {
    setForm((f) => ({ ...f, instagramHandle: c.instagramHandle ?? "", businessName: c.businessName }));
    setContactSearch("");
  }

  async function save() {
    if (!form.instagramHandle?.trim() && !form.businessName?.trim()) return;
    setSaving(true);
    const headers = { ...(await authHeaders()), "Content-Type": "application/json" };
    const body = { instagramHandle: form.instagramHandle, businessName: form.businessName, date: form.lastShoutedAt, notes: form.notes };

    if (editing) {
      const res = await fetch(`/api/admin/shoutouts/${editing.id}`, { method: "PATCH", headers, body: JSON.stringify(body) });
      if (res.ok) {
        const updated: ShoutoutRow = await res.json();
        setShoutouts((prev) => prev.map((s) => s.id === editing.id ? fromRow(updated) : s));
      }
    } else {
      const res = await fetch("/api/admin/shoutouts", { method: "POST", headers, body: JSON.stringify(body) });
      if (res.ok) {
        const created: ShoutoutRow = await res.json();
        setShoutouts((prev) => [...prev, fromRow(created)]);
      }
    }
    setSaving(false);
    closePanel();
  }

  async function remove(id: string) {
    if (!confirm("Remove this shoutout?")) return;
    const headers = await authHeaders();
    await fetch(`/api/admin/shoutouts/${id}`, { method: "DELETE", headers });
    setShoutouts((prev) => prev.filter((s) => s.id !== id));
  }

  const dueCount = shoutouts.filter(needsShoutout).length;

  // Sort oldest first so the ones needing rotation are at the top
  const sorted = [...shoutouts].sort((a, b) => {
    if (!a.lastShoutedAt && !b.lastShoutedAt) return 0;
    if (!a.lastShoutedAt) return -1;
    if (!b.lastShoutedAt) return 1;
    return a.lastShoutedAt < b.lastShoutedAt ? -1 : 1;
  });

  const filtered = sorted.filter((s) => {
    const matchesDue = !dueOnly || needsShoutout(s);
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      (s.instagramHandle ?? "").toLowerCase().includes(q) ||
      (s.businessName ?? "").toLowerCase().includes(q) ||
      (s.notes ?? "").toLowerCase().includes(q);
    return matchesDue && matchesQuery;
  });

  const inputCls = "text-base bg-[#FAF7F5] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#C0A8AF] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 w-full";
  const labelCls = "flex flex-col gap-2";
  const labelTextCls = "text-sm font-medium text-[#6B4550]";

  return (
    <div className="flex flex-col gap-5">

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search handle, name, notes…"
          className="w-full text-base bg-white border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-2xl pl-11 pr-4 py-3.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
        />
      </div>

      {/* Stat cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-[#2D1A1F]/5 min-w-[80px]">
          <p className="text-3xl font-bold text-[#2D1A1F] leading-none">{shoutouts.length}</p>
          <p className="text-xs text-[#9E7580] mt-2">Total</p>
        </div>
        <div className="shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-[#2D1A1F]/5 min-w-[90px]">
          <p className="text-3xl font-bold text-amber-500 leading-none">{dueCount}</p>
          <p className="text-xs text-[#9E7580] mt-2">Due</p>
        </div>
        <div className="shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-[#2D1A1F]/5 min-w-[90px]">
          <p className="text-3xl font-bold text-emerald-600 leading-none">{shoutouts.length - dueCount}</p>
          <p className="text-xs text-[#9E7580] mt-2">Up to date</p>
        </div>
      </div>

      {/* Due filter */}
      {dueCount > 0 && (
        <button
          onClick={() => setDueOnly((v) => !v)}
          className={`self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            dueOnly
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          {dueOnly ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          Due for shoutout ({dueCount})
        </button>
      )}

      {loading ? (
        <p className="text-sm text-[#B09098] text-center py-12">Loading…</p>
      ) : (
        <>
          <p className="text-sm text-[#9E7580]">{filtered.length} provider{filtered.length !== 1 ? "s" : ""}</p>
          {filtered.length === 0 ? (
            <p className="text-sm text-[#B09098] text-center py-12">
              {shoutouts.length === 0 ? "No shoutouts tracked yet — add one." : "No providers match your filter."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((s) => (
                <ShoutoutCard key={s.id} s={s} onEdit={() => openEdit(s)} onDelete={() => remove(s.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closePanel} />
          <div className="fixed inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-[440px] bg-white z-50 flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-[#2D1A1F]/8 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#2D1A1F]">{editing ? "Edit shoutout" : "Add shoutout"}</h2>
              <button onClick={closePanel} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2D1A1F]/5 text-[#9E7580] hover:bg-[#2D1A1F]/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

              {/* Contact picker */}
              <div className="px-5 pt-5 pb-3 flex flex-col gap-3">
                <span className={labelTextCls}>Select a contact</span>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Filter by name or handle…"
                    className="text-sm bg-[#FAF7F5] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#C0A8AF] rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 w-full"
                  />
                </div>
              </div>

              {/* Scrollable contact list */}
              {(() => {
                const q = contactSearch.toLowerCase();
                const visible = contacts.filter((c) =>
                  !q ||
                  c.businessName.toLowerCase().includes(q) ||
                  (c.instagramHandle ?? "").toLowerCase().includes(q)
                );
                const selectedHandle = form.instagramHandle?.toLowerCase();
                const selectedName = form.businessName?.toLowerCase();

                return contacts.length > 0 ? (
                  <div className="overflow-y-auto border-y border-[#2D1A1F]/8" style={{ maxHeight: "260px" }}>
                    {visible.length === 0 ? (
                      <p className="text-xs text-[#B09098] px-5 py-4">No contacts match.</p>
                    ) : (
                      visible.map((c) => {
                        const isSelected = !!(
                          (c.instagramHandle && c.instagramHandle.toLowerCase() === selectedHandle) ||
                          (!c.instagramHandle && c.businessName.toLowerCase() === selectedName)
                        );
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => pickContact(c)}
                            className={`w-full flex items-center gap-3 px-5 py-3 text-left border-b border-[#2D1A1F]/6 last:border-0 transition-colors ${isSelected ? "bg-[#C4909A]/10" : "hover:bg-[#FAF7F5]"}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#F0D8DC] flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#A87580]">
                                {(c.instagramHandle ?? c.businessName).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2D1A1F] truncate">
                                {c.instagramHandle ? `@${c.instagramHandle}` : c.businessName}
                              </p>
                              {c.instagramHandle && c.businessName && (
                                <p className="text-xs text-[#9E7580] truncate">{c.businessName}</p>
                              )}
                            </div>
                            {isSelected && (
                              <svg className="w-4 h-4 text-[#C4909A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#B09098] px-5 pb-3">No contacts in DB yet.</p>
                );
              })()}

              {/* Manual entry + date + notes */}
              <div className="px-5 py-5 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#2D1A1F]/8" />
                  <span className="text-xs text-[#B09098]">or enter manually</span>
                  <div className="flex-1 h-px bg-[#2D1A1F]/8" />
                </div>

                <label className={labelCls}>
                  <span className={labelTextCls}>Instagram handle</span>
                  <div className="flex items-center bg-[#FAF7F5] border border-[#2D1A1F]/10 rounded-xl px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-[#C4909A]/40">
                    <span className="text-[#B09098] text-base font-medium">@</span>
                    <input
                      value={form.instagramHandle ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const igMatch = val.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
                        if (igMatch) {
                          const handle = igMatch[1];
                          setForm((f) => ({ ...f, instagramHandle: handle, businessName: f.businessName || handle }));
                        } else {
                          setForm((f) => ({ ...f, instagramHandle: val.replace(/^@/, "") }));
                        }
                      }}
                      placeholder="handle or instagram.com/…"
                      className="text-base bg-transparent text-[#2D1A1F] placeholder-[#C0A8AF] flex-1 focus:outline-none"
                    />
                  </div>
                </label>

                <label className={labelCls}>
                  <span className={labelTextCls}>Business name</span>
                  <input value={form.businessName ?? ""} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} placeholder="e.g. Nails by Sophie" className={inputCls} />
                </label>

                <label className={labelCls}>
                  <span className={labelTextCls}>Last shouted out</span>
                  <input
                    type="date"
                    value={form.lastShoutedAt ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, lastShoutedAt: e.target.value || undefined }))}
                    className={inputCls}
                  />
                </label>

                <label className={labelCls}>
                  <span className={labelTextCls}>Notes</span>
                  <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this provider…" rows={3} className={`${inputCls} resize-none`} />
                </label>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-[#2D1A1F]/8 flex gap-3">
              <button
                onClick={save}
                disabled={saving || (!form.instagramHandle?.trim() && !form.businessName?.trim())}
                className="flex-1 bg-[#C4909A] text-white text-base font-semibold py-3.5 rounded-xl hover:bg-[#A87580] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : editing ? "Save changes" : "Add shoutout"}
              </button>
              <button onClick={closePanel} className="px-5 py-3.5 text-base text-[#9E7580] hover:text-[#2D1A1F] transition-colors">Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminShoutoutsPage() {
  const [openAddFn, setOpenAddFn] = useState<(() => void) | null>(null);

  return (
    <AdminShell
      activeTab="shoutouts"
      headerRight={
        <button
          onClick={() => openAddFn?.()}
          className="bg-[#C4909A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#A87580] transition-colors"
        >
          + Add shoutout
        </button>
      }
    >
      <ShoutoutsScreen onOpenAdd={(fn) => setOpenAddFn(() => fn)} />
    </AdminShell>
  );
}

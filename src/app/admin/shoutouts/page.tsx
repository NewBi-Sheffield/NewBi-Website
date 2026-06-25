"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminShell from "../_components/AdminShell";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShoutoutStatus = "Planned" | "Done";

type Shoutout = {
  id: string;
  instagramHandle?: string;
  businessName?: string;
  date?: string;
  status: ShoutoutStatus;
  reciprocated: boolean;
  notes?: string;
};

type ShoutoutRow = {
  id: string;
  instagram_handle: string | null;
  business_name: string | null;
  date: string | null;
  status: string;
  reciprocated: boolean | null;
  notes: string | null;
};

const ALL_STATUSES: ShoutoutStatus[] = ["Planned", "Done"];

const STATUS_BADGE: Record<ShoutoutStatus, string> = {
  Planned: "bg-amber-100 text-amber-700",
  Done:    "bg-emerald-100 text-emerald-800",
};

const today = () => new Date().toISOString().split("T")[0];

const EMPTY_FORM: Omit<Shoutout, "id"> = {
  instagramHandle: "", businessName: "", date: today(),
  status: "Planned", reciprocated: false, notes: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fromRow(r: ShoutoutRow): Shoutout {
  return {
    id:              r.id,
    instagramHandle: r.instagram_handle ?? undefined,
    businessName:    r.business_name    ?? undefined,
    date:            r.date             ?? undefined,
    status:          (r.status === "Done" ? "Done" : "Planned") as ShoutoutStatus,
    reciprocated:    r.reciprocated     ?? false,
    notes:           r.notes            ?? undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token}` };
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ShoutoutCard({ s, onEdit, onDelete }: { s: Shoutout; onEdit: () => void; onDelete: () => void }) {
  const label = s.instagramHandle ? `@${s.instagramHandle}` : (s.businessName ?? "—");
  const initial = (s.instagramHandle ?? s.businessName ?? "?").charAt(0).toUpperCase();

  return (
    <div className="bg-[#FFF5F0] rounded-2xl p-4 flex flex-col gap-3 border border-[#2D1A1F]/10 hover:border-[#C4909A]/40 transition-colors">
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
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[s.status]}`}>
          {s.status}
        </span>
      </div>

      {s.reciprocated && (
        <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Reciprocated
        </span>
      )}

      {s.notes && <p className="text-sm text-[#6B4550] leading-snug line-clamp-2">{s.notes}</p>}

      <div className="border-t border-[#2D1A1F]/6 pt-3 flex items-center gap-3">
        {s.date ? (
          <span className="text-xs text-[#B09098]">{formatDate(s.date)}</span>
        ) : (
          <span className="text-xs text-[#B09098]">No date set</span>
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

// ─── Types (contact picker) ───────────────────────────────────────────────────

type ContactOption = { id: string; instagramHandle?: string; businessName: string };

// ─── Screen ───────────────────────────────────────────────────────────────────

function ShoutoutsScreen({ onOpenAdd }: { onOpenAdd: (fn: () => void) => void }) {
  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShoutoutStatus | "All">("All");
  const [reciprocatedOnly, setReciprocatedOnly] = useState(false);
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

  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM, date: today() }); setContactSearch(""); setPanelOpen(true); }
  function openEdit(s: Shoutout) {
    setEditing(s);
    setForm({ instagramHandle: s.instagramHandle, businessName: s.businessName, date: s.date ?? today(), status: s.status, reciprocated: s.reciprocated, notes: s.notes });
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

    if (editing) {
      const res = await fetch(`/api/admin/shoutouts/${editing.id}`, { method: "PATCH", headers, body: JSON.stringify(form) });
      if (res.ok) {
        const updated: ShoutoutRow = await res.json();
        setShoutouts((prev) => prev.map((s) => s.id === editing.id ? fromRow(updated) : s));
      }
    } else {
      const res = await fetch("/api/admin/shoutouts", { method: "POST", headers, body: JSON.stringify(form) });
      if (res.ok) {
        const created: ShoutoutRow = await res.json();
        setShoutouts((prev) => [fromRow(created), ...prev]);
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

  const reciprocatedCount = shoutouts.filter((s) => s.reciprocated).length;

  const filtered = shoutouts.filter((s) => {
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesRecip = !reciprocatedOnly || s.reciprocated;
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      (s.instagramHandle ?? "").toLowerCase().includes(q) ||
      (s.businessName ?? "").toLowerCase().includes(q) ||
      (s.notes ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesRecip && matchesQuery;
  });

  const statusCounts = Object.fromEntries(
    ALL_STATUSES.map((st) => [st, shoutouts.filter((s) => s.status === st).length])
  ) as Record<ShoutoutStatus, number>;

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
        <button
          onClick={() => setStatusFilter("All")}
          className={`shrink-0 rounded-2xl p-4 text-left shadow-sm border-2 transition-all min-w-[80px] ${statusFilter === "All" ? "border-[#C4909A] bg-[#C4909A]/8 shadow-md" : "bg-white border-transparent hover:border-[#C4909A]/30"}`}
        >
          <p className="text-3xl font-bold text-[#2D1A1F] leading-none">{shoutouts.length}</p>
          <p className="text-xs text-[#9E7580] mt-2">All</p>
        </button>
        {ALL_STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`shrink-0 rounded-2xl p-4 text-left shadow-sm border-2 transition-all min-w-[90px] ${statusFilter === st ? "border-[#C4909A] bg-[#C4909A]/8 shadow-md" : "bg-white border-transparent hover:border-[#C4909A]/30"}`}
          >
            <p className="text-3xl font-bold text-[#2D1A1F] leading-none">{statusCounts[st]}</p>
            <p className="text-xs text-[#9E7580] mt-2">{st}</p>
          </button>
        ))}
      </div>

      {/* Reciprocated filter */}
      {reciprocatedCount > 0 && (
        <button
          onClick={() => setReciprocatedOnly((v) => !v)}
          className={`self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            reciprocatedOnly
              ? "bg-pink-500 text-white border-pink-500"
              : "bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-400"
          }`}
        >
          {reciprocatedOnly ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          Reciprocated ({reciprocatedCount})
        </button>
      )}

      {loading ? (
        <p className="text-sm text-[#B09098] text-center py-12">Loading…</p>
      ) : (
        <>
          <p className="text-sm text-[#9E7580]">{filtered.length} shoutout{filtered.length !== 1 ? "s" : ""}</p>
          {filtered.length === 0 ? (
            <p className="text-sm text-[#B09098] text-center py-12">
              {shoutouts.length === 0 ? "No shoutouts yet — add one." : "No shoutouts match your filter."}
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

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

              {/* Contact picker — only shown when adding */}
              {!editing && (
                <div className={labelCls}>
                  <span className={labelTextCls}>Select from contacts</span>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      placeholder="Search contacts by name or handle…"
                      className="text-sm bg-[#FAF7F5] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#C0A8AF] rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 w-full"
                    />
                  </div>
                  {contactSearch.trim() && (() => {
                    const q = contactSearch.toLowerCase();
                    const matches = contacts.filter((c) =>
                      c.businessName.toLowerCase().includes(q) ||
                      (c.instagramHandle ?? "").toLowerCase().includes(q)
                    ).slice(0, 8);
                    return matches.length > 0 ? (
                      <div className="border border-[#2D1A1F]/10 rounded-xl overflow-hidden bg-white shadow-sm">
                        {matches.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => pickContact(c)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FAF7F5] transition-colors border-b border-[#2D1A1F]/6 last:border-0"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#F0D8DC] flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#A87580]">
                                {(c.instagramHandle ?? c.businessName).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#2D1A1F] truncate">
                                {c.instagramHandle ? `@${c.instagramHandle}` : c.businessName}
                              </p>
                              {c.instagramHandle && c.businessName && (
                                <p className="text-xs text-[#9E7580] truncate">{c.businessName}</p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#B09098] px-1">No contacts match — fill in manually below.</p>
                    );
                  })()}
                  {/* Selected contact chip */}
                  {!contactSearch && (form.instagramHandle || form.businessName) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#C4909A]/10 rounded-xl">
                      <span className="text-sm text-[#6B4550] flex-1 truncate">
                        {form.instagramHandle ? `@${form.instagramHandle}` : form.businessName}
                        {form.instagramHandle && form.businessName ? ` · ${form.businessName}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, instagramHandle: "", businessName: "" }))}
                        className="text-[#B09098] hover:text-[#2D1A1F] transition-colors shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-px bg-[#2D1A1F]/8" />
                    <span className="text-xs text-[#B09098]">or enter manually</span>
                    <div className="flex-1 h-px bg-[#2D1A1F]/8" />
                  </div>
                </div>
              )}

              {/* Status */}
              <div className={labelCls}>
                <span className={labelTextCls}>Status</span>
                <div className="flex gap-2">
                  {ALL_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: st }))}
                      className={`flex-1 py-2 rounded-full text-sm font-medium border transition-colors ${
                        form.status === st
                          ? "bg-[#C4909A] text-white border-[#C4909A]"
                          : "bg-[#FAF7F5] text-[#6B4550] border-[#2D1A1F]/10 hover:border-[#C4909A]/40"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram handle */}
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

              {/* Business name */}
              <label className={labelCls}>
                <span className={labelTextCls}>Business name</span>
                <input value={form.businessName ?? ""} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} placeholder="e.g. Nails by Sophie" className={inputCls} />
              </label>

              {/* Date */}
              <label className={labelCls}>
                <span className={labelTextCls}>Date</span>
                <input
                  type="date"
                  value={form.date ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value || undefined }))}
                  className={inputCls}
                />
              </label>

              {/* Reciprocated toggle */}
              <div className={labelCls}>
                <span className={labelTextCls}>Reciprocated?</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, reciprocated: !f.reciprocated }))}
                  className={`self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    form.reciprocated
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-[#FAF7F5] text-[#6B4550] border-[#2D1A1F]/10 hover:border-pink-300"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill={form.reciprocated ? "white" : "#C0A8AF"} viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {form.reciprocated ? "Yes — they shouted us back" : "No — not yet"}
                </button>
              </div>

              {/* Notes */}
              <label className={labelCls}>
                <span className={labelTextCls}>Notes</span>
                <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this shoutout…" rows={4} className={`${inputCls} resize-none`} />
              </label>
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

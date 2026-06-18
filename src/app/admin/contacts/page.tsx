"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminShell from "../_components/AdminShell";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContactStatus = "To contact" | "Not responded" | "Responded" | "Live";

type Contact = {
  id: string;
  status: ContactStatus;
  businessName: string;
  instagramHandle?: string;
  category: string;
  city: string;
  followers?: number;
  bookingMethod?: string;
  email?: string;
  notes?: string;
  phone?: string;
  website?: string;
  contactedAt?: string; // YYYY-MM-DD
};

type ContactRow = {
  id: string;
  status: string;
  business_name: string;
  instagram_handle: string | null;
  category: string;
  city: string;
  followers: number | null;
  booking_method: string | null;
  email: string | null;
  notes: string | null;
  phone: string | null;
  website: string | null;
  contacted_at: string | null;
};

const ALL_STATUSES: ContactStatus[] = ["To contact", "Not responded", "Responded", "Live"];

const VALID_STATUSES = new Set<string>(ALL_STATUSES);

const STATUS_DOT: Record<ContactStatus, string> = {
  "To contact":   "bg-neutral-400",
  "Not responded":"bg-orange-400",
  "Responded":    "bg-emerald-600",
  "Live":         "bg-blue-500",
};

const STATUS_BADGE: Record<ContactStatus, string> = {
  "To contact":   "bg-neutral-100 text-neutral-600",
  "Not responded":"bg-orange-100 text-orange-700",
  "Responded":    "bg-emerald-200 text-emerald-800",
  "Live":         "bg-blue-100 text-blue-700",
};

const today = () => new Date().toISOString().split("T")[0];

const EMPTY_FORM: Omit<Contact, "id"> = {
  status: "To contact", businessName: "", instagramHandle: "", category: "",
  city: "", followers: undefined, bookingMethod: "", email: "", notes: "", phone: "", website: "",
  contactedAt: today(),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fromRow(r: ContactRow): Contact {
  return {
    id:              r.id,
    status:          VALID_STATUSES.has(r.status) ? r.status as ContactStatus : "To contact",
    businessName:    r.business_name,
    instagramHandle: r.instagram_handle ?? undefined,
    category:        r.category,
    city:            r.city,
    followers:       r.followers ?? undefined,
    bookingMethod:   r.booking_method ?? undefined,
    email:           r.email ?? undefined,
    notes:           r.notes ?? undefined,
    phone:           r.phone ?? undefined,
    website:         r.website ?? undefined,
    contactedAt:     r.contacted_at ?? undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(contactedAt?: string): boolean {
  if (!contactedAt) return true;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return new Date(contactedAt + "T00:00:00") <= threeMonthsAgo;
}

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token}` };
}

// ─── Contact card ─────────────────────────────────────────────────────────────

function ContactCard({ c, onEdit, onDelete }: { c: Contact; onEdit: () => void; onDelete: () => void }) {
  const initial = (c.instagramHandle ?? c.businessName).charAt(0).toUpperCase();
  const websiteLabel = c.website ? c.website.replace(/^https?:\/\//, "").split("/")[0] : null;

  return (
    <div className="bg-[#FFF5F0] rounded-2xl p-4 flex flex-col gap-3 border border-[#2D1A1F]/10 hover:border-[#C4909A]/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F0D8DC] flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#A87580]">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          {c.instagramHandle ? (
            <a
              href={`https://instagram.com/${c.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#2D1A1F] leading-tight hover:text-[#C4909A] transition-colors"
            >
              @{c.instagramHandle}
            </a>
          ) : (
            <p className="font-bold text-[#2D1A1F] leading-tight">{c.businessName}</p>
          )}
          {c.businessName && c.instagramHandle && (
            <p className="text-xs text-[#9E7580] mt-0.5">{c.businessName}</p>
          )}
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
          {c.status}
        </span>
      </div>

      {c.category && (
        <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-[#C4909A]/10 text-[#A87580]">
          {c.category}
        </span>
      )}
      {c.notes && <p className="text-sm text-[#6B4550] leading-snug line-clamp-2">{c.notes}</p>}

      <div className="border-t border-[#2D1A1F]/6 pt-3 flex items-center gap-3 flex-wrap">
        {c.contactedAt ? (
          <span className={`text-xs ${isOverdue(c.contactedAt) ? "text-amber-600 font-medium" : "text-[#B09098]"}`}>
            {isOverdue(c.contactedAt) ? "⚠ " : ""}Contacted {formatDate(c.contactedAt)}
          </span>
        ) : (
          <span className="text-xs text-amber-600 font-medium">⚠ Never contacted</span>
        )}
        {c.email && (
          <a href={`mailto:${c.email}`} className="text-[#B09098] hover:text-[#C4909A] transition-colors ml-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        )}
        {websiteLabel && (
          <a href={c.website} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-xs text-[#6B4550] hover:text-[#C4909A] transition-colors ${!c.email ? "ml-auto" : ""}`}>
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="truncate max-w-[120px]">{websiteLabel}</span>
          </a>
        )}
        <button onClick={onEdit} className={`text-sm font-medium text-[#2D1A1F] hover:text-[#C4909A] transition-colors ${!c.email && !websiteLabel ? "ml-auto" : ""}`}>Edit</button>
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

function ContactsScreen({ onOpenAdd }: { onOpenAdd: (fn: () => void) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "All">("All");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);

  async function load() {
    const headers = await authHeaders();
    const res = await fetch("/api/admin/contacts", { headers });
    if (res.ok) {
      const rows: ContactRow[] = await res.json();
      setContacts(rows.map(fromRow));
    }
    setLoading(false);
  }

  // Persist form across app switches on mobile
  useEffect(() => {
    const saved = sessionStorage.getItem("contact_panel");
    if (saved) {
      try {
        const { form: f, editing: e } = JSON.parse(saved);
        setForm(f);
        setEditing(e);
        setPanelOpen(true);
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  useEffect(() => {
    if (panelOpen) {
      sessionStorage.setItem("contact_panel", JSON.stringify({ form, editing }));
    } else {
      sessionStorage.removeItem("contact_panel");
    }
  }, [panelOpen, form, editing]);

  useEffect(() => { load(); }, []);
  useEffect(() => { onOpenAdd(openAdd); }, []);

  function openAdd() { setEditing(null); setForm({ ...EMPTY_FORM, contactedAt: today() }); setPanelOpen(true); }
  function openEdit(c: Contact) {
    setEditing(c);
    setForm({ status: c.status, businessName: c.businessName, instagramHandle: c.instagramHandle, category: c.category, city: c.city, followers: c.followers, bookingMethod: c.bookingMethod, email: c.email, notes: c.notes, phone: c.phone, website: c.website, contactedAt: c.contactedAt ?? today() });
    setPanelOpen(true);
  }
  function closePanel() { setPanelOpen(false); setEditing(null); }

  async function saveContact() {
    if (!form.businessName.trim() && !form.instagramHandle?.trim()) return;
    setSaving(true);
    const headers = { ...(await authHeaders()), "Content-Type": "application/json" };

    if (editing) {
      const res = await fetch(`/api/admin/contacts/${editing.id}`, { method: "PATCH", headers, body: JSON.stringify(form) });
      if (res.ok) {
        const updated: ContactRow = await res.json();
        setContacts((prev) => prev.map((c) => c.id === editing.id ? fromRow(updated) : c));
      }
    } else {
      const res = await fetch("/api/admin/contacts", { method: "POST", headers, body: JSON.stringify(form) });
      if (res.ok) {
        const created: ContactRow = await res.json();
        setContacts((prev) => [fromRow(created), ...prev]);
      }
    }
    setSaving(false);
    closePanel();
  }

  async function deleteContact(id: string) {
    if (!confirm("Remove this contact?")) return;
    const headers = await authHeaders();
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE", headers });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const overdueCount = contacts.filter((c) => isOverdue(c.contactedAt)).length;

  const filtered = contacts.filter((c) => {
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesOverdue = !overdueOnly || isOverdue(c.contactedAt);
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      c.businessName.toLowerCase().includes(q) ||
      (c.instagramHandle ?? "").toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.notes ?? "").toLowerCase().includes(q);
    return matchesStatus && matchesOverdue && matchesQuery;
  });

  const statusCounts = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, contacts.filter((c) => c.status === s).length])
  ) as Record<ContactStatus, number>;

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
          placeholder="Search name, service, notes…"
          className="w-full text-base bg-white border border-[#2D1A1F]/8 text-[#2D1A1F] placeholder-[#B09098] rounded-2xl pl-11 pr-4 py-3.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
        />
      </div>

      {/* Stat cards — also act as filters */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setStatusFilter("All")}
          className={`shrink-0 bg-white rounded-2xl p-4 text-left shadow-sm border transition-colors min-w-[80px] ${statusFilter === "All" ? "border-[#C4909A]/40" : "border-[#2D1A1F]/5 hover:border-[#C4909A]/20"}`}
        >
          <p className="text-3xl font-bold text-[#2D1A1F] leading-none">{contacts.length}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-3.5 h-3.5 text-[#9E7580]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-[#9E7580]">All</span>
          </div>
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 bg-white rounded-2xl p-4 text-left shadow-sm border transition-colors min-w-[90px] ${statusFilter === s ? "border-[#C4909A]/40" : "border-[#2D1A1F]/5 hover:border-[#C4909A]/20"}`}
          >
            <p className="text-3xl font-bold text-[#2D1A1F] leading-none">{statusCounts[s]}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[s]}`} />
              <span className="text-xs text-[#9E7580] leading-tight">{s}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Follow-up filter */}
      {overdueCount > 0 && (
        <button
          onClick={() => setOverdueOnly((v) => !v)}
          className={`self-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            overdueOnly
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Needs follow-up ({overdueCount})
        </button>
      )}

      {loading ? (
        <p className="text-sm text-[#B09098] text-center py-12">Loading…</p>
      ) : (
        <>
          <p className="text-sm text-[#9E7580]">{filtered.length} provider{filtered.length !== 1 ? "s" : ""}</p>

          {filtered.length === 0 ? (
            <p className="text-sm text-[#B09098] text-center py-12">
              {contacts.length === 0 ? "No contacts yet — add one or import a CSV." : "No contacts match your filter."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((c) => (
                <ContactCard key={c.id} c={c} onEdit={() => openEdit(c)} onDelete={() => deleteContact(c.id)} />
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
              <h2 className="text-base font-semibold text-[#2D1A1F]">{editing ? "Edit contact" : "Add contact"}</h2>
              <button onClick={closePanel} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2D1A1F]/5 text-[#9E7580] hover:bg-[#2D1A1F]/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
              <div className={labelCls}>
                <span className={labelTextCls}>Status</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                        form.status === s
                          ? "bg-[#C4909A] text-white border-[#C4909A]"
                          : "bg-[#FAF7F5] text-[#6B4550] border-[#2D1A1F]/10 hover:border-[#C4909A]/40"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${form.status === s ? "bg-white/70" : STATUS_DOT[s]}`} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label className={labelCls}>
                <span className={labelTextCls}>Business name</span>
                <input value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} placeholder="e.g. Nails by Sophie" className={inputCls} />
              </label>
              <label className={labelCls}>
                <span className={labelTextCls}>Instagram handle or profile link</span>
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
              <div className={labelCls}>
                <span className={labelTextCls}>Category</span>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Nails"
                  className={inputCls}
                />
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {["Nails","Lashes","Hair","Brows","Makeup"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.category === cat
                          ? "bg-[#C4909A] text-white border-[#C4909A]"
                          : "bg-[#FAF7F5] text-[#6B4550] border-[#2D1A1F]/10 hover:border-[#C4909A]/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <label className={labelCls}>
                <span className={labelTextCls}>Notes</span>
                <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this contact…" rows={4} className={`${inputCls} resize-none`} />
              </label>
              <label className={labelCls}>
                <span className={labelTextCls}>Date contacted</span>
                <input
                  type="date"
                  value={form.contactedAt ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, contactedAt: e.target.value || undefined }))}
                  className={inputCls}
                />
              </label>
              <label className={labelCls}>
                <span className={labelTextCls}>Email</span>
                <input type="email" value={form.email ?? ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="contact@example.com" className={inputCls} />
              </label>
              <label className={labelCls}>
                <span className={labelTextCls}>Phone</span>
                <input value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+44 7XXX XXXXXX" className={inputCls} />
              </label>
              <label className={labelCls}>
                <span className={labelTextCls}>Website / booking link</span>
                <input value={form.website ?? ""} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://…" className={inputCls} />
              </label>
            </div>

            <div className="px-5 py-4 border-t border-[#2D1A1F]/8 flex gap-3">
              <button
                onClick={saveContact}
                disabled={saving || (!form.businessName.trim() && !form.instagramHandle?.trim())}
                className="flex-1 bg-[#C4909A] text-white text-base font-semibold py-3.5 rounded-xl hover:bg-[#A87580] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving…" : editing ? "Save changes" : "Add contact"}
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

export default function AdminContactsPage() {
  const [openAddFn, setOpenAddFn] = useState<(() => void) | null>(null);

  return (
    <AdminShell
      activeTab="contacts"
      headerRight={
        <button
          onClick={() => openAddFn?.()}
          className="bg-[#C4909A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#A87580] transition-colors"
        >
          + Add contact
        </button>
      }
    >
      <ContactsScreen onOpenAdd={(fn) => setOpenAddFn(() => fn)} />
    </AdminShell>
  );
}

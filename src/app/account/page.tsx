"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import ProviderForm, { type ProviderFormData } from "@/app/admin/_components/ProviderForm";
import { type Provider } from "@/lib/db";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-6 py-5">
      <h2 className="text-sm font-semibold text-[#2D1A1F] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function StatusMessage({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <p className={`text-xs px-3 py-2 rounded-lg mt-3 ${type === "error" ? "text-red-500 bg-red-50" : "text-[#A87580] bg-[#C4909A]/10"}`}>
      {message}
    </p>
  );
}

const inputClass =
  "w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent";

const btnClass =
  "self-start bg-[#C4909A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#A87580] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

// ─── Account tab ──────────────────────────────────────────────────────────────

function AccountTab() {
  const { email, name, updateName, updateEmail, updatePassword, logout } = useAuth();
  const router = useRouter();

  const [nameVal, setNameVal] = useState(name ?? "");
  const [nameStatus, setNameStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [nameSaving, setNameSaving] = useState(false);

  useEffect(() => { setNameVal(name ?? ""); }, [name]);

  async function handleName(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameStatus(null);
    const { error } = await updateName(nameVal.trim());
    setNameSaving(false);
    setNameStatus(error ? { type: "error", msg: error } : { type: "success", msg: "Name updated." });
  }

  const [emailVal, setEmailVal] = useState("");
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [emailSaving, setEmailSaving] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailSaving(true);
    setEmailStatus(null);
    const { error } = await updateEmail(emailVal.trim());
    setEmailSaving(false);
    setEmailStatus(error ? { type: "error", msg: error } : { type: "success", msg: "Confirmation sent. Click the link to confirm the change." });
    if (!error) setEmailVal("");
  }

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwStatus, setPwStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus(null);
    if (newPw !== confirmPw) { setPwStatus({ type: "error", msg: "Passwords do not match." }); return; }
    if (newPw.length < 6) { setPwStatus({ type: "error", msg: "Password must be at least 6 characters." }); return; }
    setPwSaving(true);
    const { error } = await updatePassword(newPw);
    setPwSaving(false);
    setPwStatus(error ? { type: "error", msg: error } : { type: "success", msg: "Password updated." });
    if (!error) { setNewPw(""); setConfirmPw(""); }
  }

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") { setDeleteStatus({ type: "error", msg: "Type DELETE (all caps) to confirm." }); return; }
    setDeleting(true);
    setDeleteStatus(null);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/account/delete", { method: "POST", headers: { Authorization: `Bearer ${session?.access_token}` } });
    const body = await res.json();
    setDeleting(false);
    if (!res.ok) { setDeleteStatus({ type: "error", msg: body.error ?? "Something went wrong." }); return; }
    await logout();
    router.replace("/");
  }

  return (
    <div className="flex flex-col gap-5">
      <Section title="Display name">
        <form onSubmit={handleName} className="flex flex-col gap-3">
          <input type="text" value={nameVal} onChange={(e) => setNameVal(e.target.value)} placeholder="Your name" className={inputClass} />
          {nameStatus && <StatusMessage type={nameStatus.type} message={nameStatus.msg} />}
          <button type="submit" disabled={nameSaving} className={btnClass}>{nameSaving ? "Saving…" : "Save name"}</button>
        </form>
      </Section>

      <Section title="Email address">
        <p className="text-xs text-[#9E7580] mb-3">Current: <span className="font-medium text-[#6B4550]">{email}</span></p>
        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          <input type="email" required value={emailVal} onChange={(e) => setEmailVal(e.target.value)} placeholder="New email address" className={inputClass} />
          {emailStatus && <StatusMessage type={emailStatus.type} message={emailStatus.msg} />}
          <button type="submit" disabled={emailSaving} className={btnClass}>{emailSaving ? "Saving…" : "Update email"}</button>
        </form>
      </Section>

      <Section title="Password">
        <form onSubmit={handlePassword} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#6B4550] mb-1">New password</label>
            <input type="password" required value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B4550] mb-1">Confirm new password</label>
            <input type="password" required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          {pwStatus && <StatusMessage type={pwStatus.type} message={pwStatus.msg} />}
          <button type="submit" disabled={pwSaving} className={btnClass}>{pwSaving ? "Saving…" : "Update password"}</button>
        </form>
      </Section>

      <Section title="Danger zone">
        <p className="text-xs text-[#9E7580] mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
        <form onSubmit={handleDelete} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#6B4550] mb-1">
              Type <span className="font-mono text-red-500">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full text-sm bg-[#FAF0E6] border border-red-300/50 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-transparent"
            />
          </div>
          {deleteStatus && <StatusMessage type={deleteStatus.type} message={deleteStatus.msg} />}
          <button type="submit" disabled={deleting} className="self-start bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </form>
      </Section>
    </div>
  );
}

// ─── Listing tab ──────────────────────────────────────────────────────────────

function ListingTab() {
  const { isLoggedIn } = useAuth();
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoaded(true); return; }
      const res = await fetch("/api/provider/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setProviderData(await res.json());
      setLoaded(true);
    });
  }, [isLoggedIn]);

  async function handleSave(data: ProviderFormData): Promise<{ error: string | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/provider/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? "Failed to save" };
    setProviderData((prev) => prev ? { ...prev, ...data } : prev);
    return { error: null };
  }

  if (!loaded) return <p className="text-sm text-[#B09098]">Loading…</p>;
  if (!providerData) return <p className="text-sm text-[#B09098]">No listing found for your account.</p>;

  const isPending  = providerData.status === "pending";
  const isUnlisted = providerData.status === "unlisted";
  const isVisible  = providerData.status === "approved";

  return (
    <div className="flex flex-col gap-4">
      {isPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-700">Pending approval</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your listing is under review and not yet visible on the site. You can still edit your details below.
            </p>
          </div>
        </div>
      )}
      {isUnlisted && (
        <div className="bg-[#FFF5F0] border border-[#2D1A1F]/10 rounded-xl px-4 py-3 flex items-start gap-3">
          <svg className="w-4 h-4 text-[#9E7580] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-[#6B4550]">Your listing is unlisted</p>
            <p className="text-xs text-[#9E7580] mt-0.5">
              Your profile is hidden from the site. Contact us if you think this is a mistake.
            </p>
          </div>
        </div>
      )}
      <div className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-xl px-6 py-5">
        {isVisible && (
          <p className="text-xs text-[#9E7580] mb-5">Changes are visible on the site immediately.</p>
        )}
        <ProviderForm
          initialData={{
            name: providerData.name,
            categories: providerData.categories,
            description: providerData.description,
            address: providerData.address ?? "",
            phone: providerData.phone ?? "",
            email: providerData.email ?? "",
            instagram: providerData.instagram ?? "",
            website: providerData.website ?? "",
            profile_picture_url: providerData.profile_picture_url,
          }}
          onSubmit={handleSave}
          submitLabel="Save listing"
          uploadUrl="/api/provider/upload"
        />
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconAccount() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconListing() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "account" | "listing";

export default function AccountPage() {
  const { loading: authLoading, isLoggedIn, email } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("account");
  const [isProvider, setIsProvider] = useState(false);
  const [providerChecked, setProviderChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) router.replace("/login?from=/account");
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setProviderChecked(true); return; }
      const res = await fetch("/api/provider/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setIsProvider(res.ok);
      setProviderChecked(true);
    });
  }, [isLoggedIn]);

  if (authLoading || !isLoggedIn || !providerChecked) return null;

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <IconAccount /> },
    ...(isProvider ? [{ id: "listing" as Tab, label: "My listing", icon: <IconListing /> }] : []),
  ];

  // Simple single-column layout for non-providers
  if (providerChecked && !isProvider) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="mb-6">
            <Link href="/" className="text-xs text-[#B09098] hover:text-[#2D1A1F] transition-colors">← Back to site</Link>
            <h1 className="text-lg font-bold text-[#2D1A1F] mt-3">My account</h1>
            <p className="text-xs text-[#9E7580] mt-0.5">{email}</p>
          </div>
          <AccountTab />
        </div>
      </div>
    );
  }

  // Sidebar layout for providers
  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className="w-56 shrink-0 border-r border-[#2D1A1F]/8 flex flex-col">
        <div className="px-5 py-6 border-b border-[#2D1A1F]/8">
          <Link href="/">
            <img src="/logo-Transparent.png" alt="Newbi" className="h-7" />
          </Link>
          <p className="text-xs text-[#B09098] mt-1">{email}</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-5 border-b border-[#2D1A1F]/8">
          <h1 className="text-base font-semibold text-[#2D1A1F]">
            {tab === "account" ? "Account" : "My listing"}
          </h1>
        </header>

        <main className="flex-1 px-8 py-6 overflow-y-auto max-w-2xl">
          {tab === "account" && <AccountTab />}
          {tab === "listing" && <ListingTab />}
        </main>
      </div>
    </div>
  );
}

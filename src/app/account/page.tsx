"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
      <h2 className="text-sm font-semibold text-slate-200 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function StatusMessage({ type, message }: { type: "success" | "error"; message: string }) {
  return (
    <p className={`text-xs px-3 py-2 rounded-lg mt-3 ${type === "error" ? "text-red-400 bg-red-900/20" : "text-green-400 bg-green-900/20"}`}>
      {message}
    </p>
  );
}

export default function AccountPage() {
  const { isLoggedIn, email, name, updateName, updateEmail, updatePassword, logout } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) router.replace("/login?from=/account");
  }, [isLoggedIn, router]);

  // Name form
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

  // Email form
  const [emailVal, setEmailVal] = useState("");
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [emailSaving, setEmailSaving] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailSaving(true);
    setEmailStatus(null);
    const { error } = await updateEmail(emailVal.trim());
    setEmailSaving(false);
    setEmailStatus(
      error
        ? { type: "error", msg: error }
        : { type: "success", msg: "Confirmation sent to your new address. Click the link to confirm the change." }
    );
    if (!error) setEmailVal("");
  }

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: "error", msg: "Password must be at least 6 characters." });
      return;
    }
    setPasswordSaving(true);
    const { error } = await updatePassword(newPassword);
    setPasswordSaving(false);
    setPasswordStatus(error ? { type: "error", msg: error } : { type: "success", msg: "Password updated." });
    if (!error) { setNewPassword(""); setConfirmPassword(""); }
  }

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirm !== "DELETE") {
      setDeleteStatus({ type: "error", msg: 'Type DELETE (all caps) to confirm.' });
      return;
    }
    setDeleting(true);
    setDeleteStatus(null);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json();
    setDeleting(false);

    if (!res.ok) {
      setDeleteStatus({ type: "error", msg: body.error ?? "Something went wrong." });
      return;
    }

    await logout();
    router.replace("/");
  }

  if (!isLoggedIn) return null;

  return (
    <>
      <PageHeader
        title="My account"
        subtitle={email ?? undefined}
        backHref="/"
        backLabel="Back to all businesses"
      />
      <main className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Display name */}
        <Section title="Display name">
          <form onSubmit={handleName} className="flex flex-col gap-3">
            <input
              type="text"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              placeholder="Your name"
              className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
            />
            {nameStatus && <StatusMessage type={nameStatus.type} message={nameStatus.msg} />}
            <button
              type="submit"
              disabled={nameSaving}
              className="self-start bg-[#a5de57] text-sm font-semibold px-4 py-2 rounded-xl text-[#0e1821] hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {nameSaving ? "Saving…" : "Save name"}
            </button>
          </form>
        </Section>

        {/* Email */}
        <Section title="Email address">
          <p className="text-xs text-slate-400 mb-3">Current: <span className="font-medium text-slate-200">{email}</span></p>
          <form onSubmit={handleEmail} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              placeholder="New email address"
              className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
            />
            {emailStatus && <StatusMessage type={emailStatus.type} message={emailStatus.msg} />}
            <button
              type="submit"
              disabled={emailSaving}
              className="self-start bg-[#a5de57] text-sm font-semibold px-4 py-2 rounded-xl text-[#0e1821] hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {emailSaving ? "Saving…" : "Update email"}
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section title="Password">
          <form onSubmit={handlePassword} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm new password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
            {passwordStatus && <StatusMessage type={passwordStatus.type} message={passwordStatus.msg} />}
            <button
              type="submit"
              disabled={passwordSaving}
              className="self-start bg-[#a5de57] text-sm font-semibold px-4 py-2 rounded-xl text-[#0e1821] hover:opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passwordSaving ? "Saving…" : "Update password"}
            </button>
          </form>
        </Section>

        {/* Delete account */}
        <Section title="Danger zone">
          <p className="text-xs text-slate-400 mb-3">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <form onSubmit={handleDelete} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Type <span className="font-mono text-red-400">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full text-sm bg-[#091624] border border-red-900/50 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-transparent"
              />
            </div>
            {deleteStatus && <StatusMessage type={deleteStatus.type} message={deleteStatus.msg} />}
            <button
              type="submit"
              disabled={deleting}
              className="self-start bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting…" : "Delete my account"}
            </button>
          </form>
        </Section>

      </main>
    </>
  );
}

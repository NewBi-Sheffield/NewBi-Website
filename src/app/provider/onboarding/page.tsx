"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [providerName, setProviderName] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { setTokenError("No invite token found in this link."); return; }

    fetch(`/api/provider/invite/${token}`)
      .then((r) => r.json())
      .then((body) => {
        if (body.error) setTokenError(body.error);
        else {
          setProviderName(body.providerName);
          setProfilePictureUrl(body.profilePictureUrl ?? null);
        }
      })
      .catch(() => setTokenError("Failed to validate invite link."));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);

    const res = await fetch(`/api/provider/invite/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email, password }),
    });
    const body = await res.json();

    if (!res.ok) {
      setError(body.error);
      setLoading(false);
      return;
    }

    await supabase.auth.signInWithPassword({ email, password });
    router.push(`/providers/${body.providerId}`);
  }

  if (tokenError) {
    return (
      <main className="min-h-screen bg-[#080f18] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm">{tokenError}</p>
          <p className="text-slate-500 text-xs mt-2">Ask your Newbi contact for a new link.</p>
        </div>
      </main>
    );
  }

  if (!providerName) {
    return (
      <main className="min-h-screen bg-[#080f18] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Validating invite…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080f18] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Provider identity */}
        <div className="flex flex-col items-center mb-8">
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={providerName}
              width={80}
              height={80}
              className="rounded-full object-cover ring-2 ring-white/10 mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1a3550] flex items-center justify-center ring-2 ring-white/10 mb-4">
              <span className="text-2xl font-bold text-slate-400">{providerName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-white text-center">{providerName}</h1>
          <p className="text-sm text-slate-400 mt-1">Set up your Newbi account</p>
        </div>

        {/* Form */}
        <div className="bg-[#0a1929] rounded-2xl border border-white/8 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="password">
                Choose a password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1.5">At least 6 characters.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up…" : "Complete setup"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ProviderOnboardingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#080f18] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </main>
    }>
      <OnboardingForm />
    </Suspense>
  );
}

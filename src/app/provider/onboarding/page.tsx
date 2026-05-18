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
      <main className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-sm">{tokenError}</p>
          <p className="text-[#B09098] text-xs mt-2">Ask your NewBi contact for a new link.</p>
        </div>
      </main>
    );
  }

  if (!providerName) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-[#9E7580] text-sm">Validating invite…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Provider identity */}
        <div className="flex flex-col items-center mb-8">
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={providerName}
              width={80}
              height={80}
              className="rounded-full object-cover ring-2 ring-[#2D1A1F]/10 mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#F0D8DC] flex items-center justify-center ring-2 ring-[#2D1A1F]/10 mb-4">
              <span className="text-2xl font-bold text-[#A87580]">{providerName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-[#2D1A1F] text-center">{providerName}</h1>
          <p className="text-sm text-[#9E7580] mt-1">Set up your NewBi account</p>
        </div>

        {/* Form */}
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/8 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B4550] mb-1" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B4550] mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B4550] mb-1" htmlFor="password">
                Choose a password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
              />
              <p className="text-xs text-[#B09098] mt-1.5">At least 6 characters.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B4550] mb-1" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
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
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-[#9E7580] text-sm">Loading…</p>
      </main>
    }>
      <OnboardingForm />
    </Suspense>
  );
}

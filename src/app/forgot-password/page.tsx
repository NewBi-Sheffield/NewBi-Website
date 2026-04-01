"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/reset-callback`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <>
        <PageHeader
          title="Check your email"
          subtitle="A reset link is on its way"
          backHref="/login"
          backLabel="Back to log in"
        />
        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6 text-center">
            <p className="text-sm text-slate-300 mb-4">
              If <span className="font-semibold text-white">{email}</span> has an account, you&apos;ll receive a password reset link shortly.
            </p>
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all text-center"
            >
              Back to log in
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Reset your password"
        subtitle="We'll send you a link to reset it"
        backHref="/login"
        backLabel="Back to log in"
      />
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center text-sm text-slate-400">
              Remembered it?{" "}
              <Link href="/login" className="text-[#45c97a] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

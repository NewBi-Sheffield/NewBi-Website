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
          <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6 text-center">
            <p className="text-sm text-[#6B4550] mb-2">
              If <span className="font-semibold text-[#2D1A1F]">{email}</span> has an account, you&apos;ll receive a password reset link shortly.
            </p>
            <p className="text-xs text-[#9E7580] mb-4">Can&apos;t see it? Check your spam or junk folder.</p>
            <Link
              href="/login"
              className="block w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-95 transition-all text-center"
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
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center text-sm text-[#9E7580]">
              Remembered it?{" "}
              <Link href="/login" className="text-[#C4909A] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

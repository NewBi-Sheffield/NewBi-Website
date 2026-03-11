"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await signup(email, password);
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <>
        <PageHeader
          title="Check your email"
          subtitle="We sent you a confirmation link"
          backHref="/login"
          backLabel="Back to log in"
        />
        <main className="max-w-md mx-auto px-4 py-8">
          <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6 text-center">
            <p className="text-sm text-slate-300 mb-4">
              A confirmation link has been sent to <span className="font-semibold text-white">{email}</span>.
              Click the link in the email to activate your account, then log in.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-[#125a40] to-[#a5de57] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Go to log in
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Create an account"
        subtitle="Sign up to leave reviews and more"
        backHref="/"
        backLabel="Back to all businesses"
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
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
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
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#a5de57]/40 focus:border-transparent"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#125a40] to-[#a5de57] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#a5de57] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

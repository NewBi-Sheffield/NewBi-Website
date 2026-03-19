"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    router.push(from);
  }

  return (
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
          className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent"
        />
        <p className="text-xs text-slate-500 mt-1.5">
          Forgot your password?{" "}
          <span className="text-[#45c97a] cursor-pointer hover:underline">Reset it</span>
        </p>
      </div>
      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#45c97a] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <PageHeader
        title="Welcome back"
        subtitle="Log in to leave reviews and more"
        backHref="/"
        backLabel="Back to all businesses"
      />
      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}

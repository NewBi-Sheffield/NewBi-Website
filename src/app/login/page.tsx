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
  const resetSuccess = searchParams.get("reset") === "success";

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
      {resetSuccess && (
        <p className="text-xs text-[#A87580] bg-[#C4909A]/10 px-3 py-2 rounded-lg">
          Password updated successfully. Log in with your new password.
        </p>
      )}
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
          Password
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
        <p className="text-xs text-[#B09098] mt-1.5">
          Forgot your password?{" "}
          <Link href="/forgot-password" className="text-[#C4909A] hover:underline">Reset it</Link>
        </p>
      </div>
      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-95 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-[#9E7580]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#C4909A] font-semibold hover:underline">
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
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}

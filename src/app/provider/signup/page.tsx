"use client";

import { useState, KeyboardEvent } from "react";
import Link from "next/link";

const inputClass =
  "w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent";
const labelClass = "block text-xs font-semibold text-slate-300 mb-1";

// ─── Step 1: Account ──────────────────────────────────────────────────────────

type AccountData = { accountName: string; email: string; password: string };

function AccountStep({ onNext }: { onNext: (data: AccountData) => void }) {
  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!accountName.trim()) { setError("Your name is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    onNext({ accountName: accountName.trim(), email: email.trim(), password });
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45c97a]/20 to-[#3d88c4]/20 border border-[#45c97a]/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[#45c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Create your account</h1>
        <p className="text-slate-400 text-sm mt-1">Step 1 of 2 — you'll add your business details next</p>
      </div>

      <div className="bg-[#0a1929] border border-white/8 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Your full name *</label>
            <input
              required
              autoFocus
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
            <p className="text-xs text-slate-500 mt-1">At least 6 characters.</p>
          </div>

          <div>
            <label className={labelClass}>Confirm password *</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all mt-1"
          >
            Continue →
          </button>
        </form>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-[#45c97a] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

// ─── Step 2: Business ─────────────────────────────────────────────────────────

function BusinessStep({
  account,
  onSuccess,
}: {
  account: AccountData;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [description, setDescription] = useState("");
  const [businessEmail, setBusinessEmail] = useState(account.email);
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addCategory(value: string) {
    const trimmed = value.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((c) => [...c, trimmed]);
  }

  function removeCategory(cat: string) {
    setCategories((c) => c.filter((x) => x !== cat));
  }

  function handleCatKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(catInput);
      setCatInput("");
    } else if (e.key === "Backspace" && catInput === "" && categories.length > 0) {
      removeCategory(categories[categories.length - 1]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const finalCategories = [...categories];
    if (catInput.trim() && !categories.includes(catInput.trim())) {
      finalCategories.push(catInput.trim());
    }

    if (!name.trim()) { setError("Business name is required."); return; }
    if (finalCategories.length === 0) { setError("At least one category is required."); return; }

    setLoading(true);

    const res = await fetch("/api/provider/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountName: account.accountName,
        email: businessEmail.trim() || account.email,
        password: account.password,
        name: name.trim(),
        categories: finalCategories,
        description: description.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() || null,
        instagram: instagram.trim() || null,
        website: website.trim() || null,
      }),
    });

    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    onSuccess();
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#45c97a]/20 to-[#3d88c4]/20 border border-[#45c97a]/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[#45c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Your business details</h1>
        <p className="text-slate-400 text-sm mt-1">Step 2 of 2 — this is what appears on your public listing</p>
      </div>

      <div className="bg-[#0a1929] border border-white/8 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className={labelClass}>Business name *</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jasmine's Hair Studio"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Service categories *</label>
            <div className="flex flex-wrap gap-1.5 w-full text-sm bg-[#091624] border border-white/10 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#45c97a]/40 min-h-[44px] items-center">
              {categories.map((cat) => (
                <span key={cat} className="flex items-center gap-1 bg-[#45c97a]/15 text-[#45c97a] text-xs font-medium px-2 py-0.5 rounded-full">
                  {cat}
                  <button type="button" onClick={() => removeCategory(cat)} className="hover:text-white leading-none">×</button>
                </span>
              ))}
              <input
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                onKeyDown={handleCatKeyDown}
                onBlur={() => { if (catInput.trim()) { addCategory(catInput); setCatInput(""); } }}
                placeholder={categories.length === 0 ? "e.g. Hair, Nails — press Enter to add…" : "Add another…"}
                className="flex-1 min-w-[120px] bg-transparent text-white placeholder-slate-500 outline-none text-sm py-0.5"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Press Enter or comma to add. Backspace to remove last.</p>
          </div>

          <div>
            <label className={labelClass}>About your business</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your services, experience, and what makes you special…"
              rows={4}
              className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Business email</label>
              <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="hello@example.com" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Website</label>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram</label>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle or full URL" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Sheffield" className={inputClass} />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen({ email }: { email: string }) {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-[#3d88c4]/15 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#3d88c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
      <p className="text-slate-400 text-sm leading-relaxed">
        We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
        Click it to confirm your address and submit your application for review.
      </p>
      <p className="text-slate-500 text-xs mt-4">The link expires in 24 hours.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Step = "account" | "business" | "success";

export default function ProviderSignupPage() {
  const [step, setStep] = useState<Step>("account");
  const [account, setAccount] = useState<AccountData | null>(null);

  return (
    <main className="min-h-screen bg-[#080f18] px-4 py-12 flex flex-col items-center justify-center">
      {/* Step indicator */}
      {step !== "success" && (
        <div className="flex items-center gap-2 mb-10">
          {(["account", "business"] as const).map((s, i) => {
            const done = step === "business" && s === "account";
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className={`w-12 h-px ${done ? "bg-[#45c97a]" : "bg-white/10"}`} />}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? "bg-[#45c97a] text-white" : active ? "bg-white/10 text-white border border-white/30" : "bg-white/5 text-slate-500"
                }`}>
                  {done ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {step === "account" && (
        <AccountStep
          onNext={(data) => { setAccount(data); setStep("business"); }}
        />
      )}
      {step === "business" && account && (
        <BusinessStep
          account={account}
          onSuccess={() => setStep("success")}
        />
      )}
      {step === "success" && account && <SuccessScreen email={account.email} />}

      {step === "account" && (
        <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors mt-8">
          ← Back to site
        </Link>
      )}
    </main>
  );
}

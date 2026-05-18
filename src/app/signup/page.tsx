"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const inputClass =
  "w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent";
const labelClass = "block text-xs font-semibold text-[#6B4550] mb-1";

function cropToSquareDataUrl(file: File): Promise<{ dataUrl: string; mime: string }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);
      resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.9), mime: "image/jpeg" });
    };
    img.src = objectUrl;
  });
}

type SignupType = "student" | "provider";
type Step = "choose" | "account" | "business" | "success";
type AccountData = { name: string; email: string; password: string };

// ─── Choose ───────────────────────────────────────────────────────────────────

function ChooseStep({ onChoose }: { onChoose: (t: SignupType) => void }) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-[#2D1A1F]">Join NewBi</h1>
        <p className="text-[#9E7580] text-sm mt-2">How are you planning to use NewBi?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChoose("student")}
          className="group bg-[#FFF5F0] border border-[#2D1A1F]/8 hover:border-[#C4909A]/40 rounded-2xl p-6 text-left transition-all hover:bg-[#FAF0E6] focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C4909A]/10 flex items-center justify-center mb-4 group-hover:bg-[#C4909A]/20 transition-colors">
            <svg className="w-5 h-5 text-[#C4909A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-[#2D1A1F] font-semibold mb-1">I&apos;m looking for services</p>
          <p className="text-[#9E7580] text-sm leading-relaxed">Save favourites, leave reviews, and discover local businesses.</p>
        </button>

        <button
          type="button"
          onClick={() => onChoose("provider")}
          className="group bg-[#FFF5F0] border border-[#2D1A1F]/8 hover:border-[#A87580]/40 rounded-2xl p-6 text-left transition-all hover:bg-[#FAF0E6] focus:outline-none focus:ring-2 focus:ring-[#A87580]/40"
        >
          <div className="w-10 h-10 rounded-xl bg-[#A87580]/10 flex items-center justify-center mb-4 group-hover:bg-[#A87580]/20 transition-colors">
            <svg className="w-5 h-5 text-[#A87580]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-[#2D1A1F] font-semibold mb-1">I run a business</p>
          <p className="text-[#9E7580] text-sm leading-relaxed">List your business, reach new customers, and manage your profile.</p>
        </button>
      </div>

      <p className="text-xs text-[#B09098] text-center mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-[#C4909A] hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

// ─── Account form (shared between both paths) ──────────────────────────────────

function AccountStep({
  type,
  onNext,
  onBack,
}: {
  type: SignupType;
  onNext: (data: AccountData) => Promise<string | null>;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (password.length < 6) { setError("Your password needs to be at least 6 characters."); return; }
    if (password !== confirm) { setError("Your passwords don't match. Please try again."); return; }
    setLoading(true);
    const err = await onNext({ name: name.trim(), email: email.trim(), password });
    setLoading(false);
    if (err) setError(err);
  }

  const isProvider = type === "provider";

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#C4909A]/15 border border-[#C4909A]/25 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[#C4909A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#2D1A1F]">Create your account</h1>
        {isProvider && (
          <p className="text-[#9E7580] text-sm mt-1">Step 1 of 2 — you&apos;ll add your business details next</p>
        )}
      </div>

      <div className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Your full name *</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <p className="text-xs text-[#B09098] mt-1">At least 6 characters.</p>
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
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : isProvider ? "Continue →" : "Create account"}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="w-full text-[#9E7580] hover:text-[#2D1A1F] text-sm py-2 transition-colors disabled:opacity-40"
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Business form (provider path only) ───────────────────────────────────────

function friendlyApiError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists") || (lower.includes("unique") && lower.includes("email"))) {
    return "That email address is already in use. Please sign in or use a different email.";
  }
  if (lower.includes("invalid email") || lower.includes("unable to validate email")) {
    return "That email address doesn't look right. Please double-check it.";
  }
  if (lower.includes("password")) {
    return "Your password is too short — it needs to be at least 6 characters.";
  }
  if (lower.includes("required fields") || lower.includes("missing")) {
    return "Some required fields are missing. Please fill in everything marked with *.";
  }
  return "We couldn't complete your signup. Please check your details and try again.";
}

function BusinessStep({
  account,
  onBack,
  onSuccess,
}: {
  account: AccountData;
  onBack: () => void;
  onSuccess: (email: string) => void;
}) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [profileDataUrl, setProfileDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("That file isn't an image. Please choose a JPG, PNG, or similar photo."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("That photo is too large. Please choose one under 5 MB."); return; }
    setError(null);
    const { dataUrl } = await cropToSquareDataUrl(file);
    setProfileDataUrl(dataUrl);
  }

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
    if (catInput.trim() && !categories.includes(catInput.trim())) finalCategories.push(catInput.trim());

    if (!name.trim()) { setError("Please enter your business name."); return; }
    if (finalCategories.length === 0) { setError("Please add at least one service category."); return; }

    setLoading(true);

    let profilePictureBase64: string | undefined;
    let profilePictureMime: string | undefined;
    if (profileDataUrl) {
      const [header, data] = profileDataUrl.split(",");
      profilePictureBase64 = data;
      profilePictureMime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    }

    const res = await fetch("/api/provider/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountName: account.name,
        email: account.email,
        password: account.password,
        profilePictureBase64,
        profilePictureMime,
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

    if (!res.ok) { setError(friendlyApiError(body.error ?? "")); return; }

    onSuccess(account.email);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#C4909A]/15 border border-[#C4909A]/25 flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[#C4909A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#2D1A1F]">Your business details</h1>
        <p className="text-[#9E7580] text-sm mt-1">Step 2 of 2 — this is what appears on your public listing</p>
      </div>

      <div className="bg-[#FFF5F0] border border-[#2D1A1F]/8 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Business photo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-[#2D1A1F]/20 hover:border-[#C4909A]/60 transition-colors group focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40"
            >
              {profileDataUrl ? (
                <img src={profileDataUrl} alt="Business photo preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#FAF0E6] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#B09098] group-hover:text-[#C4909A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
              {profileDataUrl && (
                <div className="absolute inset-0 bg-[#2D1A1F]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-[#2D1A1F]">{profileDataUrl ? "Photo added" : "Add a business photo"}</p>
              <p className="text-xs text-[#B09098] mt-0.5">{profileDataUrl ? "Click the photo to change it." : "Optional — shown on your public listing."}</p>
              <button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 text-xs text-[#C4909A] hover:underline">
                {profileDataUrl ? "Change photo" : "Upload photo"}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

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
            <div className="flex flex-wrap gap-1.5 w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#C4909A]/40 min-h-[44px] items-center">
              {categories.map((cat) => (
                <span key={cat} className="flex items-center gap-1 bg-[#C4909A]/15 text-[#A87580] text-xs font-medium px-2 py-0.5 rounded-full">
                  {cat}
                  <button type="button" onClick={() => removeCategory(cat)} className="hover:text-[#2D1A1F] leading-none">×</button>
                </span>
              ))}
              <input
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                onKeyDown={handleCatKeyDown}
                onBlur={() => { if (catInput.trim()) { addCategory(catInput); setCatInput(""); } }}
                placeholder={categories.length === 0 ? "e.g. Hair, Nails — press Enter to add…" : "Add another…"}
                className="flex-1 min-w-[120px] bg-transparent text-[#2D1A1F] placeholder-[#B09098] outline-none text-sm py-0.5"
              />
            </div>
            <p className="text-xs text-[#B09098] mt-1">Press Enter or comma to add. Backspace to remove the last one.</p>
          </div>

          <div>
            <label className={labelClass}>About your business</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your services, experience, and what makes you special…"
              rows={4}
              className="w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" className={inputClass} />
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
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4909A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A87580] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Submit application"}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="w-full text-[#9E7580] hover:text-[#2D1A1F] text-sm py-2 transition-colors disabled:opacity-40"
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Success screens ───────────────────────────────────────────────────────────

function CheckEmailScreen({ email }: { email: string }) {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-[#C4909A]/15 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#C4909A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[#2D1A1F] mb-3">Check your email</h1>
      <p className="text-[#9E7580] text-sm leading-relaxed">
        We sent a confirmation link to <span className="text-[#2D1A1F] font-medium">{email}</span>.
        Click it to activate your account.
      </p>
      <p className="text-[#B09098] text-xs mt-4">The link expires in 24 hours.</p>
      <Link
        href="/login"
        className="inline-block mt-6 text-sm text-[#C4909A] hover:underline"
      >
        Go to sign in →
      </Link>
    </div>
  );
}

function ProviderCheckEmailScreen({ email }: { email: string }) {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-[#C4909A]/15 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#C4909A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[#2D1A1F] mb-3">Check your email</h1>
      <p className="text-[#9E7580] text-sm leading-relaxed">
        We sent a confirmation link to <span className="text-[#2D1A1F] font-medium">{email}</span>.
        Click it to confirm your address and submit your application for review.
      </p>
      <p className="text-[#B09098] text-xs mt-4">The link expires in 24 hours.</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const { loading: authLoading, isLoggedIn, signup } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("choose");
  const [type, setType] = useState<SignupType | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [successEmail, setSuccessEmail] = useState("");

  useEffect(() => {
    if (!authLoading && isLoggedIn) router.replace("/account");
  }, [authLoading, isLoggedIn, router]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2D1A1F]/10 border-t-[#C4909A] animate-spin" />
      </main>
    );
  }

  async function handleAccountNext(data: AccountData): Promise<string | null> {
    setAccount(data);

    if (type === "student") {
      const { error } = await signup(data.email, data.password, data.name);
      if (error) {
        const lower = error.toLowerCase();
        if (lower.includes("already registered") || lower.includes("already exists")) {
          return "An account with that email already exists. Try signing in instead.";
        }
        if (lower.includes("invalid email")) return "That email address doesn't look right.";
        return "We couldn't create your account. Please check your details and try again.";
      }
      setSuccessEmail(data.email);
      setStep("success");
      return null;
    }

    // Provider — move to business step
    setStep("business");
    return null;
  }

  // Step indicator for the provider path
  const showStepIndicator = type === "provider" && (step === "account" || step === "business");

  return (
    <main className="min-h-screen bg-transparent px-4 py-12 flex flex-col items-center justify-center">

      {showStepIndicator && (
        <div className="flex items-center gap-2 mb-10">
          {(["account", "business"] as const).map((s, i) => {
            const done = step === "business" && s === "account";
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className={`w-12 h-px ${done ? "bg-[#C4909A]" : "bg-[#2D1A1F]/10"}`} />}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? "bg-[#C4909A] text-white" : active ? "bg-[#2D1A1F]/10 text-[#2D1A1F] border border-[#2D1A1F]/25" : "bg-[#2D1A1F]/5 text-[#B09098]"
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

      {step === "choose" && (
        <ChooseStep onChoose={(t) => { setType(t); setStep("account"); }} />
      )}

      {step === "account" && type && (
        <AccountStep
          type={type}
          onNext={handleAccountNext}
          onBack={() => setStep("choose")}
        />
      )}

      {step === "business" && account && (
        <BusinessStep
          account={account}
          onBack={() => setStep("account")}
          onSuccess={(email) => { setSuccessEmail(email); setStep("success"); }}
        />
      )}

      {step === "success" && type === "student" && <CheckEmailScreen email={successEmail} />}
      {step === "success" && type === "provider" && <ProviderCheckEmailScreen email={successEmail} />}

      {step === "choose" && (
        <Link href="/" className="text-xs text-[#B09098] hover:text-[#9E7580] transition-colors mt-8">
          ← Back to site
        </Link>
      )}
    </main>
  );
}

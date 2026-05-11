"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent";
const labelClass = "block text-xs font-semibold text-slate-300 mb-1";

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

function friendlyApiError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists") || (lower.includes("unique") && lower.includes("email"))) {
    return "That email address is already in use. Please sign in or use a different email.";
  }
  if (lower.includes("already have a provider")) {
    return "You already have a provider account. Head to your account settings to manage it.";
  }
  if (lower.includes("required fields") || lower.includes("missing")) {
    return "Some required fields are missing. Please fill in everything marked with *.";
  }
  return "We couldn't save your business details. Please try again.";
}

// ─── Business form ────────────────────────────────────────────────────────────

function BusinessForm({
  userEmail,
  onSuccess,
}: {
  userEmail: string;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const [description, setDescription] = useState("");
  const [businessEmail, setBusinessEmail] = useState(userEmail);
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

    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch("/api/provider/apply-existing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        categories: finalCategories,
        description: description.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() || null,
        email: businessEmail.trim() || userEmail,
        instagram: instagram.trim() || null,
        website: website.trim() || null,
        profilePictureBase64,
        profilePictureMime,
      }),
    });

    const body = await res.json();
    setLoading(false);

    if (!res.ok) { setError(friendlyApiError(body.error ?? "")); return; }

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
        <h1 className="text-xl font-bold text-white">List your business</h1>
        <p className="text-slate-400 text-sm mt-1">Tell us about your business — this is what appears on your public listing</p>
      </div>

      <div className="bg-[#0a1929] border border-white/8 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Business photo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-[#45c97a]/60 transition-colors group focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40"
            >
              {profileDataUrl ? (
                <img src={profileDataUrl} alt="Business photo preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#091624] flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-500 group-hover:text-[#45c97a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
              {profileDataUrl && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-white">{profileDataUrl ? "Photo added" : "Add a business photo"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{profileDataUrl ? "Click the photo to change it." : "Optional — shown on your public listing."}</p>
              <button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 text-xs text-[#45c97a] hover:underline">
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
            <p className="text-xs text-slate-500 mt-1">Press Enter or comma to add. Backspace to remove the last one.</p>
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

function SuccessScreen() {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-[#45c97a]/15 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#45c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Application submitted</h1>
      <p className="text-slate-400 text-sm leading-relaxed">
        Our team will review your listing and you&apos;ll hear back from us shortly. You&apos;ll get an email when it&apos;s approved.
      </p>
      <p className="text-slate-500 text-xs mt-4">
        You can update your details from your{" "}
        <a href="/account" className="text-[#45c97a] hover:underline">account page</a>{" "}
        while you wait.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type PageState = "checking" | "form" | "success";

export default function UpgradePage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("checking");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/signup");
        return;
      }

      // Check if they're already a provider
      const res = await fetch("/api/provider/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        router.replace("/account");
        return;
      }

      setUserEmail(session.user.email ?? "");
      setState("form");
    }

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#080f18] px-4 py-12 flex flex-col items-center justify-center">
      {state === "checking" && (
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#45c97a] animate-spin" />
      )}
      {state === "form" && (
        <BusinessForm userEmail={userEmail} onSuccess={() => setState("success")} />
      )}
      {state === "success" && <SuccessScreen />}
    </main>
  );
}

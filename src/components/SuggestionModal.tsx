"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SuggestionModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setName(""); setEmail(""); setMessage("");
      setError(null); setSuccess(false); setLoading(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
  }

  const inputClass =
    "w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0a1929] border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Leave a suggestion</h2>
            <p className="text-xs text-slate-400 mt-0.5">We read every message — your feedback shapes the site.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors ml-4 shrink-0 mt-0.5"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#45c97a]/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#45c97a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold">Thanks for the feedback!</p>
            <p className="text-slate-400 text-sm mt-1">We appreciate you taking the time.</p>
            <button
              onClick={onClose}
              className="mt-5 text-sm text-[#45c97a] hover:underline font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ideas, feedback, providers you'd love to see…"
                rows={4}
                className="w-full text-sm bg-[#091624] border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#45c97a]/40 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send suggestion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

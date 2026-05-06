"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import SuggestionModal from "@/components/SuggestionModal";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  /** Show the suggestion button */
  showJoinUs?: boolean;
};

export default function PageHeader({ title, subtitle, backHref, backLabel, showJoinUs }: Props) {
  const { isLoggedIn, email, logout } = useAuth();
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  return (
    <header className="bg-[#0e1821] border-b border-white/10 px-4 py-8">
      <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
        <div className="min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-white/80 text-sm hover:text-white transition-colors mb-4"
            >
              ← {backLabel ?? "Back"}
            </Link>
          )}
          <div className="flex items-center gap-3">
            {title === "NewBi" ? (
              <img src="/logo-Transparent.png" alt="NewBi" className="h-10 shrink-0" />
            ) : (
              <>
                <Link href="/">
                  <img src="/logo-Transparent.png" alt="NewBi" className="h-8 shrink-0" />
                </Link>
                <h1 className="text-3xl font-black text-white">{title}</h1>
              </>
            )}
          </div>
          {subtitle && <p className="text-white/75 text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-1">
          {showJoinUs && (
            <button
              onClick={() => setSuggestionOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Leave a suggestion
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm hover:bg-white/30 transition-colors"
                title="My account"
              >
                {email?.[0]?.toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="text-white/80 text-sm hover:text-white transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white/80 text-sm font-medium hover:text-white transition-colors border border-white/30 px-3 py-1.5 rounded-lg hover:border-white/60"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      <SuggestionModal open={suggestionOpen} onClose={() => setSuggestionOpen(false)} />
    </header>
  );
}

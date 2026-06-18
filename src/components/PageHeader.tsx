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
  const { isLoggedIn, isAdmin, email, logout } = useAuth();
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  return (
    <header className="bg-[#FAF0E6] border-b border-[#2D1A1F]/10 px-4 py-8">
      <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
        <div className="min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-[#2D1A1F]/70 text-sm hover:text-[#2D1A1F] transition-colors mb-4"
            >
              ← {backLabel ?? "Back"}
            </Link>
          )}
          <div className="flex items-center gap-3">
            {title === "NewBi" ? (
              <span className="font-faunces font-bold text-4xl text-[#2D1A1F] tracking-tight leading-none">NewBi</span>
            ) : (
              <>
                <Link href="/" className="shrink-0">
                  <span className="font-faunces font-bold text-2xl text-[#2D1A1F] tracking-tight leading-none">NewBi</span>
                </Link>
                <h1 className="text-3xl font-black text-[#2D1A1F]">{title}</h1>
              </>
            )}
          </div>
          {subtitle && <p className="text-[#2D1A1F]/70 text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-1">
          {showJoinUs && (
            <button
              onClick={() => setSuggestionOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#C4909A] text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#A87580] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Leave a suggestion
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin/providers"
                  className="text-xs font-semibold text-[#A87580] bg-[#C4909A]/10 hover:bg-[#C4909A]/20 border border-[#C4909A]/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="w-8 h-8 rounded-full bg-[#C4909A]/20 flex items-center justify-center text-[#2D1A1F] font-bold text-sm hover:bg-[#C4909A]/30 transition-colors"
                title="My account"
              >
                {email?.[0]?.toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className="text-[#2D1A1F]/70 text-sm hover:text-[#2D1A1F] transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[#2D1A1F]/70 text-sm font-medium hover:text-[#2D1A1F] transition-colors border border-[#2D1A1F]/25 px-3 py-1.5 rounded-lg hover:border-[#2D1A1F]/50"
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

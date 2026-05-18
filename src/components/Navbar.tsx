"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import SuggestionModal from "@/components/SuggestionModal";

export default function Navbar() {
  const { loading, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="bg-[#FAF0E6] border-b border-[#2D1A1F]/10 px-4 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/" className="block">
            <span className="font-faunces font-bold text-3xl text-[#2D1A1F] tracking-tight leading-none">NewBi</span>
          </Link>
          <p className="text-[#2D1A1F]/70 text-sm mt-1">Find trusted services in Sheffield</p>
        </div>

        <div className="flex items-center gap-3">
          {!loading && isLoggedIn ? (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((o) => !o)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#2D1A1F]/20 hover:border-[#C4909A]/60 transition-colors focus:outline-none bg-[#F0D8DC] flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-[#9E7580]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 top-11 bg-[#FFF5F0] border border-[#2D1A1F]/10 rounded-xl shadow-xl py-1 w-44 z-50">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#2D1A1F] hover:bg-[#2D1A1F]/5 transition-colors"
                  >
                    My account
                  </Link>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-[#2D1A1F]/5 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : !loading ? (
            <Link
              href="/login"
              className="text-sm text-[#2D1A1F]/70 hover:text-[#2D1A1F] transition-colors"
            >
              Sign in
            </Link>
          ) : null}

          <button
            onClick={() => setSuggestionOpen(true)}
            className="flex items-center gap-2 bg-[#C4909A] text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#A87580] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Leave a suggestion
          </button>
          <SuggestionModal open={suggestionOpen} onClose={() => setSuggestionOpen(false)} />
        </div>
      </div>
    </header>
  );
}

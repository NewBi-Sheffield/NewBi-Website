"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export type AdminTab = "providers" | "applications" | "suggestions" | "contacts" | "shoutouts";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconProviders() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconApplications() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}


function IconSuggestions() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function IconContacts() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconShoutouts() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: { id: AdminTab; label: string; href: string; icon: React.ReactNode }[] = [
  { id: "providers",    label: "Providers",    href: "/admin/providers",    icon: <IconProviders /> },
  { id: "applications", label: "Applications", href: "/admin/applications", icon: <IconApplications /> },
  { id: "suggestions",  label: "Suggestions",  href: "/admin/suggestions",  icon: <IconSuggestions /> },
  { id: "contacts",     label: "Contacts",     href: "/admin/contacts",     icon: <IconContacts /> },
  { id: "shoutouts",   label: "Shoutouts",   href: "/admin/shoutouts",   icon: <IconShoutouts /> },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

type Props = {
  children: React.ReactNode;
  activeTab: AdminTab;
  headerRight?: React.ReactNode;
};

export default function AdminShell({ children, activeTab, headerRight }: Props) {
  const { loading: authLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) router.replace("/login?from=/admin");
    else if (!isAdmin) router.replace("/");
  }, [authLoading, isLoggedIn, isAdmin, router]);

  if (authLoading || !isLoggedIn || !isAdmin) return null;

  const title = NAV.find((n) => n.id === activeTab)?.label ?? "";

  return (
    <div className="min-h-screen bg-[#FAF0E6] flex">

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#FAF0E6] border-r border-[#2D1A1F]/8
          transition-[transform,width] duration-200
          md:static md:z-auto md:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopCollapsed ? "md:w-14" : "md:w-56"}
          w-56
        `}
      >
        {/* Logo */}
        <div className={`border-b border-[#2D1A1F]/8 flex items-center gap-2.5 ${desktopCollapsed ? "justify-center px-3 py-4" : "px-5 py-4"}`}>
          <Link href="/" onClick={() => setMobileSidebarOpen(false)} className="shrink-0">
            <img src="/Logo.png" alt="NewBi" className={desktopCollapsed ? "h-7 w-auto" : "h-9 w-auto"} />
          </Link>
          {!desktopCollapsed && (
            <span className="text-[10px] font-semibold tracking-widest text-[#B09098] uppercase">
              Admin
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-3 flex flex-col gap-0.5 ${desktopCollapsed ? "px-2" : "px-3"}`}>
          {NAV.map((item) => {
            const active = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                title={desktopCollapsed ? item.label : undefined}
                className={`
                  flex items-center gap-3 rounded-xl text-sm font-medium transition-colors
                  ${desktopCollapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${active
                    ? "bg-[#C4909A]/15 text-[#2D1A1F] border border-[#C4909A]/20"
                    : "text-[#9E7580] hover:text-[#2D1A1F] hover:bg-[#2D1A1F]/5"}
                `}
              >
                <span className={active ? "text-[#C4909A]" : ""}>{item.icon}</span>
                {!desktopCollapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-[#2D1A1F]/8 flex items-center gap-2 ${desktopCollapsed ? "justify-center px-2 py-3" : "justify-between px-4 py-3"}`}>
          {!desktopCollapsed && (
            <Link
              href="/"
              onClick={() => setMobileSidebarOpen(false)}
              className="text-xs text-[#B09098] hover:text-[#2D1A1F] transition-colors"
            >
              ← Back to site
            </Link>
          )}
          <button
            onClick={() => setDesktopCollapsed((v) => !v)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#B09098] hover:text-[#2D1A1F] hover:bg-[#2D1A1F]/5 transition-colors"
            title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={desktopCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#FAF0E6]/95 backdrop-blur-sm px-4 md:px-8 py-3 border-b border-[#2D1A1F]/8 flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-[#6B4550] hover:bg-[#2D1A1F]/5 transition-colors"
          >
            <IconMenu />
          </button>
          {/* Logo shown on mobile where sidebar is hidden */}
          <Link href="/" className="md:hidden shrink-0">
            <img src="/Logo.png" alt="NewBi" className="h-8 w-auto" />
          </Link>
          <h1 className="text-sm font-semibold text-[#2D1A1F] flex-1">{title}</h1>
          {headerRight}
        </header>

        <main className="flex-1 px-4 md:px-8 py-5 md:py-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

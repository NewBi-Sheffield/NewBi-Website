import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NewBi - Sheffield",
  description: "Find trusted local service providers in Sheffield, or list your business.",
};

const links = [
  {
    label: "Find Services in Sheffield",
    description: "Browse trusted local providers",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    external: false,
  },
  {
    label: "List Your Business",
    description: "Join NewBi as a provider",
    href: "/signup?type=provider",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" />
      </svg>
    ),
    external: false,
  },
  {
    label: "Follow us on Instagram",
    description: "@newbi.sheffield",
    href: "https://www.instagram.com/newbi.sheffield?igsh=MTlnaThpNG81cXQ2cw==",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    external: true,
  },
];

export default function LinkPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/Logo.png"
            alt="NewBi logo"
            width={80}
            height={80}
            className="rounded-2xl shadow-md"
            priority
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold" style={{ fontFamily: "'Faunces', Georgia, serif", color: "#2D1A1F" }}>
              NewBi
            </h1>
            <p className="text-sm mt-1" style={{ color: "#A87580" }}>
              Sheffield&apos;s local service directory
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 w-full rounded-2xl px-5 py-4 transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98] bg-brand-rose hover:bg-brand-rose-deep text-background"
              >
                <span className="shrink-0 opacity-90">{link.icon}</span>
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm leading-tight">{link.label}</span>
                  <span className="text-xs opacity-80 mt-0.5">{link.description}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 opacity-60 shrink-0">
                  <path d="M7 7h10v10" /><path d="M7 17 17 7" />
                </svg>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 w-full rounded-2xl px-5 py-4 transition-all duration-150 shadow-sm hover:shadow-md active:scale-[0.98] bg-brand-rose hover:bg-brand-rose-deep text-background"
              >
                <span className="shrink-0 opacity-90">{link.icon}</span>
                <span className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm leading-tight">{link.label}</span>
                  <span className="text-xs opacity-80 mt-0.5">{link.description}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 opacity-60 shrink-0">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            )
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-center" style={{ color: "#A87580" }}>
          newbi.co.uk
        </p>
      </div>
    </main>
  );
}

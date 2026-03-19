import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[#0e1821] border-b border-white/10 px-4 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <img src="/logo-Transparent.png" alt="NewBi" className="h-9 shrink-0" />
          </Link>
          <p className="text-white/75 text-sm mt-1">Find trusted services in Sheffield</p>
        </div>
        <Link
          href="/contact"
          className="flex items-center gap-2 bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Join Us
        </Link>
      </div>
    </header>
  );
}

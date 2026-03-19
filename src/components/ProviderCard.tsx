import Link from "next/link";
import { Provider, averageRating } from "@/lib/data";

type Props = {
  provider: Provider;
};

export default function ProviderCard({ provider }: Props) {
  const avg = averageRating(provider.reviews);
  const count = provider.reviews.length;

  return (
    <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-5 flex flex-col hover:border-[#45c97a]/30 transition-colors duration-200">
      {/* Name + rating row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-bold text-white leading-tight">{provider.name}</h2>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-yellow-400 text-base">★</span>
          <span className="text-sm font-semibold text-white">{avg.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({count})</span>
        </div>
      </div>

      {/* Category badge */}
      <span className="inline-block self-start text-xs font-medium text-[#45c97a] bg-[#45c97a]/10 px-2.5 py-0.5 rounded-full mb-3">
        {provider.category}
      </span>

      {/* Description */}
      <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">{provider.description}</p>

      {/* Contact info */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.2 3.6a1 1 0 01-.23 1.05l-1.5 1.5a16 16 0 006.66 6.66l1.5-1.5a1 1 0 011.05-.23l3.6 1.2A1 1 0 0121 17.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z" />
          </svg>
          <span>{provider.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{provider.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{provider.address}</span>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href={`/providers/${provider.id}`}
        className="block w-full text-center bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
      >
        View details
      </Link>
    </div>
  );
}

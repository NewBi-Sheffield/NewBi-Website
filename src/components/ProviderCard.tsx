import Link from "next/link";
import Image from "next/image";
import { Provider } from "@/lib/db";

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = {
  provider: Provider;
};

export default function ProviderCard({ provider }: Props) {
  return (
    <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-5 flex flex-col hover:border-[#C4909A]/40 transition-colors duration-200">
      {/* Profile picture */}
      <div className="flex justify-center mb-4">
        {provider.profile_picture_url ? (
          <Image
            src={provider.profile_picture_url}
            alt={provider.name}
            width={72}
            height={72}
            className="rounded-full object-cover border-2 border-[#2D1A1F]/10"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-[#F0D8DC] border-2 border-[#2D1A1F]/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#A87580]">
              {provider.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Name + rating row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-bold text-[#2D1A1F] leading-tight">{provider.name}</h2>
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {provider.categories.map((cat) => (
          <span key={cat} className="inline-block text-xs font-medium text-[#A87580] bg-[#C4909A]/10 px-2.5 py-0.5 rounded-full">
            {toTitleCase(cat)}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-[#2D1A1F]/70 line-clamp-3 mb-4 flex-1">{stripHtml(provider.description)}</p>

      {/* Contact info */}
      {(provider.phone || provider.email || provider.address || provider.website) && (
        <div className="flex flex-col gap-1.5 text-xs text-[#9E7580] mb-4">
          {provider.phone && (
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.2 3.6a1 1 0 01-.23 1.05l-1.5 1.5a16 16 0 006.66 6.66l1.5-1.5a1 1 0 011.05-.23l3.6 1.2A1 1 0 0121 17.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z" />
              </svg>
              <span>{provider.phone}</span>
            </div>
          )}
          {provider.email && (
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{provider.email}</span>
            </div>
          )}
          {provider.address && (
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{provider.address}</span>
            </div>
          )}
          {provider.website && (
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-[#B09098]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
              <a href={provider.website.startsWith("http") ? provider.website : `https://${provider.website}`} target="_blank" rel="noopener noreferrer" className="text-[#C4909A] hover:underline truncate">Visit website</a>
            </div>
          )}
        </div>
      )}

      {/* CTA button */}
      <Link
        href={`/providers/${provider.id}`}
        className="block w-full text-center bg-[#C4909A] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#A87580] active:scale-95 transition-all"
      >
        View details
      </Link>
    </div>
  );
}

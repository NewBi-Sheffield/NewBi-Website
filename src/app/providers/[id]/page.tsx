import { notFound } from "next/navigation";
import Image from "next/image";
import { getProvider, getProviderGallery } from "@/lib/db";

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
import PageHeader from "@/components/PageHeader";
import ReviewSection from "@/components/ReviewSection";
import ProviderGallery from "@/components/ProviderGallery";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProviderPage({ params }: Props) {
  const { id } = await params;
  const [provider, galleryItems] = await Promise.all([
    getProvider(id),
    getProviderGallery(id),
  ]);
  if (!provider) notFound();

  return (
    <>
      <PageHeader
        title={provider.name}
        backHref="/"
        backLabel="Back to all businesses"
      />

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: description + reviews */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Info card */}
          <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6">
            {/* Profile picture */}
            <div className="flex items-center gap-4 mb-4">
              {provider.profile_picture_url ? (
                <Image
                  src={provider.profile_picture_url}
                  alt={provider.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-[#2D1A1F]/10 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#F0D8DC] border-2 border-[#2D1A1F]/10 flex items-center justify-center shrink-0">
                  <span className="text-3xl font-bold text-[#A87580]">
                    {provider.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-[#2D1A1F]">{provider.name}</h1>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {provider.categories.map((cat) => (
                    <span key={cat} className="inline-block text-sm font-medium text-[#A87580] bg-[#C4909A]/10 px-3 py-1 rounded-full">
                      {toTitleCase(cat)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <span className="text-sm text-[#9E7580]">
                {provider.reviews.length} {provider.reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
            <div
              className="text-[#6B4550] leading-relaxed [&_p]:my-1 [&_a]:text-[#C4909A] [&_a]:underline [&_a]:hover:opacity-80 [&_strong]:text-[#2D1A1F] [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: provider.description }}
            />
          </div>

          {/* Gallery */}
          <ProviderGallery items={galleryItems} />

          {/* Reviews (client component handles auth + form) */}
          <ReviewSection providerId={provider.id} reviews={provider.reviews} />
        </div>

        {/* Right: contact sidebar */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6">
            <h2 className="text-xl font-bold text-[#2D1A1F] mb-5">Get in Touch</h2>

            <div className="flex flex-col gap-4">
              {provider.phone && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C4909A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.2 3.6a1 1 0 01-.23 1.05l-1.5 1.5a16 16 0 006.66 6.66l1.5-1.5a1 1 0 011.05-.23l3.6 1.2A1 1 0 0121 17.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#B09098] mb-0.5">Phone</p>
                    <a href={`tel:${provider.phone}`} className="text-[#C4909A] font-semibold hover:underline text-sm">
                      {provider.phone}
                    </a>
                  </div>
                </div>
              )}

              {provider.email && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C4909A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#B09098] mb-0.5">Email</p>
                    <a href={`mailto:${provider.email}`} className="text-[#C4909A] font-semibold hover:underline text-sm break-all">
                      {provider.email}
                    </a>
                  </div>
                </div>
              )}

              {provider.address && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C4909A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#B09098] mb-0.5">Location</p>
                    <p className="text-[#2D1A1F] font-semibold text-sm">{provider.address}</p>
                  </div>
                </div>
              )}

              {provider.website && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C4909A] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#B09098] mb-0.5">Website</p>
                    <a
                      href={provider.website.startsWith("http") ? provider.website : `https://${provider.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C4909A] font-semibold hover:underline text-sm"
                    >
                      Visit website
                    </a>
                  </div>
                </div>
              )}

              {provider.instagram && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#C4909A] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#B09098] mb-0.5">Instagram</p>
                    <a
                      href={provider.instagram.startsWith("http") ? provider.instagram : `https://instagram.com/${provider.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C4909A] font-semibold hover:underline text-sm break-all"
                    >
                      {provider.instagram.startsWith("http")
                        ? provider.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "")
                        : provider.instagram.startsWith("@") ? provider.instagram : `@${provider.instagram}`}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {(provider.instagram ?? provider.email) && (
              <a
                href={
                  provider.instagram
                    ? provider.instagram.startsWith("http")
                      ? provider.instagram
                      : `https://instagram.com/${provider.instagram.replace(/^@/, "")}`
                    : `mailto:${provider.email}`
                }
                target={provider.instagram ? "_blank" : undefined}
                rel={provider.instagram ? "noopener noreferrer" : undefined}
                className="mt-6 flex items-center justify-center gap-2 w-full bg-[#C4909A] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#A87580] active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {provider.instagram ? "Visit on Instagram" : "Send an email"}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

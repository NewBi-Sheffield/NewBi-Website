"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/db";

export default function ProviderGallery({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/10 p-6">
        <h2 className="text-base font-semibold text-[#2D1A1F] mb-4">Gallery</h2>
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#F0D8DC] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#C4909A]"
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 200px"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.type === "video" ? (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="w-full max-h-[90vh] rounded-xl"
              />
            ) : (
              <div className="relative w-full h-[85vh]">
                <Image
                  src={lightbox.url}
                  alt=""
                  fill
                  className="object-contain rounded-xl"
                  sizes="100vw"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/db";

interface Props {
  token: string;
}

export default function GalleryManager({ token }: Props) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/provider/gallery", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [token]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError(null);
    setUploading(true);

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/provider/gallery", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const body = await res.json();
      if (!res.ok) {
        setUploadError(body.error ?? "Upload failed");
        break;
      }
      setItems((prev) => [...prev, body as GalleryItem]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/provider/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    setDeletingId(null);
  }

  if (!loaded) {
    return <p className="text-sm text-[#B09098]">Loading gallery…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9E7580]">
          {items.length === 0
            ? "No media uploaded yet."
            : `${items.length} item${items.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#C4909A] px-3 py-1.5 rounded-xl hover:bg-[#A87580] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add media
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#F0D8DC] group">
              {item.type === "video" ? (
                <>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
                  sizes="200px"
                />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                aria-label="Delete"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 disabled:cursor-not-allowed"
              >
                {deletingId === item.id ? (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

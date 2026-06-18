"use client";

import { useState, useRef, KeyboardEvent } from "react";

const PRESET_CATEGORIES = [
  "Nails", "Lashes", "Brows", "Hair", "Makeup", "Skincare",
  "Beauty", "Aesthetics", "Massage", "Sports Massage",
  "Holistic", "Reflexology", "Wellness", "Hair Removal",
  "Waxing", "Tanning", "Tattoo", "Piercing", "Barber",
];
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import RichTextEditor from "@/components/RichTextEditor";

export type ProviderFormData = {
  name: string;
  categories: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  website: string;
  profile_picture_url: string | null;
};

type Props = {
  initialData?: Partial<ProviderFormData>;
  onSubmit: (data: ProviderFormData) => Promise<{ error: string | null }>;
  submitLabel: string;
  uploadUrl?: string;
};

function cropToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = objectUrl;
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

const inputClass =
  "w-full text-sm bg-[#FAF0E6] border border-[#2D1A1F]/10 text-[#2D1A1F] placeholder-[#B09098] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C4909A]/40 focus:border-transparent";
const labelClass = "block text-xs font-semibold text-[#6B4550] mb-1";

export default function ProviderForm({ initialData = {}, onSubmit, submitLabel, uploadUrl = "/api/admin/upload" }: Props) {
  const [form, setForm] = useState<ProviderFormData>({
    name: initialData.name ?? "",
    categories: initialData.categories ?? [],
    description: initialData.description ?? "",
    address: initialData.address ?? "",
    phone: initialData.phone ?? "",
    email: initialData.email ?? "",
    instagram: initialData.instagram ?? "",
    website: initialData.website ?? "",
    profile_picture_url: initialData.profile_picture_url ?? null,
  });

  const [catInput, setCatInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profile_picture_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof ProviderFormData, value: string | null) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addCategory(value: string) {
    const trimmed = value.trim();
    if (!trimmed || form.categories.includes(trimmed)) return;
    setForm((f) => ({ ...f, categories: [...f.categories, trimmed] }));
  }

  function removeCategory(cat: string) {
    setForm((f) => ({ ...f, categories: f.categories.filter((c) => c !== cat) }));
  }

  function handleCatKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(catInput);
      setCatInput("");
    } else if (e.key === "Backspace" && catInput === "" && form.categories.length > 0) {
      removeCategory(form.categories[form.categories.length - 1]);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await cropToSquareDataUrl(file);
    setImageDataUrl(dataUrl);
    setImagePreview(dataUrl);
  }

  function handleRemoveImage() {
    setImageDataUrl(null);
    setImagePreview(null);
    set("profile_picture_url", null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Commit any unfinished category text on submit
    const finalCategories = [...form.categories];
    if (catInput.trim() && !form.categories.includes(catInput.trim())) {
      finalCategories.push(catInput.trim());
    }

    if (finalCategories.length === 0) {
      setError("At least one category is required");
      return;
    }

    setLoading(true);
    let profile_picture_url = form.profile_picture_url;

    if (imageDataUrl) {
      const { data: { session } } = await supabase.auth.getSession();
      const fd = new FormData();
      fd.append("file", dataUrlToBlob(imageDataUrl), "photo.jpg");
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: fd,
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Image upload failed");
        setLoading(false);
        return;
      }
      profile_picture_url = body.url;
    }

    const { error } = await onSubmit({ ...form, categories: finalCategories, website: form.website, profile_picture_url });
    setLoading(false);
    if (error) setError(error);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Profile picture */}
      <div>
        <label className={labelClass}>Profile picture</label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-[#2D1A1F]/10 shrink-0"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#F0D8DC] border-2 border-[#2D1A1F]/10 flex items-center justify-center shrink-0">
              <span className="text-[#B09098] text-xs">No image</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs bg-[#F0D8DC] text-[#6B4550] px-3 py-1.5 rounded-lg hover:bg-[#E8C5CC] transition-colors"
            >
              Choose image
            </button>
            {imagePreview && (
              <button type="button" onClick={handleRemoveImage} className="text-xs text-red-400 hover:text-red-300">
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Business name"
          className={inputClass}
        />
      </div>

      {/* Categories — preset pills + custom */}
      <div>
        <label className={labelClass}>Categories *</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {PRESET_CATEGORIES.map((cat) => {
            const selected = form.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => selected ? removeCategory(cat) : addCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  selected
                    ? "bg-[#C4909A] text-white border-[#C4909A]"
                    : "bg-transparent text-[#6B4550] border-[#2D1A1F]/20 hover:border-[#C4909A] hover:text-[#C4909A]"
                }`}
              >
                {selected && "✓ "}{cat}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowCustomInput((v) => !v)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border border-dashed transition-colors ${
              showCustomInput
                ? "border-[#C4909A] text-[#C4909A]"
                : "border-[#2D1A1F]/20 text-[#9E7580] hover:border-[#C4909A] hover:text-[#C4909A]"
            }`}
          >
            + Custom
          </button>
        </div>

        {/* Custom input */}
        {showCustomInput && (
          <div className="flex gap-2 mt-2">
            <input
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={handleCatKeyDown}
              placeholder="Enter custom category…"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={() => { addCategory(catInput); setCatInput(""); }}
              className="shrink-0 text-xs bg-[#F0D8DC] text-[#6B4550] px-3 py-1.5 rounded-lg hover:bg-[#E8C5CC] transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {/* Custom-added tags (not in presets) */}
        {form.categories.filter((c) => !PRESET_CATEGORIES.includes(c)).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.categories.filter((c) => !PRESET_CATEGORIES.includes(c)).map((cat) => (
              <span key={cat} className="flex items-center gap-1 bg-[#C4909A]/15 text-[#A87580] text-xs font-medium px-2.5 py-1 rounded-full">
                {cat}
                <button type="button" onClick={() => removeCategory(cat)} className="hover:text-[#2D1A1F] leading-none ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <RichTextEditor
          value={form.description}
          onChange={(html) => setForm((f) => ({ ...f, description: html }))}
        />
        <p className="text-xs text-slate-500 mt-1">Select text then click Link to add a hyperlink.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+44 7700 000000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="hello@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Website</label>
          <input
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input
            value={form.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="@handle or full URL"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="123 Main St, London"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-[#C4909A] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#A87580] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

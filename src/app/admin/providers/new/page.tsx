"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import ProviderForm, { type ProviderFormData } from "@/app/admin/_components/ProviderForm";

export default function NewProviderPage() {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) router.replace("/login?from=/admin");
    else if (isLoggedIn && !isAdmin) router.replace("/");
  }, [isLoggedIn, isAdmin, router]);

  if (!isLoggedIn || !isAdmin) return null;

  async function handleSubmit(data: ProviderFormData): Promise<{ error: string | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/admin/providers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? "Failed to create provider" };
    router.push("/admin");
    return { error: null };
  }

  return (
    <>
      <PageHeader title="Add provider" backHref="/admin" backLabel="Back to admin" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-[#FFF5F0] rounded-2xl border border-[#2D1A1F]/8 p-6">
          <ProviderForm onSubmit={handleSubmit} submitLabel="Create provider" />
        </div>
      </main>
    </>
  );
}

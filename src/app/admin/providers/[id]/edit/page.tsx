"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getProvider, type Provider } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ProviderForm, { type ProviderFormData } from "@/app/admin/_components/ProviderForm";

type Props = { params: Promise<{ id: string }> };

export default function EditProviderPage({ params }: Props) {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) router.replace("/login?from=/admin");
    else if (isLoggedIn && !isAdmin) router.replace("/");
  }, [isLoggedIn, isAdmin, router]);

  useEffect(() => {
    params.then(({ id }) => {
      setProviderId(id);
      getProvider(id).then((p) => {
        if (!p) setNotFound(true);
        else setProvider(p);
      });
    });
  }, [params]);

  if (!isLoggedIn || !isAdmin) return null;
  if (notFound) return <p className="text-center py-16 text-slate-400">Provider not found.</p>;
  if (!provider) return <p className="text-center py-16 text-slate-400">Loading…</p>;

  async function handleSubmit(data: ProviderFormData): Promise<{ error: string | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${providerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? "Failed to update provider" };
    router.push("/admin");
    return { error: null };
  }

  return (
    <>
      <PageHeader title={`Edit: ${provider.name}`} backHref="/admin" backLabel="Back to admin" />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
          <ProviderForm
            initialData={{
              name: provider.name,
              categories: provider.categories,
              description: provider.description,
              address: provider.address ?? "",
              phone: provider.phone ?? "",
              email: provider.email ?? "",
              instagram: provider.instagram ?? "",
              website: provider.website ?? "",
              profile_picture_url: provider.profile_picture_url,
            }}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </div>
      </main>
    </>
  );
}

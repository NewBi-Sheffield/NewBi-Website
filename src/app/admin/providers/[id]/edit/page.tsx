"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { type Provider } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ProviderForm, { type ProviderFormData } from "@/app/admin/_components/ProviderForm";

function InviteSection({ providerId }: { providerId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateLink() {
    setError(null);
    setLink(null);
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${providerId}/invite`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    const body = await res.json();
    setLoading(false);
    if (!res.ok) { setError(body.error); return; }
    setLink(body.link);
    setProviderName(body.providerName);
  }

  async function copy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-[#0f2236] rounded-2xl border border-white/10 p-6">
      <h2 className="text-sm font-semibold text-white mb-1">Send invite link</h2>
      <p className="text-xs text-slate-400 mb-4">
        Generates a one-time link you can DM the provider on Instagram. They'll be prompted to set their name and password.
      </p>
      {!link ? (
        <button
          onClick={generateLink}
          disabled={loading}
          className="bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Generating…" : "Generate invite link"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-400">Invite for <span className="text-white">{providerName}</span> — expires in 7 days or after first use.</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 text-xs bg-[#091624] border border-white/10 text-slate-300 rounded-xl px-3 py-2 truncate"
            />
            <button
              onClick={copy}
              className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button onClick={generateLink} disabled={loading} className="text-xs text-slate-400 hover:text-white underline text-left w-fit transition-colors">
            Regenerate
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg mt-3">{error}</p>}
    </div>
  );
}

type Props = { params: Promise<{ id: string }> };

export default function EditProviderPage({ params }: Props) {
  const { loading: authLoading, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [approving, setApproving] = useState(false);
  const [unlisting, setUnlisting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) router.replace("/login?from=/admin");
    else if (!isAdmin) router.replace("/");
  }, [authLoading, isLoggedIn, isAdmin, router]);

  useEffect(() => {
    params.then(async ({ id }) => {
      setProviderId(id);
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/providers/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) { setNotFound(true); return; }
      setProvider(await res.json());
    });
  }, [params]);

  if (!isLoggedIn || !isAdmin) return null;
  if (notFound) return <p className="text-center py-16 text-slate-400">Provider not found.</p>;
  if (!provider) return <p className="text-center py-16 text-slate-400">Loading…</p>;

  async function handleSubmit(data: ProviderFormData): Promise<{ error: string | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${providerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) return { error: body.error ?? "Failed to update provider" };
    router.push("/admin");
    return { error: null };
  }

  async function handleApprove() {
    setApproving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/admin/providers/${providerId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    setApproving(false);
    if (res.ok) router.push("/admin");
  }

  async function handleUnlist() {
    if (!confirm(`Unlist "${provider?.name}"? They'll be hidden from the site but their account will remain.`)) return;
    setUnlisting(true);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/admin/providers/${providerId}/unlist`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    router.push("/admin");
  }

  async function handleRelist() {
    setApproving(true);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/admin/providers/${providerId}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    router.push("/admin");
  }

  async function handleDelete() {
    if (!confirm(`Permanently delete "${provider?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/admin/providers/${providerId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    router.push("/admin");
  }

  const isPending = provider.status === "pending";
  const isUnlisted = provider.status === "unlisted";
  const isUnlinked = !provider.user_id;

  return (
    <>
      <PageHeader title={`Edit: ${provider.name}`} backHref="/admin" backLabel="Back to admin" />
      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Approve banner for pending self-signups */}
        {isPending && (
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-300">Pending approval</p>
              <p className="text-xs text-amber-400/80 mt-0.5">Review the details below, then approve to make this listing live.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleApprove}
                disabled={approving}
                className="bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {approving ? "Approving…" : "Approve listing"}
              </button>
              <button onClick={handleDelete} disabled={deleting} className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                {deleting ? "Deleting…" : "Reject"}
              </button>
            </div>
          </div>
        )}

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

        {/* Invite link for admin-created providers without an account */}
        {isUnlinked && providerId && <InviteSection providerId={providerId} />}

        {/* Unlisted banner */}
        {isUnlisted && (
          <div className="bg-slate-500/10 border border-slate-500/25 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-300">Currently unlisted</p>
              <p className="text-xs text-slate-400 mt-0.5">This provider is hidden from the site. Relist to make them visible again.</p>
            </div>
            <button
              onClick={handleRelist}
              disabled={approving}
              className="shrink-0 bg-gradient-to-r from-[#45c97a] to-[#3d88c4] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {approving ? "Relisting…" : "Relist"}
            </button>
          </div>
        )}

        {/* Danger zone — not shown for pending applications (use Reject there instead) */}
        {!isPending && (
          <div className="bg-[#0f2236] rounded-2xl border border-red-900/30 p-5">
            <p className="text-xs font-semibold text-red-400 mb-3">Danger zone</p>
            <div className="flex flex-wrap gap-3">
              {!isUnlisted && (
                <button
                  onClick={handleUnlist}
                  disabled={unlisting}
                  className="text-sm text-slate-300 border border-white/15 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  {unlisting ? "Unlisting…" : "Unlist provider"}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-red-400 border border-red-900/50 px-4 py-2 rounded-xl hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
            {!isUnlisted && (
              <p className="text-xs text-slate-500 mt-3">Unlisting hides them from the site without deleting their account. Delete permanently removes all data.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}

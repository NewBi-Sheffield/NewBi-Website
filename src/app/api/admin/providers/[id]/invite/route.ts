import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/app/api/admin/_auth";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminUser(req);
  if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: provider, error: fetchError } = await adminSupabase
    .from("providers")
    .select("name")
    .eq("id", id)
    .single();

  if (fetchError || !provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });

  // Invalidate any existing unused tokens for this provider first
  await adminSupabase
    .from("provider_invites")
    .delete()
    .eq("provider_id", id)
    .is("used_at", null);

  const { data: invite, error: insertError } = await adminSupabase
    .from("provider_invites")
    .insert({ provider_id: id })
    .select("token")
    .single();

  if (insertError || !invite) return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/provider/onboarding?token=${invite.token}`;

  return NextResponse.json({ link, providerName: provider.name });
}

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/app/api/admin/_auth";
import { sendListingApproved } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbi.co.uk";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data: provider, error: fetchError } = await adminSupabase
    .from("providers")
    .select("name, email, user_id")
    .eq("id", id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const { error } = await adminSupabase
    .from("providers")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch the owner's display name from profiles
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("name")
    .eq("id", provider.user_id)
    .single();

  sendListingApproved({
    name: profile?.name ?? provider.name,
    email: provider.email,
    businessName: provider.name,
    listingUrl: `${SITE_URL}/providers/${id}`,
  }).catch(console.error);

  return NextResponse.json({ ok: true });
}

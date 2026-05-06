import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getValidInvite(token: string) {
  const { data, error } = await adminSupabase
    .from("provider_invites")
    .select("token, provider_id, expires_at, used_at, providers(id, name, profile_picture_url)")
    .eq("token", token)
    .single();

  if (error || !data) return null;
  if (data.used_at) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  return data;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getValidInvite(token);
  if (!invite) return NextResponse.json({ error: "This invite link is invalid or has expired." }, { status: 400 });

  const provider = Array.isArray(invite.providers) ? invite.providers[0] : invite.providers;
  const p = provider as { name: string; profile_picture_url: string | null };
  return NextResponse.json({ providerName: p.name, profilePictureUrl: p.profile_picture_url });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await getValidInvite(token);
  if (!invite) return NextResponse.json({ error: "This invite link is invalid or has expired." }, { status: 400 });

  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

  const { data: created, error: createError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (createError) return NextResponse.json({ error: createError.message }, { status: 400 });

  const userId = created.user.id;

  await Promise.all([
    adminSupabase
      .from("providers")
      .update({ user_id: userId })
      .eq("id", invite.provider_id),
    adminSupabase
      .from("profiles")
      .upsert({ id: userId, email, display_name: name }, { onConflict: "id" }),
    adminSupabase
      .from("provider_invites")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token),
  ]);

  return NextResponse.json({ ok: true, providerId: invite.provider_id });
}

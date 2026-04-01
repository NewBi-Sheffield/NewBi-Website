import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getAdminUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await anonSupabase.auth.getUser(token);
  if (!user?.user_metadata?.is_admin) return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { name, categories, description, address, phone, email, instagram, website, profile_picture_url } = await req.json();

  const { error } = await adminSupabase
    .from("providers")
    .update({
      name,
      categories,
      description: description || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      instagram: instagram || null,
      website: website || null,
      profile_picture_url: profile_picture_url || null,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { error } = await adminSupabase
    .from("providers")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

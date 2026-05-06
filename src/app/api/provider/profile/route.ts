import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getProviderUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await anonSupabase.auth.getUser(token);
  return user ?? null;
}

export async function GET(req: NextRequest) {
  const user = await getProviderUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await adminSupabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "No provider found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const user = await getProviderUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

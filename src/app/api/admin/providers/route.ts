import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/app/api/admin/_auth";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await adminSupabase
    .from("providers")
    .select("*, reviews(*)")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const providers = (data ?? []).map((p) => ({
    ...p,
    categories: p.categories ?? [],
    reviews: p.reviews ?? [],
    status: p.status ?? "approved",
  }));

  return NextResponse.json(providers);
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, categories, description, address, phone, email, instagram, website, profile_picture_url } = await req.json();

  if (!name || !categories?.length) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const { data, error } = await adminSupabase
    .from("provider_profiles")
    .insert({
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
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

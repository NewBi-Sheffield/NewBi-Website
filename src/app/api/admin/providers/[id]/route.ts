import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/app/api/admin/_auth";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const { data, error } = await adminSupabase
    .from("providers")
    .select("*, reviews(*)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...data,
    categories: data.categories ?? [],
    reviews: data.reviews ?? [],
    status: data.status ?? "approved",
  });
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

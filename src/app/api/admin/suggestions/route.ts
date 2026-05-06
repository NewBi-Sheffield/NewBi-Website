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

export async function GET(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await adminSupabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const { error } = await adminSupabase.from("suggestions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

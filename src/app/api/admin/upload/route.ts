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

export async function POST(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await adminSupabase.storage
    .from("provider-images")
    .upload(filename, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = adminSupabase.storage
    .from("provider-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}

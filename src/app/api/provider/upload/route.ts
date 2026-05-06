import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await anonSupabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify this user owns a provider
  const { data: provider } = await adminSupabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

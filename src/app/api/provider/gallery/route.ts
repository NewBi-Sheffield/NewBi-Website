import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function getAuthenticatedProvider(token: string) {
  const { data: { user } } = await anonSupabase.auth.getUser(token);
  if (!user) return null;
  const { data: provider } = await adminSupabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();
  return provider ?? null;
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const provider = await getAuthenticatedProvider(token);
  if (!provider) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await adminSupabase
    .from("provider_gallery")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const provider = await getAuthenticatedProvider(token);
  if (!provider) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: "Only images and videos are allowed" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const filename = `gallery/${provider.id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await adminSupabase.storage
    .from("provider-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = adminSupabase.storage
    .from("provider-images")
    .getPublicUrl(filename);

  const { data: item, error: dbError } = await adminSupabase
    .from("provider_gallery")
    .insert({ provider_id: provider.id, url: publicUrl, type: isVideo ? "video" : "image" })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json(item, { status: 201 });
}

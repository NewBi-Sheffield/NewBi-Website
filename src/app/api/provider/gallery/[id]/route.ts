import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await anonSupabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify the gallery item belongs to this user's provider
  const { data: item } = await adminSupabase
    .from("provider_gallery")
    .select("id, url, providers!inner(user_id)")
    .eq("id", id)
    .single();

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const provider = item.providers as { user_id: string } | null;
  if (!provider || provider.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Extract storage path from URL
  const storageBase = `${url}/storage/v1/object/public/provider-images/`;
  const storagePath = item.url.startsWith(storageBase)
    ? item.url.slice(storageBase.length)
    : null;

  if (storagePath) {
    await adminSupabase.storage.from("provider-images").remove([storagePath]);
  }

  await adminSupabase.from("provider_gallery").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}

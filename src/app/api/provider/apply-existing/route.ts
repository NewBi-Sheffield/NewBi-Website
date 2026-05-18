import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationReceived } from "@/lib/email";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonSupabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const adminSupabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });

  const { data: { user } } = await anonSupabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });

  const { data: existing } = await adminSupabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ error: "You already have a provider account." }, { status: 409 });

  const {
    name, categories, description, address, phone, email,
    instagram, website, profilePictureBase64, profilePictureMime,
  } = await req.json();

  if (!name?.trim() || !categories?.length) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  let profilePictureUrl: string | null = null;
  if (profilePictureBase64 && profilePictureMime) {
    try {
      const buffer = Buffer.from(profilePictureBase64, "base64");
      const ext = profilePictureMime.split("/")[1] ?? "jpg";
      const filename = `profile-${user.id}.${ext}`;
      const { error: imgError } = await adminSupabase.storage
        .from("provider-images")
        .upload(filename, buffer, { contentType: profilePictureMime, upsert: true });
      if (!imgError) {
        profilePictureUrl = adminSupabase.storage.from("provider-images").getPublicUrl(filename).data.publicUrl;
      }
    } catch {
      // non-fatal
    }
  }

  const finalEmail = email?.trim() || user.email!;

  const { error: providerError } = await adminSupabase
    .from("providers")
    .insert({
      name: name.trim(),
      categories,
      description: description?.trim() || null,
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: finalEmail,
      instagram: instagram?.trim() || null,
      website: website?.trim() || null,
      user_id: user.id,
      status: "pending",
      profile_picture_url: profilePictureUrl,
    });

  if (providerError) {
    return NextResponse.json({ error: "We couldn't save your business details. Please try again." }, { status: 500 });
  }

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  sendApplicationReceived({
    name: profile?.name ?? name.trim(),
    email: finalEmail,
    businessName: name.trim(),
  }).catch(console.error);

  return NextResponse.json({ ok: true });
}

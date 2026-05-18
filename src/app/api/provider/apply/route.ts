import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationConfirmation } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "There's already an account with that email address. Try signing in instead.";
  }
  if (lower.includes("invalid email")) {
    return "That doesn't look like a valid email address.";
  }
  if (lower.includes("password")) {
    return "Your password needs to be at least 6 characters.";
  }
  return "We couldn't create your account. Please check your details and try again.";
}

export async function POST(req: NextRequest) {
  const {
    name, categories, description, address, phone, email,
    instagram, website, accountName, password,
    profilePictureBase64, profilePictureMime,
  } = await req.json();

  if (!name?.trim() || !categories?.length || !email?.trim() || !accountName?.trim() || !password) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Your password needs to be at least 6 characters." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: "signup",
    email: email.trim(),
    password,
    options: {
      data: { full_name: accountName.trim() },
      redirectTo: `${siteUrl}/account`,
    },
  });

  if (linkError) {
    return NextResponse.json({ error: friendlyAuthError(linkError.message) }, { status: 400 });
  }

  const userId = linkData.user.id;
  const confirmationUrl = linkData.properties.action_link;

  // Upload profile picture if provided
  let profilePictureUrl: string | null = null;
  if (profilePictureBase64 && profilePictureMime) {
    try {
      const buffer = Buffer.from(profilePictureBase64, "base64");
      const ext = profilePictureMime.split("/")[1] ?? "jpg";
      const filename = `profile-${userId}.${ext}`;
      const { error: imgError } = await adminSupabase.storage
        .from("provider-images")
        .upload(filename, buffer, { contentType: profilePictureMime, upsert: true });
      if (!imgError) {
        const { data: { publicUrl } } = adminSupabase.storage
          .from("provider-images")
          .getPublicUrl(filename);
        profilePictureUrl = publicUrl;
      }
    } catch {
      // Profile picture upload failure is non-fatal
    }
  }

  const { data: provider, error: providerError } = await adminSupabase
    .from("providers")
    .insert({
      name: name.trim(),
      categories,
      description: description?.trim() || null,
      address: address?.trim() || null,
      phone: phone?.trim() || null,
      email: email.trim(),
      instagram: instagram?.trim() || null,
      website: website?.trim() || null,
      user_id: userId,
      status: "unconfirmed",
      profile_picture_url: profilePictureUrl,
    })
    .select("id")
    .single();

  if (providerError) {
    await adminSupabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "We couldn't save your business details. Please try again." }, { status: 500 });
  }

  await adminSupabase
    .from("profiles")
    .upsert({ id: userId, email: email.trim(), name: accountName.trim() }, { onConflict: "id" });

  sendApplicationConfirmation({
    name: accountName.trim(),
    email: email.trim(),
    businessName: name.trim(),
    confirmationUrl,
  }).then(() => console.log("[email] confirmation sent to", email.trim()))
    .catch((err) => console.error("[email] failed to send confirmation:", err));

  return NextResponse.json({ ok: true, providerId: provider.id });
}

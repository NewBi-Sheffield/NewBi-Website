import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationConfirmation } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const {
    name, categories, description, address, phone, email,
    instagram, website, accountName, password,
  } = await req.json();

  if (!name?.trim() || !categories?.length || !email?.trim() || !accountName?.trim() || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  // Create user and generate a confirmation link in one step.
  // The user starts unconfirmed and cannot sign in until they click the link.
  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: "signup",
    email: email.trim(),
    password,
    options: {
      data: { full_name: accountName.trim() },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    },
  });

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 400 });

  const userId = linkData.user.id;
  const confirmationUrl = linkData.properties.action_link;

  // Create provider profile with pending status
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
      status: "pending",
    })
    .select("id")
    .single();

  if (providerError) {
    await adminSupabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: providerError.message }, { status: 500 });
  }

  await adminSupabase
    .from("profiles")
    .upsert({ id: userId, email: email.trim(), display_name: accountName.trim() }, { onConflict: "id" });

  sendApplicationConfirmation({
    name: accountName.trim(),
    email: email.trim(),
    businessName: name.trim(),
    confirmationUrl,
  }).catch(console.error);

  return NextResponse.json({ ok: true, providerId: provider.id });
}

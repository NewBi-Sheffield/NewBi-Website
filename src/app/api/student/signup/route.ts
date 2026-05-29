import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendStudentConfirmation } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email?.trim() || !password || !name?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbi.co.uk";

  const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: "signup",
    email: email.trim(),
    password,
    options: {
      data: { full_name: name.trim() },
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (linkError) {
    const msg = linkError.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists")) {
      return NextResponse.json(
        { error: "An account with that email already exists. Try signing in instead." },
        { status: 400 }
      );
    }
    if (msg.includes("invalid email")) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "We couldn't create your account. Please check your details and try again." },
      { status: 400 }
    );
  }

  await adminSupabase
    .from("profiles")
    .upsert({ id: linkData.user.id, email: email.trim(), name: name.trim() }, { onConflict: "id" });

  try {
    await sendStudentConfirmation({
      name: name.trim(),
      email: email.trim(),
      confirmationUrl: linkData.properties.action_link,
    });
  } catch (err) {
    console.error("[email] failed to send student confirmation:", err);
  }

  return NextResponse.json({ ok: true });
}

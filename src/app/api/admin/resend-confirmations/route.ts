import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/app/api/admin/_auth";
import { sendApplicationConfirmation } from "@/lib/email";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbi.co.uk";

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: providers, error } = await adminSupabase
    .from("providers")
    .select("id, name, email, user_id")
    .eq("status", "unconfirmed");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!providers?.length) return NextResponse.json({ sent: 0, results: [] });

  const results = await Promise.allSettled(
    providers.map(async (provider) => {
      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("name")
        .eq("id", provider.user_id)
        .single();

      const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
        type: "signup",
        email: provider.email,
        options: { redirectTo: `${siteUrl}/account` },
      });

      if (linkError) throw new Error(`Link generation failed: ${linkError.message}`);

      await sendApplicationConfirmation({
        name: profile?.name ?? provider.name,
        email: provider.email,
        businessName: provider.name,
        confirmationUrl: linkData.properties.action_link,
      });

      return { email: provider.email, business: provider.name };
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").map((r) => (r as PromiseFulfilledResult<{ email: string; business: string }>).value);
  const failed = results.filter((r) => r.status === "rejected").map((r, i) => ({ provider: providers[i].email, reason: (r as PromiseRejectedResult).reason?.message }));

  return NextResponse.json({ sent: sent.length, succeeded: sent, failed });
}

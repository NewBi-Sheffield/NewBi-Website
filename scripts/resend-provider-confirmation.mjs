/**
 * One-off script to resend the confirmation email for a provider whose email
 * was not sent during signup (e.g. due to missing RESEND_API_KEY in prod).
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/resend-provider-confirmation.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const PROVIDER_ID = "0102ceec-6aeb-4d1a-990b-387c2afeeee1";
const USER_ID = "a73995c0-2c4a-4df9-9147-e28938850b0b";
const SITE_URL = "https://newbi.co.uk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://wbfpfgkpwxkqzarjtdwg.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const { data: provider } = await supabase
  .from("providers")
  .select("name, email")
  .eq("id", PROVIDER_ID)
  .single();

if (!provider) {
  console.error("Provider not found");
  process.exit(1);
}

console.log(`Generating confirmation link for ${provider.email}...`);

const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
  type: "signup",
  email: provider.email,
  options: { redirectTo: `${SITE_URL}/account` },
});

if (linkError) {
  console.error("Failed to generate link:", linkError.message);
  process.exit(1);
}

const confirmationUrl = linkData.properties.action_link;
console.log("Confirmation URL:", confirmationUrl);

const accountName = linkData.user.user_metadata?.full_name ?? provider.name;

const { data, error } = await resend.emails.send({
  from: "NewBi <hello@newbi.co.uk>",
  to: provider.email,
  subject: "Confirm your email to complete your NewBi application",
  html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#FAF0E6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF0E6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFF5F0;border-radius:16px;border:1px solid rgba(44,26,31,0.10);overflow:hidden;">
        <tr><td style="padding:32px 32px 24px;border-bottom:1px solid rgba(44,26,31,0.08);">
          <img src="${SITE_URL}/Logo.png" alt="NewBi" height="32" style="display:block;" />
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#2D1A1F;">Confirm your email address</p>
          <p style="margin:0 0 24px;font-size:14px;color:#9E7580;line-height:1.6;">
            Hi ${accountName}, thanks for applying to list <strong style="color:#2D1A1F;">${provider.name}</strong> on NewBi.
            Click the button below to confirm your email and submit your application for review.
          </p>
          <a href="${confirmationUrl}" style="display:inline-block;background:#C4909A;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:10px;">
            Confirm email address
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#B09098;line-height:1.6;">
            Once confirmed, our team will review your listing. This link expires in 24 hours.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(44,26,31,0.08);">
          <p style="margin:0;font-size:12px;color:#B09098;">
            You're receiving this because you applied to list your business on
            <a href="${SITE_URL}" style="color:#C4909A;text-decoration:none;">NewBi</a>.
            If this wasn't you, you can safely ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
});

if (error) {
  console.error("Resend error:", JSON.stringify(error, null, 2));
  process.exit(1);
}

console.log("Email sent successfully. Resend ID:", data.id);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbi.co.uk";

export function studentConfirmationHtml({
  name,
  confirmationUrl,
}: {
  name: string;
  confirmationUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F5E8EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5E8EA;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FFFAF8;border-radius:16px;border:1px solid rgba(44,26,31,0.10);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid rgba(44,26,31,0.08);">
            <img src="${SITE_URL}/Logo.png" alt="Newbi" height="32" style="display:block;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#2D1A1F;">Confirm your email address</p>
            <p style="margin:0 0 24px;font-size:14px;color:#9E7580;line-height:1.6;">
              Hi ${name}, welcome to Newbi! Click the button below to confirm your email and activate your account.
            </p>
            <a href="${confirmationUrl}"
               style="display:inline-block;background:#C4909A;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:10px;">
              Confirm email address
            </a>
            <p style="margin:24px 0 0;font-size:13px;color:#B09098;line-height:1.6;">
              This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(44,26,31,0.08);">
            <p style="margin:0;font-size:12px;color:#B09098;">
              You're receiving this because you signed up at
              <a href="${SITE_URL}" style="color:#C4909A;text-decoration:none;">Newbi</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

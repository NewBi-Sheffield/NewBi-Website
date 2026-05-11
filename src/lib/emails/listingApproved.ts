const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbi.co.uk";

export function listingApprovedHtml({
  name,
  businessName,
  listingUrl,
}: {
  name: string;
  businessName: string;
  listingUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#080f18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080f18;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#0a1929;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <img src="${SITE_URL}/logo-Transparent.png" alt="Newbi" height="28" style="display:block;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#ffffff;">You're live on Newbi!</p>
            <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;">
              Hi ${name}, great news — <strong style="color:#e2e8f0;">${businessName}</strong> has been approved and your listing is now live on Newbi. Customers can find and book you right now.
            </p>
            <a href="${listingUrl}"
               style="display:inline-block;background:linear-gradient(to right,#45c97a,#3d88c4);color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:10px;">
              View your listing
            </a>
            <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">
              You can update your details and manage your listing at any time from your
              <a href="${SITE_URL}/account" style="color:#45c97a;text-decoration:none;">account page</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:12px;color:#475569;">
              You're receiving this because your business is listed on
              <a href="${SITE_URL}" style="color:#45c97a;text-decoration:none;">Newbi</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

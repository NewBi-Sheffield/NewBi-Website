import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error_description');

  if (error || !code) {
    return NextResponse.redirect(
      `newbimobile://oauth/instagram?error=${encodeURIComponent(error ?? 'auth_failed')}`
    );
  }

  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_CLIENT_ID!,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    redirect_uri: 'https://newbi.co.uk/api/instagram/callback',
    code,
  });

  let tokenData;
  try {
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: params,
    });
    tokenData = await tokenRes.json();
  } catch {
    return NextResponse.redirect(
      `newbimobile://oauth/instagram?error=${encodeURIComponent('token_request_failed')}`
    );
  }

  if (tokenData.error_message) {
    return NextResponse.redirect(
      `newbimobile://oauth/instagram?error=${encodeURIComponent(tokenData.error_message)}`
    );
  }

  // Exchange for a long-lived token (60 days instead of 1 hour)
  let token = tokenData.access_token;
  try {
    const longLivedRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`
    );
    const longLivedData = await longLivedRes.json();
    token = longLivedData.access_token ?? tokenData.access_token;
  } catch {
    // fall back to the short-lived token rather than failing the whole flow
  }

  return NextResponse.redirect(
    `newbimobile://oauth/instagram?token=${encodeURIComponent(token)}`
  );
}

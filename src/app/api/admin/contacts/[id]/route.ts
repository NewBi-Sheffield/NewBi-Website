import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "../../_auth";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await adminSupabase
    .from("contacts")
    .update({
      status:           body.status,
      business_name:    body.businessName,
      instagram_handle: body.instagramHandle ?? null,
      category:         body.category,
      city:             body.city,
      followers:        body.followers != null ? Number(body.followers) || null : null,
      booking_method:   body.bookingMethod ?? null,
      email:            body.email ?? null,
      notes:            body.notes ?? null,
      phone:            body.phone ?? null,
      website:          body.website ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { error } = await adminSupabase.from("contacts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

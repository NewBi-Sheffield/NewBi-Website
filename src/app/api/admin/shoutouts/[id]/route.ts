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
    .from("shoutouts")
    .update({
      instagram_handle: body.instagramHandle ?? null,
      business_name:    body.businessName   ?? null,
      date:             body.date           || null,
      status:           body.status,
      reciprocated:     body.reciprocated   ?? false,
      notes:            body.notes          ?? null,
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
  const { error } = await adminSupabase.from("shoutouts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

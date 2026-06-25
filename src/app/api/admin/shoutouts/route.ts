import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "../_auth";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await adminSupabase
    .from("shoutouts")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { data, error } = await adminSupabase
    .from("shoutouts")
    .insert(toRow(body))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

function toRow(b: Record<string, unknown>) {
  return {
    instagram_handle: b.instagramHandle ?? null,
    business_name:    b.businessName   ?? null,
    date:             b.date           || null,
    notes:            b.notes          ?? null,
  };
}

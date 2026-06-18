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
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  // Bulk import: { contacts: [...] }
  if (Array.isArray(body.contacts)) {
    const rows = body.contacts.map(toRow);
    const { data, error } = await adminSupabase.from("contacts").insert(rows).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Single create
  const { data, error } = await adminSupabase.from("contacts").insert(toRow(body)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

function toRow(c: Record<string, unknown>) {
  return {
    status:           c.status           ?? "To contact",
    business_name:    c.businessName     ?? c.business_name ?? "",
    instagram_handle: c.instagramHandle  ?? c.instagram_handle ?? null,
    category:         c.category         ?? "",
    city:             c.city             ?? "",
    followers:        c.followers        != null ? Number(c.followers) || null : null,
    booking_method:   c.bookingMethod    ?? c.booking_method ?? null,
    email:            c.email            ?? null,
    notes:            c.notes            ?? null,
    phone:            c.phone            ?? null,
    website:          c.website          ?? null,
  };
}

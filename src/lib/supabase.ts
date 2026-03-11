import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single client — safe for both server components and client components
// (anon key is intentionally public; access is controlled by RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

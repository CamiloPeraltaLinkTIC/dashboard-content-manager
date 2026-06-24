import { createClient } from "@supabase/supabase-js";

const url = (process.env.NEXT_PUBLIC_ANALYZER_SUPABASE_URL || "").trim();
const key = (process.env.NEXT_PUBLIC_ANALYZER_SUPABASE_ANON_KEY || "").trim();

export const analyzerSupabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder"
);

import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Using fallback dummy values to prevent crashes.");
  // Provide dummy values so that the client can be instantiated without throwing.
  supabaseUrl = supabaseUrl || "https://example.supabase.co";
  supabaseAnonKey = supabaseAnonKey || "public-anon-key";
}

console.log("Supabase client initialized:", {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Optional: Add a simple guard for network errors in client-side fetches.
// Individual fetch functions already catch errors and return empty data.



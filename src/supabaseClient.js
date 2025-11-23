import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/['"]/g, "");

console.warn("Supabase URL:", supabaseUrl);
console.warn("Supabase Key:", supabaseAnonKey ? "Present" : "Missing");

let supabase;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Supabase initialization failed:", error);
  // Return a mock client to prevent app crash
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error("Supabase not initialized") }),
      insert: () => Promise.resolve({ data: null, error: new Error("Supabase not initialized") }),
      url: { searchParams: new URLSearchParams() }
    }),
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: "" } })
      })
    }
  };
}

export { supabase };

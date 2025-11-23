import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogcljpmtozblkwdvycro.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nY2xqcG10b3pibGt3ZHZ5Y3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzM5NzMsImV4cCI6MjA1NDE0OTk3M30.jKXDi0ybPkG6t781PftO6JQKxLelsP23GZNaWTHOx2o";

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

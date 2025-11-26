import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getBioData() {
  // Try CDN first
  const cdnUrl = process.env.NEXT_PUBLIC_PROFILE_JSON_URL;
  if (cdnUrl) {
    try {
      const res = await fetch(cdnUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.error("CDN fetch failed", e);
    }
  }

  // Fallback to Supabase
  const { data } = await supabase.from("bio").select("*").single();
  return data;
}

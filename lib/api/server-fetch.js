// Force rebuild - fixed project explanation data handling
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

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
        if (json.data) {
          console.log("✓ Loaded bio from CDN");
          return json.data;
        }
      }
    } catch (e) {
      console.warn("CDN fetch failed, trying local file:", e.message);
    }
  }

  // Try local JSON file (during build)
  try {
    const filePath = join(process.cwd(), "public", "data", "profile.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const json = JSON.parse(fileContent);
    if (json.data) {
      console.log("✓ Loaded bio from local file");
      return json.data;
    }
  } catch (e) {
    console.warn("Local file read failed, trying Supabase:", e.message);
  }

  // Fallback to Supabase
  try {
    const { data, error } = await supabase.from("bio").select("*").single();
    if (error) throw error;
    console.log("✓ Loaded bio from Supabase");
    return data;
  } catch (e) {
    console.error("All data sources failed for bio:", e.message);
    return null;
  }
}

export async function getProjectExplanation(projectId) {
  // Try CDN first
  const cdnUrl = process.env.NEXT_PUBLIC_PROJECT_EXPLANATIONS_JSON_URL;
  if (cdnUrl) {
    try {
      const res = await fetch(cdnUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const project = json.data.find((p) => p.project_id === projectId);
          if (project) {
            console.log("✓ Loaded project explanation from CDN");
            return project;
          }
        }
      }
    } catch (e) {
      console.warn("CDN fetch failed for project explanation, trying local file:", e.message);
    }
  }

  // Try local JSON file (during build)
  try {
    const filePath = join(process.cwd(), "public", "data", "project-explanations.json");
    const fileContent = readFileSync(filePath, "utf-8");
    const json = JSON.parse(fileContent);
    if (json.data && Array.isArray(json.data)) {
      const project = json.data.find((p) => p.project_id === projectId);
      if (project) {
        console.log("✓ Loaded project explanation from local file");
        return project;
      }
    }
  } catch (e) {
    console.warn("Local file read failed for project explanation, trying Supabase:", e.message);
  }

  // Fallback to Supabase
  try {
    const { data, error } = await supabase
      .from("project_explanations")
      .select("*")
      .eq("project_id", projectId)
      .single();
    if (error) throw error;
    console.log("✓ Loaded project explanation from Supabase");
    return data;
  } catch (e) {
    console.error("All data sources failed for project explanation:", e.message);
    return null;
  }
}

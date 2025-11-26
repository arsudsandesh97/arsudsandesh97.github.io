// Supabase Edge Function: update-section-json
// Updates JSON files in Supabase Storage when portfolio data changes

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// CORS headers for external webhook requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret, x-revalidate-secret",
};

interface SectionData {
  section: string;
  data: any;
  generatedAt: string;
}

interface WebhookPayload {
  section?: string;
  sections?: string[];
  table?: string;
}

// Map table names to section names
const TABLE_TO_SECTION: Record<string, string> = {
  bio: "profile",
  projects: "projects",
  skills: "skills",
  skill_categories: "skills",
  experiences: "experience",
  education: "education",
  members: "projects", // Related to projects
  associations: "projects", // Related to projects
  blog_posts: "blogs",
  project_explanations: "project-explanations",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const requestWebhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("WEBHOOK_SECRET");

    if (!requestWebhookSecret || requestWebhookSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid webhook secret" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const storageBucket = Deno.env.get("STORAGE_BUCKET") ?? "portfolio-json";

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Parse request body
    const payload: WebhookPayload = await req.json();
    console.log("Received webhook payload:", payload);

    // Determine which sections to update
    let sectionsToUpdate: string[] = [];

    if (payload.section) {
      sectionsToUpdate = [payload.section];
    } else if (payload.sections) {
      sectionsToUpdate = payload.sections;
    } else if (payload.table) {
      // Map table name to section
      const section = TABLE_TO_SECTION[payload.table];
      if (section) {
        sectionsToUpdate = [section];
      }
    }

    // Default to all sections if none specified
    if (sectionsToUpdate.length === 0) {
      sectionsToUpdate = ["profile", "projects", "skills", "experience", "education"];
    }

    // Remove duplicates
    sectionsToUpdate = [...new Set(sectionsToUpdate)];
    console.log("Sections to update:", sectionsToUpdate);

    const results: any[] = [];
    const localUpdateUrl = Deno.env.get("LOCAL_JSON_UPDATE_URL"); // For updating local files
    // Removed duplicate declaration of webhookSecret


    // Update each section
    for (const section of sectionsToUpdate) {
      try {
        const sectionData = await fetchSectionData(supabase, section);
        
        if (!sectionData) {
          console.warn(`No data found for section: ${section}`);
          results.push({ section, status: "skipped", reason: "no data" });
          continue;
        }

        // Upload to storage
        const fileName = `${section}.json`;
        const jsonData = JSON.stringify(sectionData, null, 2);

        const { error: uploadError } = await supabase.storage
          .from(storageBucket)
          .upload(fileName, jsonData, {
            contentType: "application/json",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${section}:`, uploadError);
          results.push({ section, status: "error", error: uploadError.message });
        } else {
          console.log(`Successfully uploaded ${fileName} to Storage`);
          
          // ALSO update local JSON file if URL is configured
          if (localUpdateUrl && webhookSecret) {
            try {
              const localResponse = await fetch(localUpdateUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-webhook-secret": webhookSecret,
                },
                body: JSON.stringify({
                  section,
                  data: sectionData,
                }),
              });

              if (localResponse.ok) {
                console.log(`✓ Updated local JSON for ${section}`);
              } else {
                console.warn(`Failed to update local JSON for ${section}: ${localResponse.status}`);
              }
            } catch (localError: any) {
              console.warn(`Local JSON update failed for ${section}:`, localError.message);
              // Don't fail the whole operation if local update fails
            }
          }
          
          results.push({ section, status: "success", fileName });
        }
      } catch (error: any) {
        console.error(`Error processing section ${section}:`, error);
        results.push({ section, status: "error", error: error.message });
      }
    }

    // Trigger GitHub Actions to rebuild and deploy
    const githubRepo = Deno.env.get("GITHUB_REPO");
    const githubToken = Deno.env.get("GITHUB_TOKEN");

    let deploymentResult = null;

    if (githubRepo && githubToken) {
      try {
        const githubResponse = await fetch(
          `https://api.github.com/repos/${githubRepo}/dispatches`,
          {
            method: "POST",
            headers: {
              "Accept": "application/vnd.github+json",
              "Authorization": `Bearer ${githubToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_type: "supabase-update",
              client_payload: {
                sections: sectionsToUpdate,
                timestamp: new Date().toISOString(),
              },
            }),
          }
        );

        if (githubResponse.ok) {
          deploymentResult = {
            status: "success",
            message: "GitHub Actions triggered successfully",
          };
          console.log("GitHub Actions deployment triggered");
        } else {
          const errorText = await githubResponse.text();
          deploymentResult = {
            status: "error",
            message: `GitHub API error: ${errorText}`,
          };
          console.error("GitHub Actions trigger failed:", errorText);
        }
      } catch (error: any) {
        deploymentResult = {
          status: "error",
          message: error.message,
        };
        console.error("Error triggering GitHub Actions:", error);
      }
    }


    return new Response(
      JSON.stringify({
        success: true,
        results,
        revalidation: revalidationResult,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Fetch data for a specific section
 */
async function fetchSectionData(supabase: any, section: string): Promise<any> {
  const generatedAt = new Date().toISOString();

  switch (section) {
    case "profile": {
      // Fetch bio data (single row)
      const { data, error } = await supabase
        .from("bio")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return { data, generatedAt };
    }

    case "projects": {
      // Fetch projects with related members and associations
      const { data, error } = await supabase
        .from("projects")
        .select("*, members(*), associations(*)");

      if (error) {
        console.error("Error fetching projects:", error);
        return null;
      }

      return { data: data || [], generatedAt };
    }

    case "skills": {
      // Fetch skills with categories
      const { data: categories, error: categoriesError } = await supabase
        .from("skill_categories")
        .select("*")
        .order("id", { ascending: false });

      if (categoriesError) {
        console.error("Error fetching skill categories:", categoriesError);
        return null;
      }

      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .order("id", { ascending: true });

      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
        return null;
      }

      // Map skills into categories
      const formattedSkills = (categories || []).map((category: any) => ({
        id: category.id,
        title: category.title,
        skills: (skills || [])
          .filter((skill: any) => skill.category_id === category.id)
          .map((skill: any) => ({
            id: skill.id,
            name: skill.name,
            image: skill.image,
          })),
      }));

      return { data: formattedSkills, generatedAt };
    }

    case "experience": {
      // Fetch experiences
      const { data, error } = await supabase
        .from("experiences")
        .select("*");

      if (error) {
        console.error("Error fetching experiences:", error);
        return null;
      }

      return { data: data || [], generatedAt };
    }

    case "education": {
      // Fetch education
      const { data, error } = await supabase
        .from("education")
        .select("*");

      if (error) {
        console.error("Error fetching education:", error);
        return null;
      }

      return { data: data || [], generatedAt };
    }

    case "blogs": {
      // Fetch all published blog posts
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        return null;
      }

      return { data: data || [], generatedAt };
    }

    case "project-explanations": {
      // Fetch all project explanations
      const { data, error } = await supabase
        .from("project_explanations")
        .select("*");

      if (error) {
        console.error("Error fetching project explanations:", error);
        return null;
      }

      return { data: data || [], generatedAt };
    }

    default:
      console.warn(`Unknown section: ${section}`);
      return null;
  }
}

/**
 * Get Next.js paths to revalidate based on sections
 */
function getPathsForSections(sections: string[]): string[] {
  const pathMap: Record<string, string[]> = {
    profile: ["/", "/about"],
    projects: ["/", "/projects"],
    skills: ["/", "/skills"],
    experience: ["/", "/experience"],
    education: ["/", "/education"],
  };

  const paths = new Set<string>();

  sections.forEach(section => {
    const sectionPaths = pathMap[section] || [];
    sectionPaths.forEach(path => paths.add(path));
  });

  return [...paths];
}

// Client-side Supabase API functions
"use client";

// Import the Supabase client instance
import { supabase } from "../supabase/client";

// Export a flag indicating whether we are using dummy fallback values
export const isDummySupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Helper function to fetch data from CDN JSON files
 * Falls back to direct Supabase query if CDN fetch fails
 */
const fetchFromCDN = async (cdnUrl, fallbackFn, cacheKey) => {
  // Try CDN first if URL is configured
  if (cdnUrl && cdnUrl !== "undefined" && !cdnUrl.includes("[project-ref]")) {
    try {
      console.log(`Fetching from CDN: ${cdnUrl}`);
      const response = await fetch(cdnUrl, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // Always get fresh data
      });

      if (response.ok) {
        const jsonData = await response.json();
        console.log(`CDN fetch successful for ${cacheKey}`);
        
        // Cache in sessionStorage if available
        if (typeof window !== "undefined" && cacheKey) {
          sessionStorage.setItem(cacheKey, JSON.stringify(jsonData.data));
        }
        
        return { data: jsonData.data, error: null, source: "cdn" };
      } else {
        console.warn(`CDN fetch failed with status ${response.status}, falling back to Supabase`);
      }
    } catch (error) {
      console.warn(`CDN fetch error, falling back to Supabase:`, error.message);
    }
  } else {
    console.log(`CDN URL not configured for ${cacheKey}, using Supabase directly`);
  }

  // Fallback to direct Supabase query
  console.log(`Using Supabase fallback for ${cacheKey}`);
  const result = await fallbackFn();
  return { ...result, source: "supabase" };
};

/**
 * Helper function to fetch data from local JSON files
 */
const fetchFromLocalJSON = async (section, fallbackFn) => {
  try {
    const response = await fetch(`/data/${section}.json`, {
      cache: "no-store",
    });

    if (response.ok) {
      const jsonData = await response.json();
      console.log(`✓ Loaded ${section} from local JSON`);
      return { data: jsonData.data, error: null };
    }
  } catch (error) {
    console.warn(`Local JSON not found for ${section}, using Supabase`);
  }

  return await fallbackFn();
};

// Helper function for image optimization
export const getOptimizedImageUrl = (url, width = 400) => {
  if (!url) return "";

  try {
    // If using Supabase Storage
    if (url.includes("supabase.co")) {
      // Add transformation parameters for Supabase Storage
      const optimizedUrl = new URL(url);
      optimizedUrl.searchParams.set("width", width.toString());
      optimizedUrl.searchParams.set("quality", "75");
      optimizedUrl.searchParams.set("format", "webp");
      return optimizedUrl.toString();
    }

    // If image is base64
    if (url.startsWith("data:image")) {
      return url;
    }

    // For external URLs, return as is
    return url;
  } catch (error) {
    console.error("Error optimizing image URL:", error);
    return url;
  }
};

// Fetch Bio Data (Client-side) - CDN with fallback
export const fetchBioDataClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty bio data.');
    return { data: null, error: null };
  }

  // Check sessionStorage cache first
  if (typeof window !== "undefined") {
    const cachedData = sessionStorage.getItem("bioData");
    if (cachedData) {
      return { data: JSON.parse(cachedData), error: null, source: "cache" };
    }
  }

  // Fallback function for direct Supabase query
  const fetchFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from("bio").select("*").single();
      if (error) throw error;

      // Optimize the image URL if present
      if (data?.Image) {
        data.Image = getOptimizedImageUrl(data.Image);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching bio data:", error);
      return { data: null, error };
    }
  };

  // Try CDN first, fallback to Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_PROFILE_JSON_URL;
  const result = await fetchFromCDN(cdnUrl, fetchFromSupabase, "bioData");
  
  // Optimize image if present
  if (result.data?.Image) {
    result.data.Image = getOptimizedImageUrl(result.data.Image);
  }
  
  return result;
};

// Fetch Skills with Categories (Client-side) - CDN with fallback
export const fetchSkillsWithCategoriesClient = async () => {
  // If Supabase is in dummy mode (env vars missing), return empty data to avoid network errors
  if (isDummySupabase) {
    console.warn('Supabase client is using dummy fallback values – returning empty skills data.');
    return { data: [], error: null };
  }

  // Fallback function for direct Supabase query
  const fetchFromSupabase = async () => {
    try {
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('skill_categories')
        .select('*')
        .order('id', { ascending: false });

      if (categoriesError) throw categoriesError;

      // Fetch skills
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('id', { ascending: true });

      if (skillsError) throw skillsError;

      // Map skills into categories
      const formattedSkills = (categories || []).map((category) => ({
        id: category.id,
        title: category.title,
        skills: (skills || [])
          .filter((skill) => skill.category_id === category.id)
          .map((skill) => ({
            id: skill.id,
            name: skill.name,
            image: skill.image,
          })),
      }));

      return { data: formattedSkills, error: null };
    } catch (error) {
      console.error('Error fetching skills with categories:', error);
      return { data: [], error };
    }
  };

  // Try CDN first, fallback to Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_SKILLS_JSON_URL;
  return await fetchFromCDN(cdnUrl, fetchFromSupabase, "skillsData");
};

// Fetch Projects Data (Client-side) - CDN with fallback
export const fetchProjectsClient = async () => {
  // Return empty data in dummy mode to avoid network errors
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty projects data.');
    return { data: [], error: null };
  }

  // Fallback function for direct Supabase query
  const fetchFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*,members(*),associations(*)");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching projects data:", error);
      return { data: null, error };
    }
  };

  // Try CDN first, fallback to Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_PROJECTS_JSON_URL;
  return await fetchFromCDN(cdnUrl, fetchFromSupabase, "projectsData");
};

// Fetch Experiences Data (Client-side) - CDN with fallback
export const fetchExperiencesClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty experiences data.');
    return { data: [], error: null };
  }

  // Fallback function for direct Supabase query
  const fetchFromSupabase = async () => {
    try {
      console.log("Fetching experiences from Supabase...");
      const { data, error } = await supabase.from("experiences").select("*");
      
      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { 
          data: [], 
          error: {
            message: error.message || "Failed to fetch experiences",
            details: error.details,
            hint: error.hint,
            code: error.code
          }
        };
      }
      
      if (!data) {
        console.warn("No data returned from Supabase (data is null/undefined)");
        return { data: [], error: null };
      }
      
      console.log(`Successfully fetched ${data.length} experiences`);
      return { data: Array.isArray(data) ? data : [], error: null };
    } catch (error) {
      console.error("Exception while fetching experiences:", error);
      return { 
        data: [], 
        error: {
          message: error?.message || "Unknown error occurred",
          stack: error?.stack
        }
      };
    }
  };

  // Try CDN first, fallback to Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_EXPERIENCE_JSON_URL;
  return await fetchFromCDN(cdnUrl, fetchFromSupabase, "experiencesData");
};

// Fetch Education Data (Client-side) - CDN with fallback
export const fetchEducationClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty education data.');
    return { data: [], error: null };
  }

  // Fallback function for direct Supabase query
  const fetchFromSupabase = async () => {
    try {
      console.log("Fetching education from Supabase...");
      const { data, error } = await supabase.from("education").select("*");
      
      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { 
          data: [], 
          error: {
            message: error.message || "Failed to fetch education",
            details: error.details,
            hint: error.hint,
            code: error.code
          }
        };
      }
      
      if (!data) {
        console.warn("No data returned from Supabase (data is null/undefined)");
        return { data: [], error: null };
      }
      
      console.log(`Successfully fetched ${data.length} education records`);
      return { data: Array.isArray(data) ? data : [], error: null };
    } catch (error) {
      console.error("Exception while fetching education:", error);
      return { 
        data: [], 
        error: {
          message: error?.message || "Unknown error occurred",
          stack: error?.stack
        }
      };
    }
  };

  // Try CDN first, fallback to Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_EDUCATION_JSON_URL;
  return await fetchFromCDN(cdnUrl, fetchFromSupabase, "educationData");
};

// Fetch Single Project Client
export const fetchSingleProjectClient = async (id) => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*, members(*), associations(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching single project:", error);
      return { data: null, error };
    }
  };

  // Try CDN first, then local JSON, then Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_PROJECTS_JSON_URL;
  const result = await fetchFromCDN(cdnUrl, fallback, "projectsData");
  
  if (!result.error && result.data) {
    const project = result.data.find(p => p.id === id);
    return { data: project || null, error: null };
  }

  return result;
};

// Fetch Project Explanation Client
export const fetchProjectExplanationClient = async (projectId) => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase
        .from("project_explanations")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) {
        // It's okay if no explanation exists
        return { data: null, error: null };
      }
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching project explanation:", error);
      return { data: null, error };
    }
  };

  // Try CDN first, then local JSON, then Supabase
  const cdnUrl = process.env.NEXT_PUBLIC_PROJECT_EXPLANATIONS_JSON_URL;
  const result = await fetchFromCDN(cdnUrl, fallback, "projectExplanations");
  
  if (!result.error && result.data && Array.isArray(result.data)) {
    const explanation = result.data.find(e => e.project_id === projectId);
    return { data: explanation || null, error: null };
  }
  
  return result;
};


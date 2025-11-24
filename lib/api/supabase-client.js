// Client-side Supabase API functions
"use client";

// Import the Supabase client instance
import { supabase } from "../supabase/client";

// Export a flag indicating whether we are using dummy fallback values
export const isDummySupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


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

// Fetch Bio Data (Client-side)
export const fetchBioDataClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty bio data.');
    return { data: null, error: null };
  }
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

// Fetch Skills with Categories (Client-side)
export const fetchSkillsWithCategoriesClient = async () => {
  // If Supabase is in dummy mode (env vars missing), return empty data to avoid network errors
  if (isDummySupabase) {
    console.warn('Supabase client is using dummy fallback values – returning empty skills data.');
    return { data: [], error: null };
  }

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

// Fetch Projects Data (Client-side)
export const fetchProjectsClient = async () => {
  // Return empty data in dummy mode to avoid network errors
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty projects data.');
    return { data: [], error: null };
  }

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

// Fetch Experiences Data (Client-side)
export const fetchExperiencesClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty experiences data.');
    return { data: [], error: null };
  }
  try {
    console.log("Starting to fetch experiences from Supabase...");
    const { data, error } = await supabase.from("experiences").select("*");
    
    console.log("Supabase response:", { 
      hasData: !!data, 
      dataLength: data?.length, 
      hasError: !!error,
      error: error 
    });
    
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

// Fetch Education Data (Client-side)
export const fetchEducationClient = async () => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty education data.');
    return { data: [], error: null };
  }
  try {
    console.log("Starting to fetch education from Supabase...");
    const { data, error } = await supabase.from("education").select("*");
    
    console.log("Supabase response:", { 
      hasData: !!data, 
      dataLength: data?.length, 
      hasError: !!error,
      error: error 
    });
    
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

// Fetch Project Explanation (Markdown content) by Project ID
export const fetchProjectExplanationClient = async (projectId) => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty project explanation.');
    return { data: null, error: null };
  }

  try {
    console.log("Fetching project explanation for project ID:", projectId);
    const { data, error } = await supabase
      .from("project_explanations")
      .select("markdown_content")
      .eq("project_id", projectId)
      .single();
    
    if (error) {
      console.error("Error fetching project explanation:", error);
      return { data: null, error };
    }
    
    console.log("Project explanation fetched successfully");
    return { data, error: null };
  } catch (error) {
    console.error("Exception fetching project explanation:", error);
    return { data: null, error };
  }
};

// Fetch Single Project by ID (Client-side)
export const fetchSingleProjectClient = async (id) => {
  // Return empty data in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning empty single project data.');
    return { data: null, error: null };
  }

  try {
    console.log("Fetching project with ID:", id);
    const { data, error } = await supabase
      .from("projects")
      .select("*,members(*),associations(*)")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching project:", error);
      return { data: null, error };
    }
    
    console.log("Project data fetched:", data);
    return { data, error: null };
  } catch (error) {
    console.error("Exception fetching project:", error);
    return { data: null, error };
  }
};


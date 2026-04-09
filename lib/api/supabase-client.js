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
    // Use no-cache to ensure we check for updates (ETag validation)
    const response = await fetch(`/data/${section}.json`, {
      cache: "no-cache",
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
    // Supabase Storage public URLs - return as-is
    // (image transformations require Supabase Pro plan)
    if (url.includes("supabase.co")) {
      return url;
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

  // Try local JSON first, fallback to Supabase
  const result = await fetchFromLocalJSON("profile", fetchFromSupabase);
  
  // Optimize image if present
  if (result.data?.image) {
    result.data.image = getOptimizedImageUrl(result.data.image);
  } else if (result.data?.Image) {
    // Handle case sensitivity
    result.data.image = getOptimizedImageUrl(result.data.Image);
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
  // Try local JSON first, fallback to Supabase
  return await fetchFromLocalJSON("skills", fetchFromSupabase);
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
  // Try local JSON first, fallback to Supabase
  return await fetchFromLocalJSON("projects", fetchFromSupabase);
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
  // Try local JSON first, fallback to Supabase
  return await fetchFromLocalJSON("experience", fetchFromSupabase);
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
  // Try local JSON first, fallback to Supabase
  return await fetchFromLocalJSON("education", fetchFromSupabase);
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
  // Try local JSON first, fallback to Supabase
  const result = await fetchFromLocalJSON("projects", fallback);
  
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
        .maybeSingle();

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
  // Try local JSON first, fallback to Supabase
  const result = await fetchFromLocalJSON("project-explanations", fallback);
  
  // If CDN returned an array, find the specific project
  if (!result.error && result.data && Array.isArray(result.data)) {
    const explanation = result.data.find(e => e.project_id === projectId);
    return { data: explanation || null, error: null };
  }
  
  // If fallback returned a single object (from Supabase), return it as-is
  if (!result.error && result.data && !Array.isArray(result.data)) {
    return { data: result.data, error: null };
  }
  
  // No data found
  return { data: null, error: result.error || null };
};

// Fetch Single Blog Post Client
export const fetchBlogPostClient = async (slug) => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return { data: null, error };
    }
  };

  // Try CDN first, then local JSON, then Supabase
  // Try local JSON first, fallback to Supabase
  const result = await fetchFromLocalJSON("blogs", fallback);
  
  if (!result.error && result.data) {
    const post = result.data.find(p => p.slug === slug);
    return { data: post || null, error: null };
  }

  return result;
};

// Fetch Copyright Client
export const fetchCopyrightClient = async () => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase
        .from("copyright")
        .select("copyright")
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching copyright:", error);
      return { data: null, error };
    }
  };

  // Try local JSON first (using fetchFromLocalJSON directly since we don't have a specific CDN URL for copyright yet)
  return await fetchFromLocalJSON("copyright", fallback);
};

// ========================================
// Open To Work Settings Functions (Client-side)
// ========================================

/**
 * Fetch OpenToWork settings from Supabase (Client-side)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const fetchOpenToWorkSettingsClient = async () => {
  // Return default hidden state in dummy mode
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – returning hidden OpenToWork status.');
    return { data: { is_visible: false }, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("open_to_work_settings")
      .select("*")
      .single();

    if (error) {
      // If table doesn't exist or no data, return default settings
      if (error.code === "PGRST116" || error.code === "42P01") {
        console.warn("OpenToWork settings table not found or empty");
        return { data: { is_visible: false }, error: null };
      }
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching OpenToWork settings:", error);
    return { data: { is_visible: false }, error };
  }
};

/**
 * Update OpenToWork visibility state (Client-side)
 * Requires authentication
 * @param {boolean} isVisible - Whether the widget should be visible
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateOpenToWorkVisibilityClient = async (isVisible) => {
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – cannot update OpenToWork visibility.');
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    // First try to update existing row
    const { data: existingData } = await supabase
      .from("open_to_work_settings")
      .select("id")
      .single();

    if (existingData) {
      // Update existing row
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      // Insert new row if none exists
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .insert([{ is_visible: isVisible }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Error updating OpenToWork visibility:", error);
    return { data: null, error };
  }
};

/**
 * Update OpenToWork settings (Client-side, full update)
 * Requires authentication
 * @param {Object} settings - Settings object to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateOpenToWorkSettingsClient = async (settings) => {
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – cannot update OpenToWork settings.');
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    const { data: existingData } = await supabase
      .from("open_to_work_settings")
      .select("id")
      .single();

    const updateData = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .update(updateData)
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .insert([updateData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Error updating OpenToWork settings:", error);
    return { data: null, error };
  }
};

/**
 * Subscribe to OpenToWork settings changes (Real-time)
 * @param {Function} callback - Callback function to handle changes
 * @returns {Object} - Supabase channel subscription
 */
export const subscribeToOpenToWorkChanges = (callback) => {
  if (isDummySupabase) {
    console.warn('Supabase client dummy mode – cannot subscribe to OpenToWork changes.');
    return null;
  }

  const channel = supabase
    .channel("open_to_work_realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "open_to_work_settings",
      },
      (payload) => {
        console.log("OpenToWork settings changed:", payload);
        if (callback && typeof callback === "function") {
          callback(payload);
        }
      }
    )
    .subscribe();

  return channel;
};

/**
 * Unsubscribe from OpenToWork settings changes
 * @param {Object} channel - Supabase channel subscription
 */
export const unsubscribeFromOpenToWorkChanges = async (channel) => {
  if (channel) {
    await supabase.removeChannel(channel);
  }
};

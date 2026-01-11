import { supabase } from "../supabaseClient";

/**
 * Helper function to fetch data from local JSON files
 * Falls back to direct Supabase query if local file fails
 */
/**
 * Helper function to fetch data from CDN JSON files
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
      }
    } catch (error) {
      console.warn(`CDN fetch error, falling back to Supabase:`, error.message);
    }
  }

  // Fallback to direct Supabase query
  console.log(`Using Supabase fallback for ${cacheKey}`);
  return await fallbackFn();
};

// Fetch Bio Data - loads from local JSON
export const fetchBioData = async () => {
  const fallback = async () => {
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

  const cdnUrl = process.env.NEXT_PUBLIC_PROFILE_JSON_URL;
  const result = await fetchFromCDN(cdnUrl, fallback, "bioData");
  
  // Optimize image if present
  if (result.data?.Image) {
    result.data.Image = getOptimizedImageUrl(result.data.Image);
  }
  
  return result;
};

// Fetch Skills Data
export const fetchSkillsData = async () => {
  try {
    const { data, error } = await supabase.from("skills").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return { data: null, error };
  }
};

// Fetch Skills with Categories - loads from local JSON
export const fetchSkillsWithCategories = async () => {
  const fallback = async () => {
    try {
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from("skill_categories")
        .select("*")
        .order("id", { ascending: false });

      if (categoriesError) throw categoriesError;

      // Fetch skills
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .order("id", { ascending: true });

      if (skillsError) throw skillsError;

      // Map skills into categories
      const formattedSkills = categories.map((category) => ({
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
      console.error("Error fetching skills with categories:", error);
      return { data: [], error };
    }
  };

  const cdnUrl = process.env.NEXT_PUBLIC_SKILLS_JSON_URL;
  return await fetchFromCDN(cdnUrl, fallback, "skillsData");
};

// Fetch Projects Data - loads from local JSON  
export const fetchProjects = async () => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching projects data:", error);
      return { data: null, error };
    }
  };

  const cdnUrl = process.env.NEXT_PUBLIC_PROJECTS_JSON_URL;
  return await fetchFromCDN(cdnUrl, fallback, "projectsData");
};

// Fetch Experiences Data - loads from local JSON
export const fetchExperiences = async () => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase.from("experiences").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching experiences data:", error);
      return { data: null, error };
    }
  };

  const cdnUrl = process.env.NEXT_PUBLIC_EXPERIENCE_JSON_URL;
  return await fetchFromCDN(cdnUrl, fallback, "experiencesData");
};

// Fetch Education Data - loads from local JSON
export const fetchEducation = async () => {
  const fallback = async () => {
    try {
      const { data, error } = await supabase.from("education").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching education data:", error);
      return { data: null, error };
    }
  };

  const cdnUrl = process.env.NEXT_PUBLIC_EDUCATION_JSON_URL;
  return await fetchFromCDN(cdnUrl, fallback, "educationData");
};

// Store Contact Form Data
export const storeContactData = async (contactData) => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .insert([contactData]);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error storing contact data:", error);
    return { data: null, error };
  }
};

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

// Fetch Copyright Data
export const fetchCopyrightData = async () => {
  try {
    const { data, error } = await supabase
      .from("copyright")
      .select("copyright")
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching copyright data:", error);
    return { data: null, error };
  }
};

// ========================================
// Open To Work Settings Functions
// ========================================

/**
 * Fetch OpenToWork settings from Supabase
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const fetchOpenToWorkSettings = async () => {
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
 * Update OpenToWork visibility state
 * @param {boolean} isVisible - Whether the widget should be visible
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateOpenToWorkVisibility = async (isVisible) => {
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
 * Update OpenToWork settings (full update)
 * @param {Object} settings - Settings object to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateOpenToWorkSettings = async (settings) => {
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

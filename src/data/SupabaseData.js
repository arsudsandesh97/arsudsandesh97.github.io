import { supabase } from "../supabaseClient";

/**
 * Helper function to fetch data from local JSON files
 * Falls back to direct Supabase query if local file fails
 */
const fetchFromLocalJSON = async (section, fallbackFn) => {
  // Try local JSON first
  try {
    console.log(`Attempting to fetch /data/${section}.json...`);
    const response = await fetch(`/data/${section}.json`, {
      cache: "no-store",
    });

    if (response.ok) {
      const jsonData = await response.json();
      console.log(`✓ Loaded ${section} from local JSON`);
      return { data: jsonData.data, error: null };
    } else {
      console.warn(`Failed to fetch /data/${section}.json: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error loading local JSON for ${section}:`, error);
  }

  console.log(`Falling back to Supabase for ${section}...`);
  // Fallback to Supabase
  return await fallbackFn();
};

// Fetch Bio Data - loads from local JSON
export const fetchBioData = async () => {
  return await fetchFromLocalJSON("profile", async () => {
    try {
      const { data, error } = await supabase.from("bio").select("*").single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching bio data:", error);
      return { data: null, error };
    }
  });
};

// Fetch Skills Data - loads from local JSON
export const fetchSkillsData = async () => {
  return await fetchFromLocalJSON("skills", async () => {
    try {
      const { data, error } = await supabase.from("skills").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching skills data:", error);
      return { data: null, error };
    }
  });
};

// Fetch Projects Data - loads from local JSON
export const fetchProjects = async () => {
  return await fetchFromLocalJSON("projects", async () => {
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
  });
};

// Fetch Experiences Data - loads from local JSON
export const fetchExperiences = async () => {
  return await fetchFromLocalJSON("experience", async () => {
    try {
      const { data, error } = await supabase.from("experiences").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching experiences data:", error);
      return { data: null, error };
    }
  });
};

// Fetch Education Data - loads from local JSON
export const fetchEducation = async () => {
  return await fetchFromLocalJSON("education", async () => {
    try {
      const { data, error } = await supabase.from("education").select("*");
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching education data:", error);
      return { data: null, error };
    }
  });
};

// Store Contact Form Data (this one still needs database access)
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

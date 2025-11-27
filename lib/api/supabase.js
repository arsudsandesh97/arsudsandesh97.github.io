import { createServerClient } from "../supabase/server";
import fs from 'fs';
import path from 'path';
import { slugify } from "../utils";

// Helper to fetch local data
const fetchLocalData = async (filename) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContents);
      return jsonData.data;
    }
  } catch (error) {
    console.warn(`Error reading local data ${filename}:`, error);
  }
  return null;
};

// Fetch Bio Data
export const fetchBioData = async () => {
  // Try local data first
  const localData = await fetchLocalData('profile.json');
  if (localData) {
    if (localData.Image) {
      localData.Image = getOptimizedImageUrl(localData.Image);
    }
    return { data: localData, error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("bio").select("*").single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching bio data:", error);
    return { data: null, error };
  }
};

// Fetch Skills Data
export const fetchSkillsData = async () => {
  // Try local data first
  const localData = await fetchLocalData('skills.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("skills").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return { data: null, error };
  }
};

// Fetch Skills with Categories
export const fetchSkillsWithCategories = async () => {
  // Try local data first (skills.json is already categorized)
  const localData = await fetchLocalData('skills.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
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

// Fetch Projects Data
export const fetchProjects = async () => {
  // Try local data first
  const localData = await fetchLocalData('projects.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
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

// Fetch Experiences Data
export const fetchExperiences = async () => {
  // Try local data first
  const localData = await fetchLocalData('experience.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("experiences").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching experiences data:", error);
    return { data: null, error };
  }
};

// Fetch Education Data
export const fetchEducation = async () => {
  // Try local data first
  const localData = await fetchLocalData('education.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("education").select("*");
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching education data:", error);
    return { data: null, error };
  }
};

// Store Contact Form Data
export const storeContactData = async (contactData) => {
  try {
    const supabase = createServerClient();
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

// Fetch Single Project by ID (Server-side)
export const fetchSingleProject = async (id) => {
  // Try local data first
  const localData = await fetchLocalData('projects.json');
  if (localData) {
    const project = localData.find(p => p.id === id);
    return { data: project || null, error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*,members(*),associations(*)")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return { data: null, error };
  }
};

// Fetch Single Project by Slug (Server-side)
export const fetchProjectBySlug = async (slug) => {
  // Try local data first
  const localData = await fetchLocalData('projects.json');
  if (localData) {
    const project = localData.find(p => slugify(p.title) === slug);
    return { data: project || null, error: null };
  }

  try {
    // Since we don't have a slug column, we fetch all and filter.
    const { data: projects, error } = await fetchProjects();
    
    if (error) throw error;
    
    const project = projects.find(p => slugify(p.title) === slug);
    return { data: project || null, error: null };
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return { data: null, error };
  }
};

// Fetch Project Explanation (Server-side)
export const fetchProjectExplanation = async (projectId) => {
  // Try local data first
  const localData = await fetchLocalData('project-explanations.json');
  if (localData) {
    const explanation = localData.find(e => e.project_id === projectId);
    return { data: explanation || null, error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("project_explanations")
      .select("markdown_content")
      .eq("project_id", projectId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching explanation for ${projectId}:`, error);
    return { data: null, error };
  }
};

// Fetch all Project IDs for Static Generation
export const fetchProjectIds = async () => {
  // Try local data first
  const localData = await fetchLocalData('projects.json');
  if (localData) {
    return { data: localData.map(p => ({ id: p.id })), error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id");
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching project IDs:", error);
    return { data: [], error };
  }
};

// Fetch all Project Slugs for Static Generation
export const fetchProjectSlugs = async () => {
  // Try local data first
  const localData = await fetchLocalData('projects.json');
  if (localData) {
    return { data: localData.map(p => ({ slug: slugify(p.title) })), error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("title");
    
    if (error) throw error;
    return { data: data.map(p => ({ slug: slugify(p.title) })), error: null };
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return { data: [], error };
  }
};

// Fetch Copyright Data
export const fetchCopyrightData = async () => {
  // Try local data first
  const localData = await fetchLocalData('copyright.json');
  if (localData) return { data: localData, error: null };

  try {
    const supabase = createServerClient();
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

// Fetch Blog Slugs for Static Generation
export const fetchBlogSlugs = async () => {
  // Try local data first
  const localData = await fetchLocalData('blogs.json');
  if (localData) {
    const slugs = localData.map(post => ({ slug: post.slug }));
    return { data: slugs, error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("published", true);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching blog slugs:", error);
    return { data: [], error };
  }
};

// Fetch Single Blog Post (Server-side)
export const fetchSingleBlogPost = async (slug) => {
  // Try local data first
  const localData = await fetchLocalData('blogs.json');
  if (localData) {
    const post = localData.find(p => p.slug === slug);
    return { data: post || null, error: null };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return { data: null, error };
  }
};

// Fetch All Blog Posts (Server-side)
export const fetchAllBlogPosts = async (limit = 100, offset = 0) => {
  // Try local data first
  const localData = await fetchLocalData('blogs.json');
  if (localData) {
    const posts = localData.slice(offset, offset + limit);
    return { posts, total: localData.length };
  }

  try {
    const supabase = createServerClient();
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { posts: data || [], total: count || 0 };
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    return { posts: [], total: 0 };
  }
};

// Fetch All Tags (Server-side)
export const fetchAllTags = async () => {
  // Try local data first
  const localData = await fetchLocalData('blogs.json');
  if (localData) {
    const allTags = localData.flatMap(post => post.tags || []) || [];
    return [...new Set(allTags)].sort();
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true);

    if (error) throw error;
    
    const allTags = data?.flatMap(post => post.tags || []) || [];
    const uniqueTags = [...new Set(allTags)].sort();
    return uniqueTags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};

// Fetch Featured Posts (Server-side)
export const fetchFeaturedPosts = async (limit = 3) => {
  // Try local data first
  const localData = await fetchLocalData('blogs.json');
  if (localData) {
    return localData.filter(p => p.is_featured).slice(0, limit);
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
};

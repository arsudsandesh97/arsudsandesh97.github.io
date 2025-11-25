// Blog API Functions for Supabase
import { supabase } from '../supabase/client';

/**
 * Get all published blog posts
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getAllBlogPosts(limit = 10, offset = 0) {
  try {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    
    return { posts: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0 };
  }
}

/**
 * Get a single blog post by slug
 * @param {string} slug - Post slug
 * @returns {Promise<Object|null>} Blog post or null
 */
export async function getBlogPostBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Get featured/latest blog posts
 * @param {number} limit - Number of posts
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getFeaturedPosts(limit = 3) {
  try {
    // Only get posts marked as featured
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
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

/**
 * Get blog posts by tag
 * @param {string} tag - Tag to filter by
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getPostsByTag(tag) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .contains('tags', [tag])
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

/**
 * Get blog posts by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getPostsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

/**
 * Search blog posts
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching blog posts
 */
export async function searchPosts(query) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

/**
 * Increment post views
 * @param {string} slug - Post slug
 * @returns {Promise<boolean>} Success status
 */
export async function incrementViews(slug) {
  try {
    const { error } = await supabase.rpc('increment_post_views', { post_slug: slug });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return false;
  }
}

/**
 * Get all unique tags from published posts
 * @returns {Promise<Array>} Array of unique tags
 */
export async function getAllTags() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('published', true);

    if (error) throw error;
    
    // Flatten and deduplicate tags
    const allTags = data?.flatMap(post => post.tags || []) || [];
    const uniqueTags = [...new Set(allTags)].sort();
    
    return uniqueTags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Get related posts based on tags
 * @param {string} currentSlug - Current post slug to exclude
 * @param {Array<string>} tags - Tags to match
 * @param {number} limit - Number of related posts
 * @returns {Promise<Array>} Array of related blog posts
 */
export async function getRelatedPosts(currentSlug, tags, limit = 3) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .neq('slug', currentSlug)
      .overlaps('tags', tags)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// ====================
// ADMIN FUNCTIONS
// ====================

/**
 * Create a new blog post (requires authentication)
 * @param {Object} postData - Post data
 * @returns {Promise<Object|null>} Created post or null
 */
export async function createPost(postData) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

/**
 * Update a blog post (requires authentication)
 * @param {string} slug - Post slug
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated post or null
 */
export async function updatePost(slug, updates) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
}

/**
 * Delete a blog post (requires authentication)
 * @param {string} slug - Post slug
 * @returns {Promise<boolean>} Success status
 */
export async function deletePost(slug) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', slug);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

/**
 * Get all posts including drafts (requires authentication)
 * @returns {Promise<Array>} Array of all blog posts
 */
export async function getAllPostsAdmin() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

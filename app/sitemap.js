import { fetchBlogSlugs, fetchProjectIds, fetchProjectSlugs } from '@/lib/api/supabase';

export default async function sitemap() {
  const baseUrl = 'https://arsudsandesh97.github.io';

  // Static routes
  const routes = [
    '',
    '/about',
    '/skills',
    '/experience',
    '/projects',
    '/education',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic blog routes
  const { data: blogPosts } = await fetchBlogSlugs();
  const blogRoutes = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic project routes (by ID)
  const { data: projectIds } = await fetchProjectIds();
  const projectRoutes = (projectIds || []).map((project) => ({
    url: `${baseUrl}/project/${project.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Dynamic project explanation routes (by Slug)
  const { data: projectSlugs } = await fetchProjectSlugs();
  const projectExplanationRoutes = (projectSlugs || []).map((project) => ({
    url: `${baseUrl}/project-explanation/${project.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes, ...projectRoutes, ...projectExplanationRoutes];
}

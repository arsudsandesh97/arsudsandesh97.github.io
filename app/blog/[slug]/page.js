import { fetchBlogSlugs, fetchSingleBlogPost } from "@/lib/api/supabase";
import BlogPostContent from './BlogPostContent';

// Force static generation only - don't allow dynamic params at runtime
export const dynamicParams = false;

// Generate static paths for all published blog posts
export async function generateStaticParams() {
  const { data: posts } = await fetchBlogSlugs();
  
  return (posts || [])
    .filter((post) => post.slug && post.slug.trim() !== '')
    .map((post) => ({
      slug: post.slug,
    }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await Promise.resolve(params);
  const { data: post } = await fetchSingleBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Sandesh Arsud',
      description: 'The requested blog post was not found.',
    };
  }

  return {
    title: `${post.title} | Sandesh Arsud`,
    description: post.excerpt || post.title,
    keywords: post.seo_keywords || post.tags || [],
    authors: [{ name: post.author || 'Sandesh Arsud' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author || 'Sandesh Arsud'],
      images: [
        {
          url: post.cover_image || 'https://arsudsandesh97.github.io/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [post.cover_image || 'https://arsudsandesh97.github.io/og-image.png'],
    },
  };
}

export default async function Page({ params }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await Promise.resolve(params);
  
  // Fetch the full post data server-side for instant loading (SSG)
  const { data: post } = await fetchSingleBlogPost(resolvedParams.slug);
  
  // Pass the slug and the initial post data to the client component
  return <BlogPostContent slug={resolvedParams.slug} initialPost={post} />;
}

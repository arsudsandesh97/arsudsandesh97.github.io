import { supabase } from '@/lib/supabase/client';
import BlogPostContent from './BlogPostContent';

// Force static generation only - don't allow dynamic params at runtime
// This is critical for static export (output: 'export' in next.config.js)
export const dynamicParams = false;

// Generate static paths for all published blog posts
export async function generateStaticParams() {
  console.log('=== Blog [slug] generateStaticParams START (Supabase) ===');
  
  try {
    // Fetch all published blog slugs directly from Supabase
    // This avoids issues with local file system access in CI environments
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);

    if (error) {
      console.error('Error fetching slugs from Supabase:', error);
      return [];
    }

    console.log(`Found ${posts?.length || 0} published posts`);
    
    const params = posts?.map((post) => ({
      slug: post.slug,
    })) || [];
    
    console.log('Generated params:', JSON.stringify(params, null, 2));
    return params;
  } catch (error) {
    console.error('Exception in generateStaticParams:', error);
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  try {
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    
    // Fetch post data directly from Supabase for metadata
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      console.error(`Error fetching post metadata for slug: ${slug}`, error);
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
  } catch (error) {
    console.error('Exception in generateMetadata:', error);
    return {
      title: 'Post Not Found | Sandesh Arsud',
      description: 'The requested blog post was not found.',
    };
  }
}

export default async function Page({ params }) {
  // Await params for Next.js 15+ compatibility and static generation
  const resolvedParams = await Promise.resolve(params);
  
  // Pass the slug to the client component
  return <BlogPostContent slug={resolvedParams.slug} />;
}

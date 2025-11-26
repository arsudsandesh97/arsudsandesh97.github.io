import { getAllBlogPosts } from '@/lib/supabase/blog';
import BlogPostContent from './BlogPostContent';

export async function generateStaticParams() {
  try {
    // Try to read from local JSON file generated during build
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'blogs.json');
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(fileContent);
      const posts = json.data || [];
      console.log(`✓ Found ${posts.length} blog posts for static generation`);
      return posts.map((post) => ({
        slug: post.slug,
      }));
    }
  } catch (error) {
    console.warn('Could not read local blogs.json, falling back to Supabase:', error.message);
  }

  // Fallback to Supabase
  const { posts } = await getAllBlogPosts(1000);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { getBlogPostBySlug } = await import('@/lib/supabase/blog');
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Sandesh Arsud`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: ['Sandesh Arsud'],
      images: [
        {
          url: post.cover_image || 'https://arsudsandesh97.github.io/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Page({ params }) {
  return <BlogPostContent />;
}

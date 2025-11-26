import { getAllBlogPosts } from '@/lib/supabase/blog';
import BlogPostContent from './BlogPostContent';

export async function generateStaticParams() {
  const { readFileSync, existsSync } = await import('fs');
  const { join } = await import('path');
  
  console.log('=== generateStaticParams for blog posts STARTED ===');
  console.log('CWD:', process.cwd());
  
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'blogs.json');
    console.log('Reading from:', filePath);
    console.log('File exists?', existsSync(filePath));
    
    const fileContent = readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);
    const posts = json.data || [];
    
    console.log('Blog posts found:', posts.length);
    console.log('Blog slugs:', posts.map(p => p.slug));
    
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    
    console.log('Returning params:', params);
    console.log('=== generateStaticParams for blog posts FINISHED ===');
    
    return params;
  } catch (error) {
    console.error('=== ERROR in generateStaticParams ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    return [];
  }
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

export default async function Page({ params }) {
  // Await params for Next.js 15+ compatibility and static generation
  const resolvedParams = await Promise.resolve(params);
  return <BlogPostContent slug={resolvedParams.slug} />;
}

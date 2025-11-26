import fs from 'fs';
import path from 'path';
import BlogPostContent from './BlogPostContent';

// Force static generation only - don't allow dynamic params at runtime
// This is critical for static export (output: 'export' in next.config.js)
export const dynamicParams = false;

// This function generates static paths for all blog posts at build time
export async function generateStaticParams() {
  console.log('=== Blog [slug] generateStaticParams START ===');
  
  try {
    // Read blogs data from the pre-generated JSON file
    const blogsPath = path.join(process.cwd(), 'public', 'data', 'blogs.json');
    console.log('Reading blogs from:', blogsPath);
    console.log('File exists:', fs.existsSync(blogsPath));
    
    if (!fs.existsSync(blogsPath)) {
      console.error('ERROR: blogs.json not found at:', blogsPath);
      console.error('Make sure to run npm run generate-json before building');
      return [];
    }
    
    const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
    const posts = blogsData.data || [];
    
    console.log(`Found ${posts.length} blog post(s)`);
    
    // Filter only published posts
    const publishedPosts = posts.filter(post => post.published === true);
    console.log(`${publishedPosts.length} published post(s)`);
    
    // Generate params for each published post
    const params = publishedPosts.map(post => {
      console.log(`  - Generating static page for slug: "${post.slug}"`);
      return {
        slug: post.slug,
      };
    });
    
    console.log('Generated static params:', JSON.stringify(params, null, 2));
    console.log('=== Blog [slug] generateStaticParams END ===');
    
    return params;
  } catch (error) {
    console.error('=== FATAL ERROR in generateStaticParams ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Return empty array to prevent build failure, but log the error
    return [];
  }
}

// Generate metadata for each blog post page
export async function generateMetadata({ params }) {
  try {
    // Import the getBlogPostBySlug function
    const { getBlogPostBySlug } = await import('@/lib/supabase/blog');
    
    // Await params for Next.js 15+ compatibility
    const resolvedParams = await Promise.resolve(params);
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
      return {
        title: 'Post Not Found | Sandesh Arsud',
        description: 'The requested blog post was not found.',
      };
    }

    return {
      title: `${post.title} | Sandesh Arsud`,
      description: post.excerpt || post.title,
      keywords: post.seo_keywords?.join(', ') || post.tags?.join(', ') || '',
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
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Post Not Found | Sandesh Arsud',
      description: 'The requested blog post was not found.',
    };
  }
}

// Main page component
export default async function Page({ params }) {
  // Await params for Next.js 15+ compatibility and static generation
  const resolvedParams = await Promise.resolve(params);
  
  // Pass the slug to the client component
  return <BlogPostContent slug={resolvedParams.slug} />;
}

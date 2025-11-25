import { getAllBlogPosts } from '@/lib/supabase/blog';
import BlogPostContent from './BlogPostContent';

export async function generateStaticParams() {
  const { posts } = await getAllBlogPosts(1000);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Page({ params }) {
  return <BlogPostContent />;
}

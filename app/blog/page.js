import BlogClient from "./BlogClient";
import { getAllBlogPosts, getAllTags, getFeaturedPosts } from "@/lib/supabase/blog";

export const metadata = {
  title: "Blog | Sandesh Arsud",
  description:
    "Read thoughts, tutorials, and insights on web development, React, Next.js, and software engineering by Sandesh Arsud.",
  keywords: [
    "Blog",
    "Data Analytics",
    "Business Intelligence",
    "Power Bi",
    "SQL",
    "Sandesh Arsud Blog",
  ],
  openGraph: {
    title: "Blog | Sandesh Arsud",
    description:
      "Read thoughts, tutorials, and insights on web development, React, Next.js, and software engineering.",
    url: "https://arsudsandesh97.github.io/blog",
    siteName: "Sandesh Arsud Portfolio",
    type: "website",
  },
};

export default async function BlogPage() {
  // Fetch data in parallel server-side
  const [allPostsData, tagsData, featuredData] = await Promise.all([
    getAllBlogPosts(100, 0),
    getAllTags(),
    getFeaturedPosts(3)
  ]);

  return (
    <BlogClient 
      initialPosts={allPostsData?.posts || []}
      initialTags={tagsData || []}
      initialFeatured={featuredData || []}
    />
  );
}

import BlogClient from "./BlogClient";
import { fetchAllBlogPosts, fetchAllTags, fetchFeaturedPosts } from "@/lib/api/supabase";

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
    fetchAllBlogPosts(100, 0),
    fetchAllTags(),
    fetchFeaturedPosts(3)
  ]);

  return (
    <BlogClient 
      initialPosts={allPostsData?.posts || []}
      initialTags={tagsData || []}
      initialFeatured={featuredData || []}
    />
  );
}

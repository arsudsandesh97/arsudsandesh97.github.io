import BlogClient from "./BlogClient";

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

export default function BlogPage() {
  return <BlogClient />;
}

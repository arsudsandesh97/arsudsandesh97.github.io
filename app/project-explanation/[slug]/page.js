import ProjectExplanationContent from "./ProjectExplanationContent";
import { fetchProjectSlugs } from "@/lib/api/supabase";

export async function generateStaticParams() {
  const { data: slugs } = await fetchProjectSlugs();
  return (slugs || []).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  // Fetch the project data (not explanation) for metadata
  const { fetchProjectBySlug } = await import('@/lib/api/supabase');
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const { data: project } = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Project Explanation`,
    description: project.description || `Detailed explanation of ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.description || `Detailed explanation of ${project.title}`,
      type: 'article',
      images: [
        {
          url: project.image || 'https://arsudsandesh97.github.io/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProjectExplanationPage({ params }) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  // Fetch data server-side for instant loading
  const { fetchProjectBySlug, fetchProjectExplanation } = await import('@/lib/api/supabase');
  
  const { data: project } = await fetchProjectBySlug(slug);
  
  if (!project) {
      return <div>Project not found</div>;
  }

  const { data: explanation } = await fetchProjectExplanation(project.id);

  return (
    <ProjectExplanationContent 
      id={project.id} 
      initialProject={project}
      initialExplanation={explanation}
    />
  );
}

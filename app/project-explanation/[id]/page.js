import ProjectExplanationContent from "./ProjectExplanationContent";
import { fetchProjectIds } from "@/lib/api/supabase";

export async function generateStaticParams() {
  const { data: projects } = await fetchProjectIds();
  return (projects || []).map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const { getProjectExplanation } = await import('@/lib/api/server-fetch');
  const project = await getProjectExplanation(params.id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Project Explanation`,
    description: project.short_description || `Detailed explanation of ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.short_description || `Detailed explanation of ${project.title}`,
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

export default function ProjectExplanationPage({ params }) {
  return <ProjectExplanationContent id={params.id} />;
}

import ProjectExplanationContent from "./ProjectExplanationContent";
import { fetchProjectIds } from "@/lib/api/supabase";

export async function generateStaticParams() {
  const { data: projects } = await fetchProjectIds();
  return (projects || []).map((project) => ({
    id: project.id,
  }));
}

export default function ProjectExplanationPage({ params }) {
  return <ProjectExplanationContent id={params.id} />;
}

import { fetchProjectIds } from "@/lib/api/supabase";
import ProjectContent from "./ProjectContent";

export async function generateStaticParams() {
  const { data: projects } = await fetchProjectIds();
  return (projects || []).map((project) => ({
    id: project.id,
  }));
}

export default function ProjectPage({ params }) {
  return <ProjectContent id={params.id} />;
}

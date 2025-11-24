import { fetchSingleProject, fetchProjectExplanation, fetchProjectIds } from "@/lib/api/supabase";
import ProjectExplanationContent from "./ProjectExplanationContent";

export async function generateStaticParams() {
  const { data: projects } = await fetchProjectIds();
  return (projects || []).map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectExplanationPage({ params }) {
  const { id } = params;
  let project = null;
  let markdownContent = "";
  let error = null;

  try {
    const [projectResult, explanationResult] = await Promise.all([
      fetchSingleProject(id),
      fetchProjectExplanation(id)
    ]);

    if (projectResult.error || !projectResult.data) {
      error = "Project not found";
    } else {
      project = projectResult.data;
      
      if (explanationResult.error || !explanationResult.data) {
        error = "No detailed explanation available for this project yet";
      } else {
        markdownContent = explanationResult.data.markdown_content;
      }
    }
  } catch (err) {
    error = err.message || "An error occurred";
  }

  return (
    <ProjectExplanationContent 
      project={project} 
      markdownContent={markdownContent} 
      error={error} 
    />
  );
}

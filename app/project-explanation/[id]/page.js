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
    console.log(`[ProjectExplanationPage] Fetching data for ID: ${id}`);
    const [projectResult, explanationResult] = await Promise.all([
      fetchSingleProject(id),
      fetchProjectExplanation(id)
    ]);

    console.log(`[ProjectExplanationPage] Project found: ${!!projectResult.data}, Error: ${projectResult.error?.message}`);
    console.log(`[ProjectExplanationPage] Explanation found: ${!!explanationResult.data}, Error: ${explanationResult.error?.message}`);

    if (projectResult.error || !projectResult.data) {
      console.error("[ProjectExplanationPage] Project fetch failed:", projectResult.error);
      error = "Project not found";
    } else {
      project = projectResult.data;
      
      if (explanationResult.error || !explanationResult.data) {
        console.warn("[ProjectExplanationPage] Explanation fetch failed or empty:", explanationResult.error);
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

import DashboardView from "./DashboardView";
import { fetchDashboards } from "@/lib/api/supabase";

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  const { data: dashboards } = await fetchDashboards();
  const dashboard = dashboards?.find((d) => d.slug === slug);
  
  if (dashboard) {
    return {
      title: `${dashboard.title} | Sandesh Arsud`,
      description: dashboard.description,
      openGraph: {
        title: dashboard.title,
        description: dashboard.description,
        images: dashboard.image_url ? [dashboard.image_url] : [],
      },
    };
  }

  return {
    title: "Dashboard | Sandesh Arsud",
    description: "Interactive Power BI Dashboard",
  };
}

export default async function DashboardPage({ params }) {
  const { slug } = params;
  
  const { data: dashboards } = await fetchDashboards();
  const dashboard = dashboards?.find((d) => d.slug === slug);

  return <DashboardView dashboard={dashboard} />;
}

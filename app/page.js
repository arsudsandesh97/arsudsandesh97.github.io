import HomeClient from "./HomeClient";
import { 
  fetchBioData, 
  fetchSkillsWithCategories, 
  fetchExperiences, 
  fetchProjects, 
  fetchEducation 
} from "@/lib/api/supabase";

export const metadata = {
  title: "Sandesh Arsud | Data Analyst",
  description:
    "Portfolio of Sandesh Arsud, a Data Analyst specializing in Power Bi and SQL. View my projects, skills, and experience.",
  keywords: [
    "Sandesh Arsud",
    "Data Analyst",
    "Data Science Enthusiast",
    "Data Enthusiast",
    "Engineer",
    "Sandesh Arsud Portfolio",
    "Sandesh Portfolio",
    "Arsud",
    "Data Analytics",
    "Business Intelligence",
    "Power Bi",
    "SQL"
  ],
  openGraph: {
    title: "Sandesh Arsud | Data Analyst",
    description:
      "Portfolio of Sandesh Arsud, a Data Analyst specializing in Power Bi and SQL.",
    url: "https://arsudsandesh97.github.io",
    siteName: "Sandesh Arsud Portfolio",
    images: [
      {
        url: "https://arsudsandesh97.github.io/og-image.png", // Ensure this exists or use a profile image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function Home() {
  // Fetch all data in parallel for performance
  const [
    { data: bioData },
    { data: skills },
    { data: experience },
    { data: projects },
    { data: education }
  ] = await Promise.all([
    fetchBioData(),
    fetchSkillsWithCategories(),
    fetchExperiences(),
    fetchProjects(),
    fetchEducation()
  ]);

  return (
    <HomeClient 
      bioData={bioData} 
      skills={skills}
      experience={experience}
      projects={projects}
      education={education}
    />
  );
}

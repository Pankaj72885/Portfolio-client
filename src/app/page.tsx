"use client";

import { Header } from "@/components/layout/header";
import { QueryProvider } from "@/components/providers/query-provider";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { experienceApi, profileApi, projectsApi, skillsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

function PortfolioContent() {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await profileApi.get();
        return response.data.profile;
      } catch {
        return null;
      }
    },
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      try {
        const response = await skillsApi.getAll();
        return response.data.skills;
      } catch {
        return [];
      }
    },
  });

  const { data: experienceData, isLoading: experienceLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      try {
        const response = await experienceApi.getAll();
        return response.data.experiences;
      } catch {
        return [];
      }
    },
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await projectsApi.getAll();
        return response.data.projects;
      } catch {
        return [];
      }
    },
  });

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <HeroSection
        name={profileData?.name}
        designation={profileData?.designation}
        bio={profileData?.bio}
        resumeUrl={profileData?.resumeUrl}
        socialLinks={profileData?.socialLinks}
      />
      <SkillsSection skills={skillsData} isLoading={skillsLoading} />
      <ExperienceSection
        experiences={experienceData}
        isLoading={experienceLoading}
      />
      <ProjectsSection projects={projectsData} isLoading={projectsLoading} />
      <ContactSection
        email={profileData?.email}
        phone={profileData?.phone}
        location="Bangladesh"
      />
      <Footer name={profileData?.name} socialLinks={profileData?.socialLinks} />
    </main>
  );
}

export default function HomePage() {
  return (
    <QueryProvider>
      <PortfolioContent />
    </QueryProvider>
  );
}

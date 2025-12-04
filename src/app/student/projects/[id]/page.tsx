"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectDetailsPanel from "./ProjectDetailsPanel";

interface ExpertProject {
  id: string;
  title: string;
  description: string;
  stack?: string;
  status?: string;
  expertName?: string;
  companyName?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
  matchScore?: number;
  isRequested?: boolean;
}

const ProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ExpertProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return <div className="text-white p-10 text-center">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-red-500 p-10 text-center">Project not found.</div>;
  }

  return (
    <ProjectDetailsPanel
      project={project}
      onClose={() => router.back()} // or any other navigation
    />
  );
};

export default ProjectPage;

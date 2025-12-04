'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  FaUser, FaCalendarAlt, FaTools, FaCheckCircle, FaClock, FaLink, 
  FaChartBar, FaExclamationTriangle
} from "react-icons/fa";

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
  startDate: string;
  endDate: string;
  studentName: string;
  link: string;
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      const token = localStorage.getItem("jwtToken");

      try {
        setLoading(true);
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          throw new Error('Failed to fetch project details');
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-green-400 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-xl font-semibold">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg">
          <FaExclamationTriangle className="text-yellow-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-300 p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 bg-purple-500 w-24 h-24 rounded-full blur-3xl opacity-10 animate-pulse"></div>

      {/* Header */}
      <header className="text-center mb-12 relative">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          {project.title}
        </h1>
        <p className="text-lg text-gray-400 mt-3 italic">
          An insightful overview of the project journey
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {/* Description */}
        <section className="bg-gray-800 rounded-lg shadow-md p-6 mb-10 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Project Description
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* Project Details */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-green-300 mb-6">Project Details</h2>
          <div className="space-y-6">
              {/* Student Name */}
              <div className="flex items-center space-x-4">
                <FaUser className="text-green-400 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="text-lg font-semibold">{project.studentName}</p>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="flex items-center space-x-4">
                <FaTools className="text-yellow-400 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Technology Stack</p>
                  <p className="text-lg font-semibold">{project.stack}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4">
                <FaCheckCircle
                  className={`text-2xl ${
                    project.status === "Completed"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`text-lg font-semibold ${
                      project.status === "Completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-center space-x-4">
                <FaCalendarAlt className="text-blue-400 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-lg font-semibold">{project.startDate}</p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-center space-x-4">
                <FaClock className="text-red-400 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-lg font-semibold">{project.endDate}</p>
                </div>
              </div>

              {/* Project Link */}
              <div className="flex items-center space-x-4">
                <FaLink className="text-purple-400 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Project Link</p>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-400 hover:underline"
                  >
                    {project.link}
                  </a>
                </div>
              </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500">
        <p>&copy; 2025 Project Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProjectDetailsPage;


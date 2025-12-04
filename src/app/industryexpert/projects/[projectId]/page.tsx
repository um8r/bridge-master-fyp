"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUser, FaCalendarAlt, FaTools, FaCheckCircle, FaClock } from "react-icons/fa";

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
  startDate: string;
  endDate: string;
  studentName: string;
  budget?: number; // Added if expert needs budget info
  expertName?: string; // Added if expert details are part of the API response
}

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("Unauthorized");
        }

        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch project details.");

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <span className="text-xl font-semibold animate-pulse">Loading project details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <span className="text-red-500 text-xl">{error}</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300">
        <span className="text-gray-500 text-xl">Project not found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100text-gray-300 p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-400">{project.title}</h1>
        <p className="text-lg text-gray-400 mt-3 italic">
          A detailed overview of the project.
        </p>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-2xl font-bold text-green-300 mb-4">Project Description</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Project Details */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

          {/* Budget (if available) */}
          {project.budget && (
            <div className="flex items-center space-x-4">
              <FaTools className="text-purple-400 text-2xl" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-lg font-semibold">${project.budget}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-105">
            See on GitHub (Update API for GitHub link)
          </button>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 bg-green-500 w-16 h-16 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 left-10 bg-blue-500 w-20 h-20 rounded-full blur-3xl opacity-20"></div>
    </div>
  );
};

export default ProjectDetailsPage;

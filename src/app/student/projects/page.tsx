"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaCheckCircle, FaSpinner, FaPlus } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  status: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const userRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const studentRes = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userData.userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (studentRes.ok) {
            const studentData = await studentRes.json();
            const projectRes = await fetch(
              `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-projects-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (projectRes.ok) {
              const projectsData = await projectRes.json();
              setProjects(projectsData);
            } else {
              toast.error("Failed to load projects.", { position: "top-center" });
            }
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleCardClick = (id: string) => {
    router.push(`/student/projects/personal/${id}`);
  };

  const handleCreateProject = () => {
    router.push("/student/projects/create");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl text-blue-600"
        >
          <FaSpinner />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-700">My Innovative Projects</h1>
          <button
            onClick={handleCreateProject}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            <FaPlus />
            New Project
          </button>
        </motion.div>

        {projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleCardClick(project.id)}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-200 group"
              >
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">
                  {project.status}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <FaCode className="text-blue-400" />
                  <span>{project.stack}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <FaCheckCircle className="text-green-400" />
                  <span>{project.status}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-gray-600 text-lg"
          >
            No projects yet. Start by creating your first!
          </motion.p>
        )}
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-24 right-10 text-blue-400 opacity-10 animate-pulse">
        <FaRocket size={90} />
      </div>
      <div className="absolute bottom-24 left-10 text-purple-500 opacity-10 animate-pulse">
        <FaCode size={90} />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProjectsPage;

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Props {
  projects: Project[];
}

const CompletedProjectsSection: React.FC<Props> = ({ projects }) => {
  const router = useRouter();

  const handleCardClick = (projectId: string) => {
    router.push(`/student/projects/personal/${projectId}`);
  };

  return (
    <section className="py-16 bg-gray-200">
      <div className="max-w-7xl mx-auto mb-12 px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
          Completed Personal Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-gray-300 p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-3">
                {project.title}
              </h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="text-left mt-auto space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-medium">Status:</span>&nbsp;Completed
                </p>
              </div>
              <div className="mt-4 text-right">
                <span className="text-blue-600 hover:text-blue-500 flex items-center justify-end text-sm font-medium transition">
                  View Details
                  <ChevronRight className="ml-1 w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No completed personal projects available.
          </p>
        )}
      </div>
    </section>
  );
};

export default CompletedProjectsSection;

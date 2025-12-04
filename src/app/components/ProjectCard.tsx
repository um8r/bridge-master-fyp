import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-green-500 mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default ProjectCard;

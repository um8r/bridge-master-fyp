import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description }) => {
  const imageSrc = "/image.png"; // Replace with your actual image source

  return (
    <div className="flex bg-gray-800 rounded-xl shadow-lg p-8 mb-8 w-full border border-gray-700 hover:border-green-500 transition-colors duration-200">
      <div className="mr-8">
        <img src={imageSrc} alt="Project illustration" className="w-36 h-36 object-cover rounded-lg shadow-md" />
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div className="text-right">
          <h3 className="text-2xl font-semibold text-green-500 mb-4">{title}</h3>
          <p className="text-gray-300 mb-4">{description}</p>
        </div>
        <div className="text-right">
          <button className="py-2 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition duration-200">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

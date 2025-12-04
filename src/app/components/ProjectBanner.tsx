import React from "react";

const ProjectsBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-center text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-no-repeat bg-cover" style={{ backgroundImage: `url('/path-to-banner-image.png')` }}></div>
      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold mb-2">My Projects</h2>
        <p className="text-lg">Here are some of the projects Ive completed. Click on  Learn More to dive deeper!</p>
      </div>
    </div>
  );
};

export default ProjectsBanner;

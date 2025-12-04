"use client";

import React from "react";

interface Idea {
  id: string;
  title: string;
  technology: string;
  description: string;
  facultyName: string;
  email: string;
  uniName: string;
}

interface IdeasSectionProps {
  ideas: Idea[];
  sectionTitle?: string; 
  onIdeaClick?: (ideaId: string) => void; 
}

const IdeasSection: React.FC<IdeasSectionProps> = ({
  ideas,
  sectionTitle = "Ideas",
  onIdeaClick,
}) => {
  if (!ideas || ideas.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded shadow text-gray-300 mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">{sectionTitle}</h2>
        <p className="text-gray-400">No ideas found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold text-green-300 mb-4">{sectionTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            onClick={() => onIdeaClick && onIdeaClick(idea.id)}
            className="p-4 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition"
          >
            <h3 className="text-lg font-bold text-green-200">{idea.title}</h3>
            <p className="text-sm text-green-400">Technology: {idea.technology}</p>
            <p className="mt-2 text-gray-300">{idea.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Faculty: {idea.facultyName} ({idea.email})
            </p>
            <p className="text-xs text-gray-400">
              University: {idea.uniName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasSection;

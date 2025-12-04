import React from 'react';

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
  imageSrc?: string; 
}

interface ResearchWorkProps {
  papers: ResearchPaper[];
}

const ResearchWork: React.FC<ResearchWorkProps> = ({ papers }) => {
  return (
    <div className="p-6 mb-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-500 mb-6 text-center">Research Work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper.id} className="flex items-center bg-gray-100 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{paper.paperName}</h3>
                <p className="text-gray-400 mb-2">{paper.category}</p>
                <p className="text-gray-500">Publish Channel: {paper.publishChannel}</p>
                <p className="text-gray-500">Year of Publish: {paper.yearOfPublish}</p>
                <p className="text-green-400 mt-2">
                  <a href={paper.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    View Publication
                  </a>
                </p>
                <p className="text-gray-500 mt-2">Other Researchers: {paper.otherResearchers}</p>
              </div>
              {paper.imageSrc && (
                <div className="ml-4">
                  <img src={paper.imageSrc} alt={paper.paperName} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No research papers available.</p>
        )}
      </div>
    </div>
  );
};

export default ResearchWork;

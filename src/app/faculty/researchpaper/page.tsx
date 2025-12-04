"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Calendar, Users, ExternalLink, Award } from "lucide-react";

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}


const FacultyResearchWorkPage: React.FC = () => {
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const uniImage ="/unknown.jpg";
  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyAndResearchPapers() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.userId;

          const facultyResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();
            const facultyId = facultyData.id;

            const researchResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ResearchWork/get-researchwork-by-id/${facultyId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData);
            } else {
              console.error("Failed to fetch research papers");
            }
          } else {
            console.error("Failed to fetch faculty information");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to fetch user information");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyAndResearchPapers();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('${uniImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gray-100 opacity-90"></div>
      <div className="relative z-10 p-6 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-12 text-center">Research Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {researchPapers.length > 0 ? (
            researchPapers.map((paper) => (
              <div key={paper.id} className="bg-gray-200 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 transform border border-gray-300 group">
                <div className="relative">
                  <Award className="absolute top-0 right-0 w-8 h-8 text-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-4 pr-10">{paper.paperName}</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 flex items-center bg-gray-100 rounded-lg p-2 group-hover:bg-gray-200 transition-colors duration-300">
                    <Book className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-blue-700 font-semibold mr-2">Category:</span> {paper.category}
                  </p>
                  <p className="text-gray-700 flex items-center bg-gray-100 rounded-lg p-2 group-hover:bg-gray-200 transition-colors duration-300">
                    <ExternalLink className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-blue-700 font-semibold mr-2">Publish Channel:</span> {paper.publishChannel}
                  </p>
                  <p className="text-gray-700 flex items-center bg-gray-100 rounded-lg p-2 group-hover:bg-gray-200 transition-colors duration-300">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-blue-700 font-semibold mr-2">Year of Publish:</span> {paper.yearOfPublish}
                  </p>
                  <p className="text-blue-500 flex items-center bg-gray-100 rounded-lg p-2 group-hover:bg-gray-200 transition-colors duration-300">
                    <ExternalLink className="w-5 h-5 mr-3" />
                    <span className="font-semibold mr-2 text-blue-700">Publication:</span>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 underline hover:text-blue-400 transition-colors duration-300"
                    >
                      View Paper
                    </a>
                  </p>
                  <p className="text-gray-700 flex items-start bg-gray-100 rounded-lg p-2 group-hover:bg-gray-200 transition-colors duration-300">
                    <Users className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                    <span>
                      <span className="text-blue-700 font-semibold">Other Researchers:</span> {paper.otherResearchers}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full text-xl">No research papers available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyResearchWorkPage;
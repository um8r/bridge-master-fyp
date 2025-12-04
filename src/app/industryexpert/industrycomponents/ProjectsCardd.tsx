"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  projectId: string; 
  title: string;
  description: string;
  endDate: string;
}

interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  title,
  description,
  endDate,
}) => {
  const router = useRouter();

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // You might need an Authorization header if the endpoint requires it
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`
        );

        if (!response.ok) throw new Error("Failed to fetch project details.");

        const data = await response.json();
        if (data.studentId) {
          setStudentDetails({
            studentId: data.studentId,
            firstName: data.studentName.split(" ")[0],
            lastName: data.studentName.split(" ")[1] || "",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [projectId]);

  // Navigate to a page showing milestone progress
  const handleViewMilestones = () => {
    // If you'd like to pass an expertId, do something like:
    // const expertId = localStorage.getItem("expertId") || "<some-other-source>";
    // router.push(`/industryexpert/projects/milestone/${projectId}?expertId=${expertId}`);

    router.push(`/industryexpert/projects/milestone/${projectId}`);
  };

  // Optional: Navigate to student profile
  const handleViewStudentProfile = () => {
    if (studentDetails?.studentId) {
      router.push(`/industryexpert/student-profile/${studentDetails.studentId}`);
    }
  };

  // A few random background gradients for visual variety
  const gradientStyles = [
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    "bg-gradient-to-r from-green-400 via-blue-500 to-purple-500",
    "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
  ];

  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden cursor-pointer ${
        gradientStyles[Math.floor(Math.random() * gradientStyles.length)]
      }`}
    >
      <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
      <div className="relative z-10">
        {/* Project Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

        {/* Project Description */}
        <p className="text-gray-200 mb-2">{description}</p>

        {/* End Date */}
        <p className="text-gray-300 mb-1">
          <strong>End Date:</strong> {endDate}
        </p>

        {/* Student Details */}
        {loading ? (
          <p className="text-gray-300">Loading student details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : studentDetails ? (
          <div className="mb-4">
            <p className="text-gray-300">
              <strong>Assigned Student:</strong>{" "}
              {studentDetails.firstName} {studentDetails.lastName}
            </p>
          </div>
        ) : (
          <p className="text-gray-300 mb-4">No student assigned</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleViewMilestones}
            className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            View Progress
          </button>
          {studentDetails && (
            <button
              onClick={handleViewStudentProfile}
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              View Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

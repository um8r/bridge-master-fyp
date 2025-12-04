"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface StudentDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  department: string;
  skills: string[];
  address: string;
  rollNumber: string;
  imageData: string | null;
  uniImage: string | null; // The university image
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

const StudentProfilePage: React.FC = () => {
  const { userId } = useParams();
  const router = useRouter();

  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch both student details & personal projects
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          router.push("/auth/login-user");
          return;
        }

        // 1) Fetch student details
        const studentResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-student-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!studentResponse.ok) throw new Error("Failed to fetch student details.");
        const studentData = await studentResponse.json();
        setStudentDetails(studentData);

        // 2) Fetch student's personal projects
        const projectsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-projects-by-id/${studentData.id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!projectsResponse.ok) throw new Error("Failed to fetch student projects.");
        const projectData = await projectsResponse.json();
        setProjects(projectData);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId, router]);

  // Handle navigation to a specific personal project
  const handleProjectClick = (projectId: string) => {
    // Adjust the route below as needed, or remove if not required
    router.push(`/industryexpert/projects/${projectId}`);
  };

  // Utility to format image data as a proper data URI if needed
  const formatImageSrc = (imageData: string | null) =>
    imageData
      ? imageData.startsWith("data:image")
        ? imageData
        : `data:image/jpeg;base64,${imageData}`
      : "/default-profile.jpg";

  // Fallback text
  const notAvailable = (value: string | undefined) =>
    value ? value : "Not Available";

  // Loading / Error states
  if (loading) {
    return <p className="text-gray-300">Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  if (!studentDetails) {
    return <p className="text-gray-300">No student found</p>;
  }

  // Use the university image as a background if available
  const backgroundImage = studentDetails.uniImage
    ? formatImageSrc(studentDetails.uniImage)
    : "/default-profile.jpg"; // fallback background if no uniImage

  return (
    <div
      className="min-h-screen relative overflow-hidden text-gray-200 p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dim & Blur Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-purple-300">
            {studentDetails.firstName} {studentDetails.lastName}
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            {notAvailable(studentDetails.email)}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Panel: Profile Image & Basic Info */}
          <motion.div
            className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Image */}
            <motion.div
              className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={formatImageSrc(studentDetails.imageData)}
                alt={`${studentDetails.firstName} ${studentDetails.lastName}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Basic Contact Info */}
            <AnimatePresence>
              <motion.div
                className="text-center md:text-left space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {studentDetails.description && (
                  <p className="text-sm text-gray-300 italic mt-2">
                    {notAvailable(studentDetails.description)}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Panel: University/Student Info, Skills, and Projects */}
          <motion.div
            className="w-full md:w-2/3 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* University + Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Info */}
              <motion.div
                className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
                }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-bold text-purple-400 mb-2">
                  University Details
                </h2>
                <p className="text-sm text-gray-300">
                  University:{" "}
                  <span className="font-medium">
                    {notAvailable(studentDetails.universityName)}
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  Department:{" "}
                  <span className="font-medium">
                    {notAvailable(studentDetails.department)}
                  </span>
                </p>
                <p className="text-sm text-gray-300">
                  Address:{" "}
                  <span className="font-medium">
                    {notAvailable(studentDetails.address)}
                  </span>
                </p>
              </motion.div>

              {/* Roll Number / Additional Student Info */}
              <motion.div
                className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
                }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-bold text-blue-400 mb-2">
                  Student Details
                </h2>
                <p className="text-sm text-gray-300">
                  Roll Number:{" "}
                  <span className="font-medium">
                    {notAvailable(studentDetails.rollNumber)}
                  </span>
                </p>
              </motion.div>
            </div>

            {/* Skills Section */}
            {studentDetails.skills && studentDetails.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-purple-300 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {studentDetails.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="inline-block bg-purple-700 bg-opacity-30 text-purple-200 py-1 px-3 rounded-full shadow-sm text-sm font-medium"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(168, 85, 247, 0.5)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

         

            {/* Personal Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-purple-300 mt-6 mb-4">
                Personal Projects
              </h2>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                      onClick={() => handleProjectClick(project.id)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <h3 className="text-lg font-bold text-green-400 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {project.description}
                      </p>
                      <div className="mt-4 text-right text-blue-400 text-sm flex items-center justify-end">
                        View Details
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No personal projects found.</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;

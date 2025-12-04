"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaRocket, FaUsers, FaCode, FaCalendarAlt } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

const CreateResearchPaperPage = () => {
  const uniImage = "/unknown.jpg"; // Set default value directly
  const [paperName, setPaperName] = useState("");
  const [category, setCategory] = useState("");
  const [publishChannel, setPublishChannel] = useState("");
  const [otherResearchers, setOtherResearchers] = useState("");
  const [link, setLink] = useState("");
  const [yearOfPublish, setYearOfPublish] = useState("");
  const router = useRouter();
  useEffect(() => {
    async function authorizeUserAndFetchFacultyId() {
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
            localStorage.setItem("facultyId", facultyData.id);
          } else {
            console.error("Failed to fetch faculty details.");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to authorize user.");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        router.push("/unauthorized");
      }
    }

    authorizeUserAndFetchFacultyId();
  }, [router]);

  const handleCreateResearchPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const facultyId = localStorage.getItem("facultyId");
    const token = localStorage.getItem("jwtToken");

    if (!facultyId || !token) {
      console.error("Faculty ID or token is missing");
      return;
    }

    try {
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ResearchWork/add-researchpaper", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperName,
          category,
          publishChannel,
          otherResearchers,
          link,
          yearOfPublish,
          facultyId,
        }),
      });

      if (response.ok) {
        console.log("Research paper created successfully");
        router.push("/faculty");
      } else {
        const errorText = await response.text();
        console.error("Failed to create research paper:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error creating research paper:", error);
    }
  };

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
      <div className="relative z-10 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-blue-800/20"
        >
          <div className="absolute top-4 left-8 z-10">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-8 text-center">
            Create New Research Paper
          </h1>

          <form onSubmit={handleCreateResearchPaper} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Paper Name</label>
                <input
                  type="text"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Research Paper Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Category"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Channel</label>
                <input
                  type="text"
                  value={publishChannel}
                  onChange={(e) => setPublishChannel(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Publish Channel"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Other Researchers</label>
                <input
                  type="text"
                  value={otherResearchers}
                  onChange={(e) => setOtherResearchers(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Other Researchers"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  placeholder="Publication Link"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Publish</label>
                <input
                  type="date"
                  value={yearOfPublish}
                  onChange={(e) => setYearOfPublish(e.target.value)}
                  className="w-full p-3 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(30, 64, 175, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
              >
                Create Research Paper
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Premium Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 right-10 text-blue-600"
        >
          <FaRocket size={100} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-20 left-10 text-blue-600"
        >
          <FaCode size={100} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-5 text-blue-600"
        >
          <FaUsers size={80} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 right-20 text-blue-600"
        >
          <FaCalendarAlt size={80} />
        </motion.div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateResearchPaperPage
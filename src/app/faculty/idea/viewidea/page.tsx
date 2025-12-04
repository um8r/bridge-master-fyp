"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaLightbulb,
  FaRocket,
  FaCode,
  FaUsers,
  FaUniversity,
} from "react-icons/fa";

interface FacultyProfileData {
  id: string;
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string;
  description: string;
  department: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string;
  role: string;
}

interface Idea {
  id: string;
  title: string;
  technology: string;
  description: string;
  facultyName: string;
  email: string;
  uniName: string;
}

const FacultyIdeasPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] =
    useState<FacultyProfileData | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ── fetch profile + ideas ─────────────────────── */
  useEffect(() => {
    async function fetchProfileAndIdeas() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Please log in to access this page.", { autoClose: 3000 });
        router.push("/auth/login-user");
        return;
      }

      try {
        const authRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!authRes.ok) throw new Error("Authorization failed.");
        const { userId, role } = await authRes.json();

        const facRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facRes.ok) throw new Error("Faculty fetch failed.");
        const fac = await facRes.json();

        setFacultyProfile({
          ...fac,
          role,
        });

        const ideasRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-ideas-by-faculty-id/${fac.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!ideasRes.ok)
          throw new Error(await ideasRes.text() || "Ideas fetch failed.");
        setIdeas(await ideasRes.json());
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Unexpected error.",
          { autoClose: 3000 }
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndIdeas();
  }, [router]);

  const handleIdeaClick = (id: string) => router.push(`/faculty/idea/${id}`);

  if (loading)
    return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/unknown.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gray-100 opacity-90" />

      <div className="relative z-10 flex flex-col items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-blue-800/20"
        >
          <div className="absolute top-4 left-8">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={70} height={70} />
          </div>

          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-8">
            <FaLightbulb className="text-blue-600" />
            My&nbsp;Ideas
          </h1>

          {/* faculty info (avatar removed) */}
          {facultyProfile && (
            <div className="mb-10 space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">
                {facultyProfile.firstName} {facultyProfile.lastName}
              </h2>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                <FaUniversity /> {facultyProfile.universityName}
              </p>
              <p className="text-gray-600">{facultyProfile.department}</p>
              <p className="text-gray-600">{facultyProfile.email}</p>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Ideas</h2>
          {ideas.length ? (
            <div className="space-y-6">
              {ideas.map((idea) => (
                <motion.div
                  key={idea.id}
                  onClick={() => handleIdeaClick(idea.id)}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.25)" }}
                  className="cursor-pointer p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-blue-800/10"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Technology: {idea.technology}
                  </p>
                  <p className="mt-2 text-gray-700">{idea.description}</p>
                  <p className="text-sm text-gray-600 mt-3">
                    Faculty: {idea.facultyName} ({idea.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    University: {idea.uniName}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No ideas found for this faculty.</p>
          )}
        </motion.div>

        {/* decorative icons */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-24 right-12 text-blue-600"
        >
          <FaRocket size={90} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-24 left-10 text-blue-600"
        >
          <FaCode size={90} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-6 text-blue-600"
        >
          <FaUsers size={70} />
        </motion.div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default FacultyIdeasPage;

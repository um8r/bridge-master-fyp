"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaRocket, FaUsers, FaCode, FaCalendarAlt } from "react-icons/fa";

interface FacultyData {
  firstName: string;
  lastName: string;
  email: string;
  post: string;
  interest: string[];
  description: string;
  department: string;
  universityName: string;
  address: string;
  uniId: string;
}

const UpdateFacultyPage: React.FC = () => {
  /* ──────────────────────────────
     state
  ────────────────────────────── */
  const [facultyData, setFacultyData] = useState<FacultyData>({
    firstName: "",
    lastName: "",
    email: "",
    post: "",
    interest: [],
    description: "",
    department: "",
    universityName: "",
    address: "",
    uniId: "",
  });
  const [loading, setLoading]   = useState(false);
  const [userId, setUserId]     = useState<string | null>(null);
  const router                  = useRouter();

  /* ──────────────────────────────
     fetch existing profile
  ────────────────────────────── */
  useEffect(() => {
    async function fetchFacultyData() {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        /* 1️⃣ authorized‑user (get userId) */
        const authRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!authRes.ok) throw new Error("profile fetch failed");
        const { userId } = await authRes.json();
        setUserId(userId);

        /* 2️⃣ faculty details */
        const facRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facRes.ok) throw new Error("faculty fetch failed");
        const data = await facRes.json();

        setFacultyData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          post: data.post || "",
          interest: data.interest || [],
          description: data.description || "",
          department: data.department || "",
          universityName: data.universityName || "",
          address: data.address || "",
          uniId: data.uniId || "",
        });
      } catch {
        toast.error("Failed to load faculty data.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }

    fetchFacultyData();
  }, []);

  /* ──────────────────────────────
     handlers
  ────────────────────────────── */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFacultyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacultyData({ ...facultyData, interest: e.target.value.split(",") });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User ID not found.", { position: "top-center", autoClose: 3000 });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/faculties/update-faculty/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: facultyData.firstName,
            lastName: facultyData.lastName,
            email: facultyData.email,
            post: facultyData.post,
            interest: facultyData.interest,
            description: facultyData.description,
            department: facultyData.department,
            universityName: facultyData.universityName,
            address: facultyData.address,
            universityId: facultyData.uniId,
          }),
        }
      );

      if (res.ok) {
        toast.success("Profile updated!", { position: "top-center", autoClose: 3000 });
        router.push("/faculty/profile");
      } else {
        const { message } = await res.json();
        throw new Error(message || "update failed");
      }
    } catch (err) {
      toast.error(`Failed to update: ${(err as Error).message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────────────────────
     render
  ────────────────────────────── */
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
      {/* dimmed overlay */}
      <div className="absolute inset-0 bg-gray-100 opacity-90" />

      {/* main content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-blue-800/20"
        >
          {/* logo */}
          <div className="absolute top-4 left-8">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} />
          </div>

          {/* heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-8 text-center">
            Update&nbsp;Profile
          </h1>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* first + last names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First&nbsp;Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={facultyData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last&nbsp;Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={facultyData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            {/* email + post */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={facultyData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post
                </label>
                <input
                  type="text"
                  name="post"
                  value={facultyData.post}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* interest */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interests&nbsp;(comma‑separated)
              </label>
              <input
                type="text"
                name="interest"
                value={facultyData.interest.join(",")}
                onChange={handleInterestChange}
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* submit */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(30,64,175,0.4)" }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-900 hover:to-blue-700 focus:ring-2 focus:ring-blue-600"
              >
                {loading ? "Updating..." : "Update Profile"}
              </motion.button>
            </div>
          </form>

          {/* back button */}
          <button
            onClick={() => router.push("/faculty/profile")}
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-400 hover:to-purple-500 transition"
          >
            Back&nbsp;to&nbsp;Profile
          </button>
        </motion.div>

        {/* ── decorative icons (subtle, looping) ───────── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-24 right-10 text-blue-600"
        >
          <FaRocket size={100} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-24 left-10 text-blue-600"
        >
          <FaCode size={100} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-6 text-blue-600"
        >
          <FaUsers size={80} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-14 right-20 text-blue-600"
        >
          <FaCalendarAlt size={80} />
        </motion.div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default UpdateFacultyPage;

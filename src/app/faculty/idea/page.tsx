"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaLightbulb } from "react-icons/fa";

const CreateIdea: React.FC = () => {
  /* ── State ─────────────────────────────────────── */
  const [title, setTitle] = useState("");
  const [technology, setTechnology] = useState("");
  const [description, setDescription] = useState("");
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const router = useRouter();

  /* ── Technology options ─────────────────────────── */
  const technologyOptions = [
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "Internet of Things",
    "Game Development",
    "Augmented Reality",
    "Virtual Reality",
    "DevOps",
    "Big Data",
    "Robotics",
    "Natural Language Processing",
    "Computer Vision",
    "Quantum Computing",
    "Embedded Systems",
    "Other"
  ];

  /* ── Word count and profanity filter ────────────── */
  const maxWords = 200;
  const vulgarWords = [
    "damn",
    "hell",
    "ass",
    "bitch",
    "shit",
    "fuck",
    "crap",
    "piss",
    "bastard",
    
  ];

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const hasVulgarWords = (text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => vulgarWords.includes(word));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (hasVulgarWords(text)) {
      toast.warn("Please avoid using inappropriate language.", { autoClose: 3000 });
      return;
    }
    if (countWords(text) <= maxWords) {
      setDescription(text);
    } else {
      toast.warn(`Description cannot exceed ${maxWords} words.`, { autoClose: 3000 });
    }
  };

  /* ── Fetch faculty ID on mount ─────────────────── */
  useEffect(() => {
    const fetchFacultyId = async () => {
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
        const { userId } = await authRes.json();

        const facRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!facRes.ok) throw new Error("Faculty lookup failed.");
        const { id } = await facRes.json();
        setFacultyId(id);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Unexpected error.",
          { autoClose: 3000 }
        );
        router.push("/unauthorized");
      }
    };

    fetchFacultyId();
  }, [router]);

  /* ── Submit ────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasVulgarWords(description)) {
      toast.error("Description contains inappropriate language.", { autoClose: 3000 });
      return;
    }
    const token = localStorage.getItem("jwtToken");
    if (!token || !facultyId) {
      toast.error("Authorization failed. Please try again.", { autoClose: 3000 });
      router.push("/auth/login-user");
      return;
    }

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/add-idea/${facultyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, technology, description }),
        }
      );

      if (res.ok) {
        toast.success("Idea created successfully!", { autoClose: 3000 });
        router.push("/faculty/idea/viewidea");
      } else {
        const msg = await res.text();
        throw new Error(msg || "Creation failed.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error creating idea.",
        { autoClose: 3000 }
      );
    }
  };

  /* ── Loading state ─────────────────────────────── */
  if (!facultyId) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl p-8 bg-white/80 backdrop-blur-md rounded-3xl border-2 border-blue-800/20"
      >
        {/* Logo */}
        <div className="absolute top-4 left-8">
          <Image src="/logo.jpg" alt="BridgeIT Logo" width={80} height={80} />
        </div>

        {/* Heading */}
        <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-8">
          <FaLightbulb className="text-blue-600" />
          Create New Idea
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Technology */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Technology
              </label>
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="" disabled>Select a technology</option>
                {technologyOptions.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description ({countWords(description)}/{maxWords} words)
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              rows={5}
              className="w-full p-3 bg-gray-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-900 hover:to-blue-700 focus:ring-2 focus:ring-blue-600"
            >
              Submit Idea
            </motion.button>
          </div>
        </form>
        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default CreateIdea;
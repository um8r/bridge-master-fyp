"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function AllProjectsList() {
  const router = useRouter();
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);
  const [expertProjects, setExpertProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<"student" | "expert" | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("jwtToken");
      if (!token) return router.push("/auth/login-user");

      try {
        // 1) student projects
        const sRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!sRes.ok) throw new Error("Failed to load student projects");
        const students: Project[] = await sRes.json();

        // 2) expert projects
        const eRes = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-expert-projects",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!eRes.ok) throw new Error("Failed to load expert projects");
        const experts: Project[] = await eRes.json();

        setStudentProjects(students.filter(p => p.status !== "Completed"));
        setExpertProjects(experts.filter(p => p.status !== "Completed"));
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Error loading projects");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) return <div className="py-8 text-center">Loading projects…</div>;
  if (error)   return <div className="py-8 text-center text-red-500">{error}</div>;

  // Render one project card
  const ProjectCard = ({ p }: { p: Project }) => (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      key={p.id}
      className="border-l-4 border-indigo-500 bg-white p-4 rounded-lg shadow hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <h4 className="text-lg font-semibold">{p.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.description}</p>
      </div>
      <button
        onClick={() => router.push(`/uniadmin/projects/${p.id}`)}
        className="mt-3 self-end text-indigo-600 hover:underline text-sm"
      >
        Details →
      </button>
    </motion.li>
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(["student", "expert"] as const).map((type) => {
          const count = type === "student" ? studentProjects.length : expertProjects.length;
          const title = type === "student" ? "Student Projects" : "Expert Projects";
          const color = type === "student" ? "bg-indigo-100" : "bg-green-100";
          return (
            <motion.div
              key={type}
              whileHover={{ scale: 1.02 }}
              className={`relative p-6 rounded-xl shadow-lg cursor-pointer ${color}`}
              onClick={() => setExpanded(expanded === type ? null : type)}
            >
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-3xl font-extrabold">{count}</p>
              <div className="absolute top-4 right-4 text-3xl opacity-20">
                {type === "student" ? "🎓" : "💼"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key={expanded}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <h4 className="text-2xl font-semibold mb-4 capitalize">
              {expanded === "student" ? "Student Projects" : "Expert Projects"}
            </h4>
            <motion.ul layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(expanded === "student" ? studentProjects : expertProjects).map((p) => (
                <ProjectCard p={p} key={p.id} />
              ))}
            </motion.ul>
            <button
              onClick={() => setExpanded(null)}
              className="mt-4 block mx-auto px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              Collapse
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

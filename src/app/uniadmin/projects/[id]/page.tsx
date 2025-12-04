"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  department?: string
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  studentId: string;
}

interface EnrichedProject extends ProjectDetail {
  student: StudentInfo;
  milestones: Milestone[];
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [detail, setDetail] = useState<EnrichedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // 1) fetch base project
        const prjRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!prjRes.ok) throw new Error("Project not found");
        const prjJson = await prjRes.json();
        const proj: ProjectDetail = Array.isArray(prjJson) ? prjJson[0] : prjJson;

        // 2) fetch student info
        const stuRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-student-id/${proj.studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const student: StudentInfo = stuRes.ok ? await stuRes.json() : { id: "", name: "", email: "", department: "" };

        // 3) fetch milestones
        const msRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const milestones: Milestone[] = msRes.ok ? await msRes.json() : [];

        setDetail({ ...proj, student, milestones });
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) return <div className="p-8 text-center">Loading project…</div>;
  if (error)   return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!detail) return <div className="p-8 text-center">No project found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
      <button onClick={() => router.back()} className="text-indigo-600 hover:underline">
        ← Back
      </button>
      <h1 className="text-2xl font-bold">{detail.title}</h1>
      <p className="text-gray-700">{detail.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold">Student</h4>
          <p>{detail.student.name} ({detail.student.email})</p>
          <p className="text-sm text-gray-500">Dept: {detail.student.department}</p>
        </div>
        <div>
          <h4 className="font-semibold">Status</h4>
          <span
            className={`inline-block px-2 py-1 rounded ${
              detail.status === "Completed"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {detail.status}
          </span>
        </div>
      </div>

      {detail.milestones.length > 0 && (
        <section>
          <h4 className="font-semibold">Milestones</h4>
          <ul className="space-y-2">
            {detail.milestones.map((m) => (
              <li
                key={m.id}
                className="p-3 bg-gray-50 rounded flex justify-between"
              >
                <span>{m.title}</span>
                <span>{new Date(m.dueDate).toLocaleDateString()}</span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    m.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

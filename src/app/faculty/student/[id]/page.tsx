"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  department: string;
  description: string;
  skills: string[];
  rollNumber: string;
}

const StudentProfilePage: React.FC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      try {
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-student-id/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student details.");
        }

        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (!student) {
    return <div className="text-center text-gray-400">Student not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6">
        {student.firstName} {student.lastName}
      </h1>
      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold">Details</h2>
        <p className="text-sm text-gray-600">Email: {student.email}</p>
        <p className="text-sm text-gray-600">Department: {student.department}</p>
        <p className="text-sm text-gray-600">University: {student.universityName}</p>
        <p className="text-sm text-gray-600">Roll Number: {student.rollNumber}</p>
      </div>
      <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mt-6">
        <h2 className="text-lg font-semibold">Skills</h2>
        <ul>
          {student.skills.map((skill, index) => (
            <li key={index} className="text-sm text-gray-700">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      {student.description && (
        <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg mt-6">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-sm text-gray-700">{student.description}</p>
        </div>
      )}
    </div>
  );
  
};

export default StudentProfilePage;

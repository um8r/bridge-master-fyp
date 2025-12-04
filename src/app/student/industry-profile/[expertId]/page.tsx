"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ExpertProfile {
  userId: string;
  indExptId: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  companyName: string;
  address: string;
  contact: string;
  imageData: string;
}

const IndustryExpertProfile: React.FC = () => {
  const { expertId } = useParams();
  const router = useRouter();

  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpertProfile() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        console.log("Fetching profile for expertId:", expertId);
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-expert-id/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Error response:", errorData);
          throw new Error(`Failed to fetch industry expert profile. Status: ${response.status}`);
        }

        const data: ExpertProfile = await response.json();
        console.log("Fetched profile data:", data);
        setExpertProfile(data);
      } catch (err: any) {
        console.error("Error fetching expert profile:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (expertId) fetchExpertProfile();
  }, [expertId, router]);

  if (loading) return <div className="text-center text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <img
            src={
              expertProfile?.imageData
                ? `data:image/jpeg;base64,${expertProfile.imageData}`
                : "/default-profile.jpg"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-green-500"
          />
          <div className="ml-6">
            <h1 className="text-3xl text-green-400 font-bold">
              {expertProfile?.firstName} {expertProfile?.lastName}
            </h1>
            <p className="text-gray-400">{expertProfile?.email}</p>
          </div>
        </div>

        <p className="text-lg mb-4">{expertProfile?.description}</p>
        <div className="space-y-3">
          <p>
            <strong className="text-green-300">Company:</strong>{" "}
            {expertProfile?.companyName || "N/A"}
          </p>
          <p>
            <strong className="text-green-300">Address:</strong>{" "}
            {expertProfile?.address || "N/A"}
          </p>
          <p>
            <strong className="text-green-300">Contact:</strong>{" "}
            {expertProfile?.contact || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndustryExpertProfile;

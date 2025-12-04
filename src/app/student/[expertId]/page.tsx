"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface ExpertProfile {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  companyName: string;
  contact: string;
  imageData: string | null;
}

const ExpertProfilePage: React.FC = () => {
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
        const response = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${expertId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch expert profile.");

        const data = await response.json();
        setExpertProfile(data);
      } catch (err: any) {
        console.error("Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (expertId) fetchExpertProfile();
  }, [expertId, router]);

  if (loading) return <div className="text-center text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith("data:image")
        ? imageData
        : `data:image/jpeg;base64,${imageData}`;
    }
    return "/default-profile.jpg"; // Default profile image
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Expert Image */}
        <div className="flex justify-center mb-6">
          <Image
            src={formatImageSrc(expertProfile?.imageData || null)}
            alt="Industry Expert"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>

        {/* Expert Information */}
        <h1 className="text-3xl font-bold text-green-400 text-center mb-2">
          {expertProfile?.firstName} {expertProfile?.lastName}
        </h1>
        <p className="text-gray-400 text-center italic mb-4">
          {expertProfile?.description || "No description available"}
        </p>

        <div className="space-y-4">
          <p>
            <strong>Company:</strong>{" "}
            <span className="text-green-300">
              {expertProfile?.companyName || "Not Available"}
            </span>
          </p>
          <p>
            <strong>Contact:</strong>{" "}
            <span className="text-blue-300">
              {expertProfile?.contact || "Not Available"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;

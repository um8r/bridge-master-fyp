"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Mail,
  Briefcase,
  Book,
  School,
  MapPin,
  Award,
  Calendar,
  Users,
} from "lucide-react";

interface FacultyProfile {
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string;
}

const FacultyProfilePage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchFacultyProfile() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/unauthorized");
        return;
      }

      try {
        const profileResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userId = profileData.userId;

          const facultyResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json();

            setFacultyProfile({
              userId: facultyData.userId,
              uniId: facultyData.uniId,
              firstName: facultyData.firstName || "N/A",
              lastName: facultyData.lastName || "N/A",
              email: facultyData.email || "N/A",
              imageData: facultyData.imageData || "",
              interest: facultyData.interest || [],
              post: facultyData.post || "N/A",
              universityName: facultyData.universityName || "N/A",
              address: facultyData.address || "N/A",
              uniImage: facultyData.uniImage || "",
            });
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        router.push("/unauthorized");
      }
    }

    fetchFacultyProfile();
  }, [router]);

  const goBack = () => {
    router.push("/faculty");
  };

  const editProfile = () => {
    router.push("/faculty/profile/editfaculty");
  };

  if (!facultyProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {/* University Header */}
      <div
        className="relative h-72 rounded-xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(data:image/jpeg;base64,${facultyProfile.uniImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center p-8">
          <div className="flex items-center space-x-6">
            {/* Enlarged Profile Image */}
            <img
              src={`data:image/jpeg;base64,${facultyProfile.imageData}`}
              alt="Faculty Profile"
              className="w-40 h-40 rounded-full border-6 border-white"
            />
            <div>
              {/* Faculty Name */}
              <h1 className="text-4xl font-bold text-white drop-shadow-md">
                {facultyProfile.firstName} {facultyProfile.lastName}
              </h1>
              {/* Faculty Post */}
              <p className="text-xl text-gray-200">{facultyProfile.post}</p>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="ml-auto flex space-x-4">
            <button
              onClick={goBack}
              className="px-5 py-3 bg-gray-200 rounded-lg text-gray-900 hover:bg-gray-300 transition duration-300 shadow-lg"
            >
              <ArrowLeft className="w-6 h-6 inline-block mr-2" />
              Back
            </button>
            <button
              onClick={editProfile}
              className="px-5 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition duration-300 shadow-lg"
            >
              <Edit className="w-6 h-6 inline-block mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
  
      {/* Profile Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            Personal Information
          </h2>
          <p className="flex items-center text-lg text-gray-700 mb-4">
            <Mail className="w-5 h-5 mr-3 text-blue-600" />
            {facultyProfile.email}
          </p>
          <p className="flex items-center text-lg text-gray-700 mb-4">
            <Calendar className="w-5 h-5 mr-3 text-blue-600" />
            Joined: {new Date().getFullYear()}
          </p>
          <div>
            <h3 className="text-lg text-blue-600 font-bold mb-2">Interests:</h3>
            <div className="flex flex-wrap gap-2">
              {facultyProfile.interest.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
  
        {/* University Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
            <School className="w-6 h-6 mr-2" />
            University Information
          </h2>
          <p className="flex items-center text-lg text-gray-700 mb-4">
            <School className="w-5 h-5 mr-3 text-blue-600" />
            {facultyProfile.universityName}
          </p>
          <p className="flex items-center text-lg text-gray-700 mb-4">
            <MapPin className="w-5 h-5 mr-3 text-blue-600" />
            {facultyProfile.address}
          </p>
          <p className="flex items-center text-lg text-gray-700">
            <Users className="w-5 h-5 mr-3 text-blue-600" />
            Department: Computer Science
          </p>
        </div>
      </div>
    </div>
  );  
};

export default FacultyProfilePage;

// faculty/layout.tsx

"use client";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import FacultyNavBar from "./facultycomponents/FacultyNavBar";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string;
}

const FacultyLayout = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch User Profile
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

          // Fetch Faculty Data
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

            setUserProfile({
              userId: facultyData.userId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              role: profileData.role,
              imageData: facultyData.imageData,
            });
          } else {
            console.error("Failed to fetch faculty profile.");
            router.push("/unauthorized");
          }
        } else {
          console.error("Failed to fetch user profile.");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        router.push("/unauthorized");
      }
    }

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  if (!userProfile) {
    // You can return a loading indicator here if you prefer
    return null;
  }

  return (
    <div>
      {/* Navbar on top */}
      <FacultyNavBar userProfile={userProfile} onLogout={handleLogout} />
      <div className="pt-16">
        {/* pt-16 ensures content is below the navbar */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default FacultyLayout;

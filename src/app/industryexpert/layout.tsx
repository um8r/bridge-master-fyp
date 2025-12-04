
"use client";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import IndustryExpertNavBar from "./industrycomponents/ExpertNavBar";
// import StripeProvider from "../components/StripeProvider";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string;
}

const IndustryExpertLayout = ({ children }: { children: ReactNode }) => {
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

          // Fetch Industry Expert Data
          const industryExpertResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (industryExpertResponse.ok) {
            const industryExpertData = await industryExpertResponse.json();

            setUserProfile({
              userId: industryExpertData.userId,
              firstName: industryExpertData.firstName,
              lastName: industryExpertData.lastName,
              role: profileData.role,
              imageData: industryExpertData.imageData,
            });
          } else {
            console.error("Failed to fetch industry expert profile.");
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
      <IndustryExpertNavBar userProfile={userProfile} onLogout={handleLogout} />
      <div className="pt-16">
        {/* pt-16 ensures content is below the navbar */}
      {/* <StripeProvider> */}
        <main>{children}</main>
        {/* </StripeProvider> */}
      </div>
    </div>
  );
};

export default IndustryExpertLayout;

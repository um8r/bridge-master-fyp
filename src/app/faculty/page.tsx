"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSection from "./facultycomponents/FacultyProfile";
import ResearchSection from "./facultycomponents/FacultyResearch";
import UpcomingEventsSection from "./facultycomponents/FacultyEvents";
import EducationalResourcesSection from "./facultycomponents/EducationalResourcesSection";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface FacultyProfileData {
  id: string;
  userId: string;
  uniId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string; // Base64 string
  description: string;
  department: string;
  interest: string[];
  post: string;
  universityName: string;
  address: string;
  uniImage: string; // Base64 string
  role: string;
}

interface Event {
  id: string;
  title: string;
  speakerName: string;
  eventDate: string;
  venue: string;
}

interface ResearchPaper {
  id: string;
  paperName: string;
  category: string;
  publishChannel: string;
  link: string;
  otherResearchers: string;
  yearOfPublish: number;
}

const FacultyPage: React.FC = () => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndData() {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/auth/login-user");
        return;
      }

      try {
        // Fetch user info to get role and userId
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

          // Fetch faculty data using userId
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
              id: facultyData.id,
              userId: facultyData.userId,
              uniId: facultyData.uniId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              email: facultyData.email,
              imageData: facultyData.imageData, // Base64 string
              description: facultyData.description,
              department: facultyData.department,
              interest: facultyData.interest,
              post: facultyData.post,
              universityName: facultyData.universityName,
              address: facultyData.address,
              uniImage: facultyData.uniImage, // Base64 string
              role: profileData.role,
            });

            const facultyId = facultyData.id;

            // Fetch research papers using the faculty ID
            const researchResponse = await fetch(
              `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ResearchWork/get-researchwork-by-id/${facultyId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (researchResponse.ok) {
              const researchData = await researchResponse.json();
              setResearchPapers(researchData.slice(0, 3));
            }

            // Fetch all events
            const eventsResponse = await fetch(
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/get-events",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            }
          } else {
            router.push("/unauthorized");
          }
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Failed to fetch profile or data:", error);
        router.push("/unauthorized");
      }
    }

    fetchProfileAndData();
  }, [router]);

  // Handler functions
  const onViewProfile = () => {
    router.push("/faculty/profile");
  };

  const onEditProfile = () => {
    router.push("/faculty/profile/editfaculty");
  };

  const onSeeMoreResearch = () => {
    router.push("/faculty/researchpaper");
  };

  const onCreateResearchPaper = () => {
    router.push("/faculty/researchpaper/create");
  };

  const onSeeMoreEvents = () => {
    router.push("/faculty/events");
  };

  const onCreateEvent = () => {
    router.push("/faculty/events/create");
  };

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 p-6 space-y-12">
      {/* Profile Section */}
      <ProfileSection
        facultyProfile={facultyProfile}
        onViewProfile={onViewProfile}
        onEditProfile={onEditProfile}
      />

      {/* Educational Resources Section */}
     <EducationalResourcesSection />

      {/* Research Section */}
      <ResearchSection
        researchPapers={researchPapers}
        onSeeMoreResearch={onSeeMoreResearch}
        onCreateResearchPaper={onCreateResearchPaper}
      />

      {/* Upcoming Events Section */}
      <UpcomingEventsSection
        events={events}
        onSeeMoreEvents={onCreateEvent}
        onCreateEvent={onSeeMoreEvents}
      />
    </div>
  );
};

export default FacultyPage;
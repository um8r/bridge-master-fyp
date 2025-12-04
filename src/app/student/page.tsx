"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileSection from "./stdcomps/ProfileSection"
import Loading from "../loading/page"
import OngoingProjectsSection from "./stdcomps/OngoingProjects"
import CompletedProjectsSection from "./stdcomps/CompletedProjects"
import EventsSection from "./stdcomps/EventsComp"
import ChatWidget from "../chat/ChatWidget"
import CompletedIndustryProjectsSection from "./stdcomps/CompletedExpert"
import EducationalResourcesCard from "./stdcomps/EducationalResourcesCard"
import QuickAccessSection from "./stdcomps/QuickAccessSection"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  description: string
  role: string
  email: string
  universityName: string
  address: string
  rollNumber: string
  imageData: string
  uniImage: string
}

interface Idea {
  id: string
  title: string
  technology: string
  description: string
  facultyName: string
  email: string
  uniName: string
}

interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

interface Project {
  id: string
  title: string
  description: string
}

interface OngoingProject {
  id: string
  title: string
  description: string
  expertName: string
  status: string
  endDate: string
}

interface CompletedProject {
  id: string
  title: string
  description: string
  expertName: string
  status: string
  endDate: string
}

const StudentPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProject[]>([])
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([])
  const [personalProjects, setPersonalProjects] = useState<Project[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfileAndProjects() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }
      try {
        // Fetch user profile
        const profileResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId

          const studentResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (studentResponse.ok) {
            const studentData = await studentResponse.json()
            setUserProfile({
              userId: studentData.userId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              role: profileData.role,
              email: studentData.email,
              universityName: studentData.universityName,
              address: studentData.address,
              rollNumber: studentData.rollNumber,
              imageData: studentData.imageData,
              description: studentData.description || "Add your description by going to edit profile section.",
              uniImage: studentData.uniImage,
            })
            // Fetch completed projects (personal)
            const projectsResponse = await fetch(
              `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-projects-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            if (projectsResponse.ok) {
              const projectsData = await projectsResponse.json()
              setPersonalProjects(projectsData)
            }

            // Fetch all projects with expert assigned (both ongoing and completed)
            const expertProjectsResponse = await fetch(
              `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-with-expert-project-by-id/${studentData.id}`,
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (expertProjectsResponse.ok) {
              const expertProjectsData = await expertProjectsResponse.json()

              // Filter projects based on status
              const ongoing = expertProjectsData.filter(
                (project: OngoingProject) => project.status !== "Completed" && project.status !== "PaymentPending",
              )

              const completed = expertProjectsData.filter(
                (project: CompletedProject) => project.status === "Completed" || project.status === "PaymentPending",
              )

              setOngoingProjects(ongoing)
              setCompletedProjects(completed)
            } else {
              setOngoingProjects([])
              setCompletedProjects([])
            }

            // Fetch events
            const eventsResponse = await fetch(
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/get-events",
              {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json()
              setEvents(eventsData)
            } else {
              setEvents([])
            }
          } else {
            console.error("Failed to fetch student profile.")
            router.push("/unauthorized")
          }
        } else {
          console.error("Failed to fetch user profile.")
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("An error occurred:", error)
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }
    fetchProfileAndProjects()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

  const goToEditProfile = () => {
    router.push("/student/profile/edit")
  }

  const gotoProfile = () => {
    router.push("/student/profile")
  }

  const goToProjectsPage = () => {
    router.push("/student/projects")
  }

  const createProjects = () => {
    router.push("/student/projects/create")
  }

  const goToEducationalResources = () => {
    router.push("/student/educational-resource")
  }

  if (loading || !userProfile) {
    return (
      <div className="text-center text-gray-400">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-6">
      {/* Profile Section */}
     
     <ProfileSection userProfile={userProfile} goToEditProfile={goToEditProfile} gotoProfile={gotoProfile} />
     
 <QuickAccessSection />

      {/* Educational Resources Card - New Section*/}
      <EducationalResourcesCard goToEducationalResources={goToEducationalResources} />

      {/* Ongoing Projects Section */}
      <OngoingProjectsSection ongoingProjects={ongoingProjects} />

      {/* Completed Industry Projects Section */}
      <CompletedIndustryProjectsSection projects={completedProjects} /> 

      {/* Events Section */}
      <EventsSection events={events} gradientStyles={[]} />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default StudentPage

"use client"
import { useEffect } from "react"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import NavBar from "./stdcomps/NavBar"
import ChatWidget from "../chat/ChatWidget"
import { UserProvider, useUser } from "../contexts/UserContext"

const StudentLayoutContent = ({ children }: { children: ReactNode }) => {
  const { userProfile, setUserProfile } = useUser()
  const router = useRouter()

  useEffect(() => {
    async function fetchUserProfile() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch User Profile
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId

          // Fetch Student Data
          const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (studentResponse.ok) {
            const studentData = await studentResponse.json()

            setUserProfile({
              userId: studentData.userId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              role: profileData.role,
              imageData: studentData.imageData,
            })
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
      }
    }

    fetchUserProfile()
  }, [router, setUserProfile])

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

  if (!userProfile) {
    // You can return a loading indicator here if you prefer
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      {/* Navbar on top */}
      <NavBar userProfile={userProfile} onLogout={handleLogout} />
      <div className="pt-16">
        {" "}
        {/* pt-16 ensures content is below the navbar */}
        <main>{children}</main>
      </div>
      <ChatWidget />
    </div>
  )
}

// Wrapper component that provides the UserContext
const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </UserProvider>
  )
}

export default StudentLayout


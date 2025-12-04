"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FaEdit, FaArrowLeft, FaUniversity, FaMapMarkerAlt, FaIdCard, FaCode, FaUserGraduate } from "react-icons/fa"
import Image from "next/image"

interface StudentProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  imageData: string
  universityName: string
  address: string
  rollNumber: string
  skills: string[]
  description: string
  department: string
}

const ProfilePage: React.FC = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchStudentProfile() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/unauthorized")
        return
      }

      try {
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId

          const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (studentResponse.ok) {
            const studentData = await studentResponse.json()

            setStudentProfile({
              userId: studentData.userId,
              firstName: studentData.firstName || "N/A",
              lastName: studentData.lastName || "N/A",
              email: studentData.email || "N/A",
              imageData: studentData.imageData || "",
              universityName: studentData.universityName || "N/A",
              address: studentData.address || "N/A",
              rollNumber: studentData.rollNumber || "N/A",
              skills: studentData.skills || [],
              department: studentData.department || "Computer Science",
              description: studentData.description || "No description provided.",
            })
          } else {
            console.error("Failed to fetch student profile:", studentResponse.statusText)
            router.push("/unauthorized")
          }
        } else {
          console.error("Failed to fetch user info:", profileResponse.statusText)
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("An error occurred while fetching the student profile:", error)
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [router])

  const goBack = () => {
    router.push("/student")
  }

  const editProfile = () => {
    router.push("/student/profile/edit")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-blue-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p>Unable to load student profile information.</p>
          <button
            onClick={goBack}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-200 rounded-full filter blur-3xl opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-200 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>

      {/* Prominent Image on the Right */}
      <div className="absolute bottom-0 right-0 z-0 hidden lg:block">
        <Image src="/Saly-22.png" alt="Decorative Image" width={500} height={500} className="opacity-80" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Top navigation bar */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
            <span>Back</span>
          </motion.button>

          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Student Profile
          </h1>

          <motion.button
            onClick={editProfile}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEdit />
            <span>Edit</span>
          </motion.button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile image and basic info */}
          <motion.div
            className="col-span-1 bg-white rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="flex flex-col items-center -mt-16 px-6 pb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-md transform scale-110"></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  {studentProfile.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${studentProfile.imageData}`}
                      alt={`${studentProfile.firstName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-500">
                        {studentProfile.firstName.charAt(0)}
                        {studentProfile.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                {studentProfile.firstName} {studentProfile.lastName}
              </h2>
              <p className="text-blue-600">{studentProfile.email}</p>

              <div className="mt-6 w-full">
                <div className="flex items-center space-x-2 py-3 border-b border-gray-100">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Roll Number</p>
                    <p className="font-medium">{studentProfile.rollNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-3 border-b border-gray-100">
                  <FaUserGraduate className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{studentProfile.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-3">
                  <FaUniversity className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">University</p>
                    <p className="font-medium">{studentProfile.universityName}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={editProfile}
                className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Right column - Details and skills */}
          <motion.div
            className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* About Me */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                About Me
              </h3>
              <p className="text-gray-700 leading-relaxed">{studentProfile.description}</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <FaMapMarkerAlt className="text-indigo-600" />
                </span>
                Address
              </h3>
              <p className="text-gray-700">{studentProfile.address}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <FaCode className="text-purple-600" />
                </span>
                Skills
              </h3>

              {studentProfile.skills && studentProfile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm relative z-10">
        <p>&copy; 2024 BridgeIT. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ProfilePage

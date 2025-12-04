"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Edit, User, Briefcase, Building, GraduationCap, MapPin, Lightbulb, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface FacultyProfileProps {
  facultyProfile: FacultyProfileData
  onViewProfile: () => void
  onEditProfile: () => void
}

interface FacultyProfileData {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  imageData: string | null // Nullable to handle missing image
  description: string
  department: string
  interest: string[]
  post: string
  universityName: string
  address: string
  uniImage: string
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ onEditProfile, onViewProfile }) => {
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch user profile data
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId

          // Fetch faculty details by userId
          const facultyResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (facultyResponse.ok) {
            const facultyData = await facultyResponse.json()
            setFacultyProfile({
              id: facultyData.id,
              userId: facultyData.userId,
              firstName: facultyData.firstName,
              lastName: facultyData.lastName,
              email: facultyData.email,
              imageData: facultyData.imageData ? `data:image/jpeg;base64,${facultyData.imageData}` : null, // Handle missing image
              description: facultyData.description,
              department: facultyData.department,
              interest: facultyData.interest,
              post: facultyData.post,
              universityName: facultyData.universityName,
              address: facultyData.address,
              uniImage: facultyData.uniImage ? `data:image/jpeg;base64,${facultyData.uniImage}` : "/unknown.jpg", // Placeholder if university image is missing
            })
          } else {
            console.error("Failed to fetch faculty details.")
          }
        } else {
          console.error("Failed to fetch user profile.")
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    }

    fetchFacultyProfile()
  }, [router])

  if (!facultyProfile) {
    return <div className="text-center text-gray-400">Loading...</div>
  }

return (
  <div className="flex flex-col lg:flex-row gap-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex-1 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 overflow-hidden"
    >
      {/* Decorative blurred circle */}
      <div className="absolute top-4 right-4 w-28 h-28 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>

      {/* Content */}
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 bg-gray-100 rounded-full"></div>
          <img
            src={facultyProfile.imageData || "/unknown.jpg"}
            alt={`${facultyProfile.firstName} ${facultyProfile.lastName}`}
            className="absolute top-0 left-0 w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        {/* Welcome Text */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Welcome, <span className="text-indigo-600">{facultyProfile.firstName}</span>!
          </h2>
          <p className="mt-1 text-gray-500">
            {facultyProfile.post} &bull; {facultyProfile.department}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition"
        >
          <Edit className="w-5 h-5" />
          Edit Profile
        </button>
        <button
          onClick={onViewProfile}
          className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition"
        >
          <User className="w-5 h-5" />
          View Profile
        </button>
      </div>
    </motion.div>
{/*
        {/* Card Content 
        <div className="pt-14 px-6 pb-6 bg-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {facultyProfile.firstName} {facultyProfile.lastName}
              </h2>

              <div className="flex items-center mt-1 text-gray-600">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{facultyProfile.post}</span>
              </div>

              <div className="flex items-center mt-1 text-gray-600">
                <Building className="w-4 h-4 mr-2" />
                <span>
                  {facultyProfile.department}, {facultyProfile.universityName}
                </span>
              </div>

              {facultyProfile.address && (
                <div className="flex items-center mt-1 text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{facultyProfile.address}</span>
                </div>
              )}
            </div>

            <div className="flex mt-4 md:mt-0 space-x-3">
              <button
                onClick={onEditProfile}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Profile
              </button>
              <button
                onClick={onViewProfile}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                View Profile
              </button>
            </div>
          </div>*/}

          {/* Interests 
          {facultyProfile.interest && facultyProfile.interest.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="font-medium">Research Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {facultyProfile.interest.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}*/}

          {/* Description 
          {facultyProfile.description && (
            <div className="mt-4 text-gray-600 text-sm line-clamp-2">{facultyProfile.description}</div>
          )}
        </div>
      </motion.div>*/}

      {/* Idea Buttons - Added beside profile in a modern way */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-1/3 flex flex-col gap-4 self-start"
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Research Ideas
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Create and manage your research ideas. Collaborate with colleagues and track your innovation journey.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/faculty/idea")}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
              >
                <PlusCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Create New Idea
              </button>
              <button
                onClick={() => router.push("/faculty/idea/viewidea")}
                className="w-full py-3 px-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-200 flex items-center justify-center group"
              >
                <Lightbulb className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                View My Ideas
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default FacultyProfile

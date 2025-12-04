"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Building, MapPin, Phone, Mail, ArrowLeft, Edit } from "lucide-react"

interface IndustryExpertProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  imageData: string // Base64 image data
  companyName: string
  contact: string
  address: string
}

const IndustryExpertProfilePage: React.FC = () => {
  const [industryExpertProfile, setIndustryExpertProfile] = useState<IndustryExpertProfile | null>(null)
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchIndustryExpertProfile() {
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

          const industryExpertResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (industryExpertResponse.ok) {
            const industryExpertData = await industryExpertResponse.json()

            setIndustryExpertProfile({
              userId: industryExpertData.userId,
              firstName: industryExpertData.firstName || "N/A",
              lastName: industryExpertData.lastName || "N/A",
              email: industryExpertData.email || "N/A",
              imageData: industryExpertData.imageData || "",
              companyName: industryExpertData.companyName || "N/A",
              contact: industryExpertData.contact || "N/A",
              address: industryExpertData.address || "N/A",
            })
          } else {
            console.error("Failed to fetch industry expert profile:", industryExpertResponse.statusText)
            router.push("/unauthorized")
          }
        } else {
          console.error("Failed to fetch user info:", profileResponse.statusText)
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("An error occurred while fetching the industry expert profile:", error)
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }

    fetchIndustryExpertProfile()
  }, [router])

  const goBack = () => {
    router.push("/industryexpert")
  }

  const editProfile = () => {
    router.push("/industryexpert/profile/editexpert")
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!industryExpertProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldnot load your profile information. Please try again later.</p>
          <button
            onClick={goBack}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={goBack}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header with background */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          {/* Profile content */}
          <div className="relative px-6 sm:px-12 pb-12 -mt-24">
            {/* Profile image */}
            <div className="flex justify-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {imageError || !industryExpertProfile.imageData ? (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${industryExpertProfile.imageData}`}
                    alt={`${industryExpertProfile.firstName}'s profile`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>

            {/* Name and title */}
            <div className="text-center mt-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {industryExpertProfile.firstName} {industryExpertProfile.lastName}
              </h1>
              <p className="text-blue-600 font-medium mt-1">Industry Expert</p>
            </div>

            {/* Edit button */}
            <div className="absolute top-0 right-6">
              <button
                onClick={editProfile}
                className="mt-6 flex items-center justify-center p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors group"
              >
                <Edit className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Edit Profile</span>
              </button>
            </div>

            {/* Profile details */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{industryExpertProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{industryExpertProfile.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-800">{industryExpertProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="text-gray-800">{industryExpertProfile.companyName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={goBack}
                className="py-3 px-8 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition duration-300 font-medium flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <button
                onClick={editProfile}
                className="py-3 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium flex items-center justify-center"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default IndustryExpertProfilePage

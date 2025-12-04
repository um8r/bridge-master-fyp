"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, User, Building, GraduationCap, MapPin, Mail } from "lucide-react"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  description: string
  rollNumber: string
  imageData?: string
  uniImage?: string
  semester?: string
  course?: string
  university?: string
  address?: string
  email?: string
}

interface Props {
  userProfile: UserProfile
  goToEditProfile: () => void
  gotoProfile: () => void
}

const ProfileSection: React.FC<Props> = ({ userProfile, goToEditProfile, gotoProfile }) => {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [userProfile.imageData])

  const handleImageError = () => setImageError(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 px-4 w-full"
    >
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="relative h-48 w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-5000"
              style={{
                backgroundImage: userProfile.uniImage
                  ? `url('data:image/jpeg;base64,${userProfile.uniImage}')`
                  : "url('/bustling-university-campus.png')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/70"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              {imageError || !userProfile.imageData ? (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-14 w-14 text-gray-300" />
                </div>
              ) : (
                <img
                  src={`data:image/jpeg;base64,${userProfile.imageData}`}
                  alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={handleImageError}
                />
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <span className="sr-only">Online</span>
              </div>
            </motion.div>

            <div className="space-y-2 min-w-[200px]">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome, <span className="text-purple-700 font-bold">{userProfile.firstName}</span>!
              </h1>
              <div className="flex items-center text-gray-500">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Student</span>
                <span className="mx-2">•</span>
                <span>{userProfile.rollNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Buttons */}
        <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
              <User className="w-7 h-7 text-indigo-600" /> Profile Controls
            </h2>
            <p className="text-xl text-gray-600 mt-2">Update and manage your profile below.</p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToEditProfile}
              className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md flex items-center justify-center"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={gotoProfile}
              className="w-full px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl shadow-md flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              View Profile
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileSection

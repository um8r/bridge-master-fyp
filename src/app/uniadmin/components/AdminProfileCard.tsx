"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { FaAddressCard, FaPhone, FaEdit, FaUser } from "react-icons/fa"
import { motion } from "framer-motion"

// Import the AdminProfile type directly from the page file
interface AdminProfile {
  firstName: string
  lastName: string
  email: string
  officeAddress: string
  contact: string
  university: string
  profileImage: string
}

interface AdminProfileCardProps {
  adminProfile: AdminProfile | null
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ adminProfile }) => {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  // Reset image error state when adminProfile changes
  useEffect(() => {
    setImageError(false)
  }, [adminProfile?.profileImage])

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  // Determine what to render for the profile image
  const renderProfileImage = () => {
    // If there's no profile image or there was an error loading it
    if (!adminProfile?.profileImage || imageError) {
      return (
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4 bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-400 text-4xl" />
        </div>
      )
    }

    // If there is a profile image, try to display it
    return (
      <img
        src={`data:image/png;base64,${adminProfile.profileImage}`}
        alt="Admin Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4 object-cover"
        onError={handleImageError}
      />
    )
  }

  return (
    <motion.div
      className="bg-gray-100 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gradient-to-r from-blue-500 to-green-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Profile Image, Name, etc. */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {renderProfileImage()}
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            {adminProfile?.firstName} {adminProfile?.lastName}
          </h2>
          <p className="text-gray-700">{adminProfile?.university}</p>
          <p className="text-gray-700">{adminProfile?.email}</p>
        </div>

        {/* Right: Office Info, Edit Profile */}
        <div className="flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Office Information</h3>
            <p className="text-gray-700 flex items-center">
              <FaAddressCard className="mr-2 text-blue-400" /> {adminProfile?.officeAddress || "No address provided"}
            </p>
            <p className="text-gray-700 flex items-center mt-2">
              <FaPhone className="mr-2 text-green-400" /> {adminProfile?.contact || "No contact provided"}
            </p>
          </div>
          <button
            onClick={() => router.push("/uniadmin/profile/edituniadmin")}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 flex items-center justify-center space-x-2"
          >
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="mt-6 border-t border-gray-700"></div>
    </motion.div>
  )
}

export default AdminProfileCard

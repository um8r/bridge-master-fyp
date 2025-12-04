"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Edit, User, Building, MapPin, Phone, Mail, FileText, PlusCircle } from "lucide-react"

interface IndustryProfileProps {
  companyLogo: string // Base64 string
  companyName: string
  userId: string
  description: string
  indExptId: string
  companyId: string
  firstName: string
  lastName: string
  email: string
  address: string
  contact: string
}

const IndustryProfile: React.FC<IndustryProfileProps> = ({
  companyLogo,
  companyName,
  firstName,
  lastName,
  description,
  indExptId,
  email,
  address,
  contact,
}) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility
  const [imageError, setImageError] = useState(false)

  // Reset image error state when companyLogo changes
  useEffect(() => {
    setImageError(false)
  }, [companyLogo])

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true)
  }

  const handleEditProfile = () => {
    router.push(`/industryexpert/profile/editexpert`)
  }

  const handleViewProjects = () => {
    router.push(`/industryexpert/projects`)
  }

  const handleAddProjects = () => {
    router.push(`/industryexpert/projects/create`)
  }

  const handleViewProfile =() => {
    router.push(`/industryexpert/profile`)
  }

  const profileImageSrc = companyLogo ? `data:image/jpeg;base64,${companyLogo}` : "/default-profile.png"

return (
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Redesigned Profile Card */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex-1 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
    >
      {/* Decorative blurred circle */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl opacity-30"></div>

      {/* Header with gradient + watermark */}
      <div className="relative h-36 bg-gradient-to-r from-indigo-500 to-purple-500">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-9"
          style={{ backgroundImage: "url('/studenttop.jpg')" }}
        />
      </div>

      {/* Avatar overlapping header */}
      <div className="relative px-6 -mt-16">
        {imageError ? (
          <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={profileImageSrc || "/placeholder.svg"}
            alt={`${firstName} ${lastName}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            onError={handleImageError}
          />
        )}
      </div>

      {/* Name & Action Buttons */}
      <div className="px-6 pt-6 pb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, <span className="text-indigo-600">{firstName}</span>!
        </h2>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition"
          >
            <Edit className="w-5 h-5" />
            Edit Profile
          </button>
          <button
            onClick={handleViewProfile}
            className="flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition"
          >
            <User className="w-5 h-5" />
            View Profile
          </button>
        </div>
      </div>

      {/* Original Card Content (commented out) */}
      {/*
      <div className="pt-14 px-6 pb-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {firstName} {lastName}
            </h2>
            <div className="flex items-center mt-1 text-gray-600">
              <Building className="w-4 h-4 mr-2" />
              <span>{companyName}</span>
            </div>
            <div className="flex items-center mt-1 text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{email}</span>
            </div>
            <div className="flex items-center mt-1 text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{contact}</span>
            </div>
            {address && (
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{address}</span>
              </div>
            )}
          </div>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Profile
            </button>
            <button
              onClick={handleViewProfile}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-1" />
              View Profile
            </button>
          </div>
        </div>
        {description && (
          <div className="mt-4 text-gray-600 text-sm">
            <p className="line-clamp-3">{description}</p>
          </div>
        )}
      </div>
      */}
    </motion.div>
      {/* Right Side Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full lg:w-1/3 flex flex-col gap-4 self-start"
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Industry Projects
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Create and manage your industry projects. Collaborate with students and track project progress.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleAddProjects}
                className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center group"
              >
                <PlusCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Add New Project
              </button>
              <button
                onClick={handleViewProjects}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group"
              >
                <FileText className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                View My Projects
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal for Enlarged Profile Image */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            >
              ✕
            </button>
            <img
              src={profileImageSrc || "/placeholder.svg"}
              alt="Enlarged Profile"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default IndustryProfile

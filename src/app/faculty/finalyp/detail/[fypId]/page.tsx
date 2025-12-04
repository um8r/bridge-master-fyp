"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { FaBook, FaCog, FaUsers, FaCalendarAlt, FaArrowLeft, FaDownload, FaShare } from "react-icons/fa"

interface FypDetails {
  id: string
  fypId: string
  title: string
  members: number
  batch: string
  technology: string
  description: string
}

const FypDetailPage: React.FC = () => {
  const { fypId } = useParams() // Get FYP ID from the route
  const [fypDetails, setFypDetails] = useState<FypDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFypDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) throw new Error("User not authenticated")

        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-fyp-by-id/${fypId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch FYP details.")

        const data = await response.json()
        setFypDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchFypDetails()
  }, [fypId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-200/30 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-purple-300 font-medium">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-red-500/30">
          <div className="bg-red-900/30 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!fypDetails) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-purple-400 mb-2">Project Not Found</h2>
          <p className="text-gray-300 mb-6">The project you are looking for doesnot exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Projects</span>
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-purple-900/50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 md:p-8">
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-purple-200 mb-4">
              FYP ID: {fypDetails.fypId}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{fypDetails.title}</h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="px-3 py-1 bg-purple-700/50 rounded-full text-sm text-purple-200 flex items-center">
                <FaUsers className="mr-2" />
                {fypDetails.members} Members
              </span>
              <span className="px-3 py-1 bg-blue-700/50 rounded-full text-sm text-blue-200 flex items-center">
                <FaCalendarAlt className="mr-2" />
                Batch: {fypDetails.batch}
              </span>
              <span className="px-3 py-1 bg-green-700/50 rounded-full text-sm text-green-200 flex items-center">
                <FaCog className="mr-2" />
                {fypDetails.technology}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Project Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <FaBook className="mr-3 text-purple-500" />
                Project Description
              </h2>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{fypDetails.description}</p>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technology Details */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                  <FaCog className="mr-2 text-blue-500" />
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {fypDetails.technology.split(",").map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm border border-blue-800/50"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team Details */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                  <FaUsers className="mr-2 text-green-500" />
                  Team Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Team Size:</span>
                    <span className="text-white font-medium">{fypDetails.members} Members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Batch:</span>
                    <span className="text-white font-medium">{fypDetails.batch}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Project ID:</span>
                    <span className="text-white font-medium">{fypDetails.fypId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex-1 py-3 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg shadow-lg transition flex items-center justify-center">
                <FaDownload className="mr-2" />
                Download Details
              </button>
              <button className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg transition flex items-center justify-center">
                <FaShare className="mr-2" />
                Share Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="fixed top-20 right-10 opacity-5 pointer-events-none">
          <FaCog className="text-purple-500 animate-spin" size={80} style={{ animationDuration: "15s" }} />
        </div>
        <div className="fixed bottom-20 left-10 opacity-5 pointer-events-none">
          <FaBook className="text-blue-500" size={80} />
        </div>
      </div>
    </div>
  )
}

export default FypDetailPage


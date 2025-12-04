"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { FaCheck, FaTimes, FaUsers, FaCog, FaUserTie, FaCalendarAlt, FaArrowLeft, FaInfoCircle } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

interface FacultyDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  post: string
}

interface FypDetails {
  id: string
  fypId: string
  title: string
  members: number
  batch: string
  technology: string
  description: string
  status: string
  faculty: { id: string } | null // Holds only faculty ID
}

const FypDetailPage: React.FC = () => {
  const [fypDetails, setFypDetails] = useState<FypDetails | null>(null)
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null) // Faculty details state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const { fypId } = useParams() // Get fypId from dynamic route

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchFypDetails = async () => {
      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch FYP details.")

        const data = await response.json()
        setFypDetails(data)

        // Fetch faculty details if faculty is assigned
        if (data.faculty && data.faculty.id) {
          fetchFacultyDetails(data.faculty.id, token)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    const fetchFacultyDetails = async (facultyId: string, token: string) => {
      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-faculity-id/${facultyId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch faculty details.")

        const facultyData = await response.json()
        setFacultyDetails(facultyData)
      } catch (err) {
        toast.error("Failed to load faculty details.")
      }
    }

    fetchFypDetails()
  }, [fypId, router])

  const handleApprove = async () => {
    setProcessing(true)
    const token = localStorage.getItem("jwtToken")

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/uni-admin-for-fyp/approve-fyp?fypId=${fypId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("FYP approved successfully!")
        setFypDetails((prev) => prev && { ...prev, status: "Approved" })
      } else {
        const errorData = await response.text()
        toast.error(`Failed to approve FYP: ${errorData}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    const token = localStorage.getItem("jwtToken")

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/uni-admin-for-fyp/reject-fyp?fypId=${fypId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.error("FYP rejected.")
        setFypDetails((prev) => prev && { ...prev, status: "Rejected" })
      } else {
        const errorData = await response.text()
        toast.error(`Failed to reject FYP: ${errorData}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading FYP Details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <FaInfoCircle className="h-12 w-12 mx-auto" />
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (!fypDetails) return null

    let bgColor = ""
    let textColor = ""

    switch (fypDetails.status) {
      case "Pending":
        bgColor = "bg-yellow-100"
        textColor = "text-yellow-800"
        break
      case "Approved":
        bgColor = "bg-green-100"
        textColor = "text-green-800"
        break
      case "Rejected":
        bgColor = "bg-red-100"
        textColor = "text-red-800"
        break
      default:
        bgColor = "bg-gray-100"
        textColor = "text-gray-800"
    }

    return (
      <span className={`${bgColor} ${textColor} text-sm font-medium px-3 py-1 rounded-full`}>{fypDetails.status}</span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to FYP Requests</span>
        </button>

        {fypDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Header with status */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{fypDetails.title}</h1>
                  <p className="text-gray-500 mt-1">FYP ID: {fypDetails.fypId}</p>
                </div>
                <div className="mt-4 md:mt-0">{getStatusBadge()}</div>
              </div>
            </div>

            {/* Project details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Information</h2>

                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <FaUsers className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team Members</p>
                      <p className="font-medium">{fypDetails.members}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-md mr-3">
                      <FaCog className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Technology</p>
                      <p className="font-medium">{fypDetails.technology}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <FaCalendarAlt className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Batch</p>
                      <p className="font-medium">{fypDetails.batch}</p>
                    </div>
                  </div>
                </div>

                {/* Faculty details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Faculty Supervisor</h2>

                  {facultyDetails ? (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <FaUserTie className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {facultyDetails.firstName} {facultyDetails.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{facultyDetails.email}</p>
                          <p className="text-sm text-gray-500">
                            {facultyDetails.post}, {facultyDetails.department}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                      No faculty supervisor assigned yet
                    </div>
                  )}
                </div>
              </div>

              {/* Project description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Description</h2>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{fypDetails.description}</p>
                </div>
              </div>

              {/* Action buttons */}
              {fypDetails.status === "Pending" && (
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                  >
                    <FaTimes className="mr-2" />
                    Reject Project
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                  >
                    <FaCheck className="mr-2" />
                    Approve Project
                  </button>
                </div>
              )}

              {/* Status message for already processed FYPs */}
              {fypDetails.status !== "Pending" && (
                <div
                  className={`mt-6 p-4 rounded-md ${
                    fypDetails.status === "Approved" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {fypDetails.status === "Approved" ? (
                        <FaCheck className="h-5 w-5 text-green-400" />
                      ) : (
                        <FaTimes className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        This project has been {fypDetails.status.toLowerCase()}. No further action is required.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default FypDetailPage

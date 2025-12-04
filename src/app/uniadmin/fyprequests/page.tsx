"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaProjectDiagram, FaFilter, FaCheckCircle, FaTimesCircle, FaClock, FaChevronRight } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"

interface AdminProfile {
  universityId: string
}

interface FypRequest {
  fId: string
  title: string
  fypId: string
  members: string
  batch: string
  technology: string
  description: string
  status: string // Pending, Approved, Rejected
  studentName: string
  studentEmail: string
  studentRollNo: string
}

const FypRequestsPage: React.FC = () => {
  const [fypRequests, setFypRequests] = useState<FypRequest[]>([])
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All")
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchAdminAndFyps = async () => {
      try {
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileResponse.ok) {
          throw new Error("Unauthorized. Please log in again.")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        const adminResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-uni-admins/admins-by-id/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!adminResponse.ok) throw new Error("Failed to fetch admin details.")

        const adminData = await adminResponse.json()
        if (!adminData.uniId) throw new Error("University ID missing. Please log in again.")

        setAdminProfile({ universityId: adminData.uniId })

        const fypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/uni-admin-for-fyp/get-fyps-for-uniAdmin-for-approval?uniId=${adminData.uniId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!fypResponse.ok) throw new Error("Failed to fetch FYP requests.")

        const fypData = await fypResponse.json()
        setFypRequests(fypData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminAndFyps()
  }, [router])

  // Filter and search functionality
  const filteredRequests = fypRequests
    .filter((fyp) => (filter === "All" ? true : fyp.status === filter))
    .filter(
      (fyp) =>
        searchTerm === "" ||
        fyp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fyp.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fyp.technology.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  // Get counts for the dashboard
  const counts = {
    all: fypRequests.length,
    pending: fypRequests.filter((fyp) => fyp.status === "Pending").length,
    approved: fypRequests.filter((fyp) => fyp.status === "Approved").length,
    rejected: fypRequests.filter((fyp) => fyp.status === "Rejected").length,
  }

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500" />
      case "Approved":
        return <FaCheckCircle className="text-green-500" />
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading FYP Requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Final Year Project Requests</h1>
          <p className="mt-2 text-gray-600">Review and manage student FYP proposals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800">{counts.all}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaProjectDiagram className="text-blue-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{counts.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClock className="text-yellow-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-800">{counts.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">{counts.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaTimesCircle className="text-red-500 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <span className="text-gray-600 font-medium">Filter:</span>
              <div className="flex space-x-2">
                {["All", "Pending", "Approved", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as "All" | "Pending" | "Approved" | "Rejected")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, student, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FYP Request List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((fyp, index) => (
              <motion.div
                key={fyp.fId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => router.push(`/uniadmin/fyprequests/${fyp.fId}`)}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-md ${
                          fyp.status === "Pending"
                            ? "bg-yellow-100"
                            : fyp.status === "Approved"
                              ? "bg-green-100"
                              : "bg-red-100"
                        }`}
                      >
                        {getStatusIcon(fyp.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{fyp.title}</h3>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Batch:</span> {fyp.batch} •{" "}
                          <span className="font-medium">Tech:</span> {fyp.technology}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium text-gray-800">{fyp.studentName}</p>
                        <p className="text-xs text-gray-500">{fyp.studentRollNo}</p>
                      </div>
                      <FaChevronRight className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div
                  className={`h-1 w-full ${
                    fyp.status === "Pending"
                      ? "bg-yellow-500"
                      : fyp.status === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                  }`}
                ></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No FYP requests found</h3>
            <p className="text-gray-500">There are no FYP requests matching your current filters.</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default FypRequestsPage

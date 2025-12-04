"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, ChevronLeft, FileText, Calendar, ArrowRight } from "lucide-react"

interface Proposal {
  id: string
  projectTitle: string
  proposal: string
  status: string
  createdAt?: string // Optional timestamp
}

const ProposalHistoryPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        console.error("Token is missing")
        toast.error("Authentication required. Please log in.")
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch the authorized user's profile (student)
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileResponse.ok) {
          console.error("Failed to fetch profile", profileResponse.statusText)
          throw new Error("Failed to fetch profile")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Fetch the student ID using the userId
        const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!studentResponse.ok) {
          console.error("Failed to fetch student details", studentResponse.statusText)
          throw new Error("Failed to fetch student details")
        }

        const studentData = await studentResponse.json()
        const studentId = studentData.id

        // Fetch proposals for the student using their student ID
        const proposalsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/get-proposal-for-student/${studentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!proposalsResponse.ok) {
          console.error("Failed to fetch proposals", proposalsResponse.statusText)
          throw new Error("Failed to fetch proposals")
        }

        const proposalsData = await proposalsResponse.json()
        setProposals(proposalsData)
      } catch (error) {
        setError("Failed to fetch proposals")
        toast.error("Could not load your proposals. Please try again later.")
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [router])

  // Function to get status color and icon based on proposal status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Accepted":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        }
      case "Rejected":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        }
      default:
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: <Clock className="w-5 h-5 text-amber-600" />,
        }
    }
  }

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your proposals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-0 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Proposal History</h1>
            <p className="text-gray-600 mt-1">Track the status of all your project proposals</p>
          </div>

          {/* Stats summary */}
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{proposals.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-green-600">
                {proposals.filter((p) => p.status === "Accepted").length}
              </p>
              <p className="text-xs text-gray-500">Accepted</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {proposals.filter((p) => p.status === "Pending").length}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {proposals.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No proposals yet</h2>
            <p className="text-gray-600 mb-6">
              You havenot submitted any project proposals yet. Start exploring projects and submit your first proposal!
            </p>
            <button
              onClick={() => router.push("/student/explore-projects")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Projects
            </button>
          </div>
        ) : (
          <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {proposals.map((proposal) => {
              const statusInfo = getStatusInfo(proposal.status)

              return (
                <motion.div
                  key={proposal.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">{proposal.projectTitle}</h2>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
                      >
                        {statusInfo.icon}
                        <span className={`ml-1.5 text-sm font-medium ${statusInfo.color}`}>{proposal.status}</span>
                      </div>
                    </div>

                    {/* Date info */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>Submitted on {formatDate(proposal.createdAt)}</span>
                    </div>

                    {/* Proposal content */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Your Proposal</h3>
                      <p className="text-gray-600 whitespace-pre-line">{proposal.proposal}</p>
                    </div>

                    {/* Action button based on status */}
                    <div className="mt-4 flex justify-end">
                      {proposal.status === "Accepted" && (
                        <button className="flex items-center text-sm text-green-600 hover:text-green-800">
                          View Project Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                      {proposal.status === "Pending" && (
                        <span className="text-sm text-amber-600">Awaiting response from expert</span>
                      )}
                      {proposal.status === "Rejected" && (
                        <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                          Find Similar Projects
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  )
}

export default ProposalHistoryPage

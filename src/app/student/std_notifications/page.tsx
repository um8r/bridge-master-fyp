"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Bell, CheckCircle, XCircle, ChevronLeft, Eye, Clock, RefreshCw, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Proposal {
  id: string
  projectTitle: string
  proposal: string
  status: string
  read: boolean
  projectId: string
  expertFirstName: string
  expertLastName: string
  expertImageData: string
}

const StudentNotificationsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread")
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      setLoading(true)
      const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const profileData = await profileResponse.json()

      const studentResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${profileData.userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const studentData = await studentResponse.json()

      const proposalsResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-proposals/get-proposal-for-student/${studentData.id}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } },
      )
      const proposalsData = await proposalsResponse.json()

      // Get read status from localStorage
      const readStatusMap = getReadStatusFromStorage()

      // Apply stored read status to proposals
      const updatedProposals = proposalsData.map((proposal: Proposal) => ({
        ...proposal,
        read: readStatusMap[proposal.id] === true || proposal.read === true,
      }))

      setProposals(updatedProposals)
    } catch (error) {
      setError("Failed to fetch notifications")
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get read status from localStorage
  const getReadStatusFromStorage = () => {
    try {
      const storedStatus = localStorage.getItem("notificationReadStatus")
      return storedStatus ? JSON.parse(storedStatus) : {}
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return {}
    }
  }

  // Save read status to localStorage
  const saveReadStatusToStorage = (id: string, isRead: boolean) => {
    try {
      const currentStatus = getReadStatusFromStorage()
      const updatedStatus = { ...currentStatus, [id]: isRead }
      localStorage.setItem("notificationReadStatus", JSON.stringify(updatedStatus))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProposals()
    setRefreshing(false)
  }

  const handleDismissProposal = (id: string) => {
    // Update local state
    setProposals((prev) => prev.map((proposal) => (proposal.id === id ? { ...proposal, read: true } : proposal)))

    // Persist read status in localStorage
    saveReadStatusToStorage(id, true)

    // Here you would typically also make an API call to update the read status on the server
    // if such an endpoint exists
  }

  const handleViewProject = (projectId: string) => {
    router.push(`/student/project-details/${projectId}`)
  }

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
        }
      case "rejected":
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
        }
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100",
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center border border-red-100">
          <AlertCircle className="h-16 w-16 mb-4 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const unreadProposals = proposals.filter((proposal) => !proposal.read)
  const readProposals = proposals.filter((proposal) => proposal.read)
  const currentProposals = activeTab === "unread" ? unreadProposals : readProposals

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="h-6 w-6 mr-2 text-blue-600" />
              Notifications
            </h1>
            <p className="text-sm text-gray-600">Stay updated on your project proposal statuses</p>
          </div>
          <button
            onClick={handleRefresh}
            className={`ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors ${
              refreshing ? "animate-spin text-blue-600" : "text-gray-600"
            }`}
            disabled={refreshing}
            aria-label="Refresh notifications"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadProposals.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-700">{proposals.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "unread"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("unread")}
          >
            Unread ({unreadProposals.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "read"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("read")}
          >
            Read ({readProposals.length})
          </button>
        </div>

        {/* Empty State */}
        {currentProposals.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No {activeTab} notifications</h2>
            <p className="text-gray-600 mb-6">
              {activeTab === "unread"
                ? "You're all caught up! Check back later for new updates."
                : "You haven't read any notifications yet."}
            </p>
            {activeTab === "read" && unreadProposals.length > 0 && (
              <button
                onClick={() => setActiveTab("unread")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Unread Notifications
              </button>
            )}
          </div>
        )}

        {/* Notifications List */}
        <AnimatePresence>
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {currentProposals.map((proposal) => {
              const statusInfo = getStatusInfo(proposal.status)

              return (
                <motion.div
                  key={proposal.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      {/* Expert Image */}
                      <div className="flex-shrink-0 mr-4">
                        {proposal.expertImageData ? (
                          <img
                            src={proposal.expertImageData || "/placeholder.svg"}
                            alt={`${proposal.expertFirstName} ${proposal.expertLastName}`}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{proposal.projectTitle}</h3>
                          <div
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} border flex items-center`}
                          >
                            {statusInfo.icon}
                            <span className="ml-1">{proposal.status}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-2">
                          From{" "}
                          <span className="font-medium">
                            {proposal.expertFirstName} {proposal.expertLastName}
                          </span>
                        </p>

                        <p className="text-sm text-gray-700 mb-3">
                          Your proposal for this project has been{" "}
                          <span className={`font-semibold ${statusInfo.color}`}>{proposal.status.toLowerCase()}</span>.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-2">
                          {/*<button
                            onClick={() => handleViewProject(proposal.projectId)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Project
                          </button>*/}

                          {activeTab === "unread" && (
                            <button
                              onClick={() => handleDismissProposal(proposal.id)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StudentNotificationsPage

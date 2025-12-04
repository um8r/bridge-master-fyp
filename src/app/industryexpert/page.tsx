"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Import your custom components
import IndustryProfile from "./industrycomponents/IndustryProfile"
import ProjectCard from "./industrycomponents/ProjectsCardd"
import CompletedProjects from "./industrycomponents/CompletedProjects"
import CompletionRequestsComponent from "./completion-requests-component"
import { Bell, Briefcase, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

// Interface for the expert's main profile data
interface IndustryExpertProfile {
  userId: string
  indExptId: string
  companyId: string
  firstName: string
  lastName: string
  email: string
  description: string
  companyName: string
  address: string
  contact: string
  imageData: string
}

// Interface for each project
interface Project {
  id: string
  title: string
  description: string
  endDate: string
  name: string
  status: string
}

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

const IndustryExpertPage: React.FC = () => {
  const router = useRouter()

  // Basic state
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null)
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([])
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completionRequests, setCompletionRequests] = useState<CompletionRequest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // For toggling between tabs
  const [activeTab, setActiveTab] = useState<"unassigned" | "assigned" | "completed" | "requests">("unassigned")

  const fetchCompletionRequests = useCallback(async (expertId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/get-completion-request/${expertId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        },
      )

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setCompletionRequests(data)
          return data
        } else {
          setCompletionRequests([])
          return []
        }
      } else {
        console.error("Failed to fetch completion requests:", res.status)
        setCompletionRequests([])
        return []
      }
    } catch (err) {
      console.error("Error fetching completion requests:", err)
      setCompletionRequests([])
      return []
    }
  }, [])

  const refreshCompletionRequests = useCallback(async () => {
    if (!expertProfile) return

    setIsRefreshing(true)
    try {
      await fetchCompletionRequests(expertProfile.indExptId)
    } finally {
      setIsRefreshing(false)
    }
  }, [expertProfile, fetchCompletionRequests])

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) Fetch basic user info
        const profileResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!profileResponse.ok) throw new Error("Failed to fetch profile.")

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // 2) Fetch the full industry-expert profile
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile.")

        const expertData = await expertResponse.json()
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          companyId: expertData.companyId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          description: expertData.description,
          email: expertData.email,
          companyName: expertData.companyName,
          address: expertData.address,
          contact: expertData.contact,
          imageData: expertData.imageData,
        })

        // Fetch completion requests
        await fetchCompletionRequests(expertData.indExptId)

        // 3) Fetch "Assigned" Projects
        const assignedRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (assignedRes.ok) {
          const assignedData = await assignedRes.json()
          const activeProjects = assignedData.filter((project: Project) => project.status !== "Completed")
          setAssignedProjects(activeProjects)
        }

        // 4) Fetch "Unassigned" Projects
        const unassignedRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (unassignedRes.ok) {
          const unassignedData = await unassignedRes.json()
          setUnassignedProjects(unassignedData)
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndProjects()
  }, [router, fetchCompletionRequests])

  // Periodic refresh for requests
  useEffect(() => {
    if (!expertProfile) return
    fetchCompletionRequests(expertProfile.indExptId)
    const iv = setInterval(() => {
      if (activeTab === "requests") {
        fetchCompletionRequests(expertProfile.indExptId)
      }
    }, 30000)
    return () => clearInterval(iv)
  }, [expertProfile, activeTab, fetchCompletionRequests])

  // Refresh on tab switch
  useEffect(() => {
    if (activeTab === "requests" && expertProfile) {
      fetchCompletionRequests(expertProfile.indExptId)
    }
  }, [activeTab, expertProfile, fetchCompletionRequests])

  if (loading) {
    return <div className="text-center p-8">Loading...</div>
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>
  }
  if (!expertProfile) {
    return <div className="text-center p-8">No profile found</div>
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken")
    router.push("/auth/login-user")
  }

  const assignedCount = assignedProjects.length
  const unassignedCount = unassignedProjects.length
  const completedCount = CompletedProjects.length

  return (
    <div className="min-h-screen bg-white text-gray-700 p-6">
      <div className="container mx-auto space-y-8">
        {/* (A) Industry Expert Profile Section */}
        <IndustryProfile
          companyLogo={expertProfile.imageData}
          companyName={expertProfile.companyName}
          userId={expertProfile.userId}
          indExptId={expertProfile.indExptId}
          companyId={expertProfile.companyId}
          firstName={expertProfile.firstName}
          lastName={expertProfile.lastName}
          description={expertProfile.description}
          email={expertProfile.email}
          address={expertProfile.address}
          contact={expertProfile.contact}
        />

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-900"
        >
          My Dashboard
        </motion.h1>
                {/* Stats */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500 cursor-pointer"
            onClick={() => setActiveTab("assigned")}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-gray-800">{assignedCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500 cursor-pointer"
            onClick={() => setActiveTab("unassigned")}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Unassigned Projects</p>
                <p className="text-2xl font-bold text-gray-800">{unassignedCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 cursor-pointer"
            onClick={() => setActiveTab("completed")}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed Projects</p>
                <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => router.push("/industryexpert/fyp-marketplace")}
            className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg hover:border-indigo-500 cursor-pointer transition"
          >
            <div className="p-4 bg-indigo-100 rounded-full">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Browse FYP Marketplace</h3>
              <p className="text-sm text-gray-500">Discover new projects to mentor</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => router.push("/industryexpert/my-requests")}
            className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg hover:border-blue-500 cursor-pointer transition"
          >
            <div className="p-4 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View My Requests</h3>
              <p className="text-sm text-gray-500">Manage your project requests</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => router.push("/industryexpert/approved-requests")}
            className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg hover:border-blue-500 cursor-pointer transition"
          >
            <div className="p-4 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Approved Requests</h3>
              <p className="text-sm text-gray-500">See Approved Project Requests</p>
            </div>
          </motion.div>

    <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => router.push("/industryexpert/meetings")}
            className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-lg hover:border-blue-500 cursor-pointer transition"
          >
            <div className="p-4 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
              <p className="text-sm text-gray-500">Set Meeting with Student</p>
            </div>
          </motion.div>



        </div>

        {/* Requests Tab */}
        <div className="mb-6">
          <div
            className={`group transition-all duration-300 rounded-xl p-6 cursor-pointer border ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-600 shadow-lg"
                : "bg-white hover:bg-blue-50 text-gray-800 border-gray-200"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold group-hover:underline">
                  Project Completion Requests
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">
                  Click to view and manage completion requests
                </p>
              </div>
              {activeTab === "requests" && (
                <span className="text-sm text-blue-100 font-semibold px-3 py-1">
                  Active
                </span>
              )}
            </div>
          </div>
          {activeTab === "requests" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Project Completion Requests
                  </h2>
                </div>
                {completionRequests.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {completionRequests.length}{" "}
                    {completionRequests.length === 1 ? "Request" : "Requests"}
                  </span>
                )}
              </div>
              {isRefreshing ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-blue-600 font-medium">
                    Refreshing requests...
                  </span>
                </div>
              ) : (
                <CompletionRequestsComponent
                  requests={completionRequests}
                  onRefresh={refreshCompletionRequests}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IndustryExpertPage

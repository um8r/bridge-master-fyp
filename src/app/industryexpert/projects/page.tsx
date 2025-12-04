"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import ProjecttCard from "../industrycomponents/ProjectsPageCard"
import { Briefcase, Clock, CheckCircle, Loader2 } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  endDate: string
  status?: string
}

const ExpertProjectsPage: React.FC = () => {
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([])
  const [unassignedProjects, setUnassignedProjects] = useState<Project[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<"assigned" | "unassigned" | "completed">("assigned")
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        // Fetch expert ID
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!profileResponse.ok) throw new Error("Failed to fetch user info")
        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Fetch expert profile
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch expert profile")
        const expertData = await expertResponse.json()

        // Fetch all assigned projects
        const assignedResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-assigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (assignedResponse.ok) {
          const allAssignedData = await assignedResponse.json()

          // Filter out completed projects
          const activeProjects = allAssignedData.filter(
            (project: Project) => project.status !== "Completed" && project.status !== "PaymentPending",
          )

          // Filter completed projects
          const completed = allAssignedData.filter(
            (project: Project) => project.status === "Completed" || project.status === "PaymentPending",
          )

          setAssignedProjects(activeProjects)
          setCompletedProjects(completed)
        } else {
          throw new Error("Failed to fetch assigned projects")
        }

        // Fetch unassigned projects
        const unassignedResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-unassigned-expert-projects?expertId=${expertData.indExptId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (unassignedResponse.ok) {
          const unassignedData = await unassignedResponse.json()
          setUnassignedProjects(unassignedData)
        } else {
          throw new Error("Failed to fetch unassigned projects")
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading your projects...</p>
        </div>
      </div>
    )
  }

  // Count projects for each category
  const assignedCount = assignedProjects.length
  const unassignedCount = unassignedProjects.length
  const completedCount = completedProjects.length

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            My Projects
          </motion.h1>
          <p className="text-gray-600">Manage and track all your industry projects</p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500"
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
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500"
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
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500"
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1 inline-flex">
          <button
            onClick={() => setActiveTab("assigned")}
            className={`py-2 px-6 rounded-md transition-all duration-200 font-medium ${
              activeTab === "assigned" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab("unassigned")}
            className={`py-2 px-6 rounded-md transition-all duration-200 font-medium ${
              activeTab === "unassigned" ? "bg-amber-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Unassigned Projects
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-2 px-6 rounded-md transition-all duration-200 font-medium ${
              activeTab === "completed" ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Completed Projects
          </button>
        </div>

        {/* Project Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === "assigned" && assignedProjects.length > 0 ? (
            assignedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProjecttCard
                  projectId={project.id}
                  title={project.title}
                  description={project.description}
                  endDate={project.endDate}
                />
              </motion.div>
            ))
          ) : activeTab === "unassigned" && unassignedProjects.length > 0 ? (
            unassignedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProjecttCard
                  projectId={project.id}
                  title={project.title}
                  description={project.description}
                  endDate={project.endDate}
                />
              </motion.div>
            ))
          ) : activeTab === "completed" && completedProjects.length > 0 ? (
            completedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProjecttCard
                  projectId={project.id}
                  title={project.title}
                  description={project.description}
                  endDate={project.endDate}
                  status={project.status}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "assigned" ? (
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  ) : activeTab === "unassigned" ? (
                    <Clock className="h-8 w-8 text-gray-400" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {activeTab === "assigned"
                    ? "No active projects available"
                    : activeTab === "unassigned"
                      ? "No unassigned projects available"
                      : "No completed projects available"}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "assigned"
                    ? "You don't have any active projects at the moment."
                    : activeTab === "unassigned"
                      ? "There are no unassigned projects available for you."
                      : "You haven't completed any projects yet."}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ExpertProjectsPage

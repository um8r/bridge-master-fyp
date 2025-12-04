"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface ActiveProject {
  id: string
  title: string
  description: string
  studentName: string
  endDate: string
  status: string
}

interface ActiveProjectsProps {
  expertId: string
}

const ActiveProjects = ({ expertId }: ActiveProjectsProps) => {
  const router = useRouter()
  const [projects, setProjects] = useState<ActiveProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActiveProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch assigned projects
        const res = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-assigned-expert-projects?expertId=${expertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await res.json()

        // Filter only active projects (not completed)
        const activeProjects = data.filter((project: ActiveProject) => project.status !== "Completed")

        setProjects(activeProjects)
      } catch (err) {
        console.error("Error fetching active projects:", err)
        setError("Failed to load active projects")
      } finally {
        setLoading(false)
      }
    }

    if (expertId) {
      fetchActiveProjects()
    }
  }, [expertId, router])

  const handleProjectClick = (projectId: string) => {
    router.push(`/industryexpert/projects/milestone/${projectId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Projects</h3>
        <p className="text-gray-500">You donot have any active projects at the moment.</p>
      </div>
    )
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
          Active Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-300 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform cursor-pointer"
            onClick={() => handleProjectClick(project.id)}
          >
            <h3 className="text-xl font-bold text-blue-800 mb-3">{project.title}</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Student:</strong> {project.studentName}
            </p>
            <div className="mt-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "PendingCompletion"
                    ? "bg-yellow-100 text-yellow-800"
                    : project.status === "PaymentPending"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>End Date:</strong> {project.endDate}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ActiveProjects

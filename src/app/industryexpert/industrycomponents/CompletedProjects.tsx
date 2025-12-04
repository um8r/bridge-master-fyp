"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

interface CompletedProject {
  id: string
  title: string
  description: string
  studentName: string
  endDate: string
  status: string
}

interface CompletedProjectsProps {
  expertId: string
}

const CompletedProjects = ({ expertId }: CompletedProjectsProps) => {
  const router = useRouter()
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // A few random background gradients for visual variety
  const gradientStyles = [
    "bg-gradient-to-r from-green-200 via-teal-200 to-blue-200",
    "bg-gradient-to-r from-purple-200 via-pink-200 to-red-200",
    "bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200",
  ]

  // Get a random gradient for each project (but keep it consistent)
  const getGradient = (id: string) => {
    // Use the last character of the ID as a simple hash
    const index = id.charCodeAt(id.length - 1) % gradientStyles.length
    return gradientStyles[index]
  }

  useEffect(() => {
    const fetchCompletedProjects = async () => {
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

        // Filter projects that are either Completed or PaymentPending
        // PaymentPending projects are essentially completed from the expert's perspective
        // and are just waiting for payment to be finalized
        const completedProjects = data.filter(
          (project: CompletedProject) => project.status === "Completed" || project.status === "PaymentPending",
        )

        setProjects(completedProjects)
      } catch (err) {
        console.error("Error fetching completed projects:", err)
        setError("Failed to load completed projects")
      } finally {
        setLoading(false)
      }
    }

    if (expertId) {
      fetchCompletedProjects()
    }
  }, [expertId, router])

  const handleViewProgress = (projectId: string) => {
    router.push(`/industryexpert/projects/milestone/${projectId}`)
  }

  const handleViewProfile = (studentId: string) => {
    router.push(`/industryexpert/student-profile/${studentId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-gray-800 rounded">
        <p>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center">
        <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Completed Projects</h3>
        <p className="text-gray-400">Projects will appear here once they are marked as completed.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`relative p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all overflow-hidden cursor-pointer ${getGradient(
            project.id,
          )}`}
        >
          <div className="absolute inset-0 opacity-20 bg-cover bg-center"></div>
          <div className="relative z-10">
            {/* Project Title */}
            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>

            {/* Project Description */}
            <p className="text-gray-200 mb-2">{project.description}</p>

            {/* End Date */}
            <p className="text-gray-300 mb-1">
              <strong>End Date:</strong> {project.endDate}
            </p>

            {/* Student Name */}
            <p className="text-gray-300 mb-4">
              <strong>Student:</strong> {project.studentName}
            </p>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "Completed" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"
                }`}
              >
                {project.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleViewProgress(project.id)}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                View Progress
              </button>
              <button
                onClick={() => handleViewProfile(project.id)}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CompletedProjects

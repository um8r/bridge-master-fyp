"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface UnassignedProject {
  id: string
  title: string
  description: string
  endDate: string
}

interface UnassignedProjectsProps {
  expertId: string
}

const UnassignedProjects = ({ expertId }: UnassignedProjectsProps) => {
  const router = useRouter()
  const [projects, setProjects] = useState<UnassignedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUnassignedProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch unassigned projects
        const res = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-unassigned-expert-projects?expertId=${expertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!res.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await res.json()
        setProjects(data)
      } catch (err) {
        console.error("Error fetching unassigned projects:", err)
        setError("Failed to load unassigned projects")
      } finally {
        setLoading(false)
      }
    }

    if (expertId) {
      fetchUnassignedProjects()
    }
  }, [expertId, router])

  const handleProjectClick = (projectId: string) => {
    router.push(`/industryexpert/projects/details/${projectId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-200 rounded-full animate-spin"></div>
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
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Unassigned Projects</h3>
        <p className="text-gray-500">There are no projects available for you to take at the moment.</p>
      </div>
    )
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
          Unassigned Projects
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
            <h3 className="text-xl font-bold text-purple-800 mb-3">{project.title}</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Available</span>
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

export default UnassignedProjects

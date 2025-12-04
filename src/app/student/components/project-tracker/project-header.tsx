"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign } from "lucide-react"
import type { ProjectDetailsExtended } from "../../types/project-tracker-types"

interface ProjectHeaderProps {
  project: ProjectDetailsExtended | null
  router: any
}

const ProjectHeader = ({ project, router }: ProjectHeaderProps) => {
  // Get project image based on title or description
  const getProjectImage = () => {
    if (!project) return "/project-management-teamwork.png"

    const title = project.title.toLowerCase()
    const description = project.description.toLowerCase()

    if (title.includes("web") || description.includes("web")) {
      return "/web-development-concept.png"
    } else if (
      title.includes("mobile") ||
      description.includes("mobile") ||
      title.includes("app") ||
      description.includes("app")
    ) {
      return "/mobile-app-development.png"
    } else if (
      title.includes("ai") ||
      description.includes("ai") ||
      title.includes("machine learning") ||
      description.includes("machine learning")
    ) {
      return "/artificial-intelligence-network.png"
    } else if (title.includes("data") || description.includes("data")) {
      return "/data-science-concept.png"
    } else {
      return "/technology-project.png"
    }
  }

  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={getProjectImage() || "/placeholder.svg"}
          alt={project?.title || "Project Banner"}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-800 rounded-full p-2 transition duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          {project?.title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-2 flex flex-wrap gap-2"
        >
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              project?.status === "Completed"
                ? "bg-green-100 text-green-800"
                : project?.status === "PendingCompletion"
                  ? "bg-yellow-100 text-yellow-800"
                  : project?.status === "PaymentPending"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {project?.status === "Completed" && <CheckCircle className="mr-1 h-4 w-4" />}
            {project?.status === "PendingCompletion" && <Clock className="mr-1 h-4 w-4" />}
            {project?.status === "PaymentPending" && <DollarSign className="mr-1 h-4 w-4" />}
            {project?.status}
          </span>
          <span className="bg-white/70 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Due: {new Date(project?.endDate || "").toLocaleDateString()}
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectHeader

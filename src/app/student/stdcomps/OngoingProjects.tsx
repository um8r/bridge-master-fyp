"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, Calendar, User, ArrowRight, AlertTriangle, CheckCircle, PlusCircle } from "lucide-react"

interface OngoingProject {
  id: string
  title: string
  description: string
  expertName: string
  status: string
  endDate: string
}

interface Props {
  ongoingProjects: OngoingProject[]
}

const OngoingProjectsSection: React.FC<Props> = ({ ongoingProjects }) => {
  const router = useRouter()

  // Filter out completed projects and also projects with PaymentPending status
  // as they are essentially in the final stage of completion
  const filteredProjects = ongoingProjects.filter(
    (project) => project.status !== "Completed" && project.status !== "PaymentPending",
  )

  const handleProjectClick = (projectId: string) => {
    router.push(`/student/projects/milestone/${projectId}`)
  }

  // Calculate days remaining for a project
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status color and icon
  const getStatusInfo = (status: string, daysRemaining: number) => {
    if (status === "PendingCompletion") {
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
      }
    } else if (daysRemaining < 7) {
      return {
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        borderColor: "border-orange-200",
        icon: <AlertTriangle className="w-4 h-4" />,
      }
    } else {
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        icon: <CheckCircle className="w-4 h-4" />,
      }
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 mb-3">
              Ongoing Projects
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Track your active projects, monitor progress, and collaborate with industry experts to achieve your
              academic goals.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/student/projects/create")}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Create New Project</span>
          </motion.button>
        </div>

        {filteredProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => {
              const daysRemaining = getDaysRemaining(project.endDate)
              const statusInfo = getStatusInfo(project.status, daysRemaining)

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
                >
                  {/* Project Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        {statusInfo.icon}
                        <span className="ml-1">{project.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-4">{project.description}</p>

                    {/* Project Meta */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{project.expertName}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Footer */}
                  <div className="p-4 mt-auto bg-gray-50 flex items-center justify-between">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        daysRemaining < 0
                          ? "bg-red-100 text-red-800"
                          : daysRemaining < 7
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {daysRemaining < 0
                        ? "Overdue"
                        : daysRemaining === 0
                          ? "Due today"
                          : `${daysRemaining} days remaining`}
                    </div>

                    <button
                      onClick={() => handleProjectClick(project.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-gray-200">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, 100 - (daysRemaining / 30) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-200"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PlusCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No ongoing projects</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You donot have any active projects at the moment. Start a new project to collaborate with industry
              experts.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/student/projects/create")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>Create Your First Project</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default OngoingProjectsSection

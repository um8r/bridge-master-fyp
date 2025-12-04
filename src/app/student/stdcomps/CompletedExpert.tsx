"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, User, ArrowRight, Award, Star, Download, Eye } from "lucide-react"

interface CompletedIndustryProject {
  id: string
  title: string
  description: string
  expertName: string
  status: string
  endDate: string
}

interface Props {
  projects: CompletedIndustryProject[]
}

const CompletedIndustryProjectsSection: React.FC<Props> = ({ projects }) => {
  const router = useRouter()

  // Filter to include both Completed projects and PaymentPending projects
  // PaymentPending projects are essentially completed from the student's perspective
  // and are just waiting for the expert to make the payment
  const completedProjects = projects.filter(
    (project) => project.status === "Completed" || project.status === "PaymentPending",
  )

  const handleProjectClick = (projectId: string) => {
    router.push(`/student/projects/detail/${projectId}`)
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
    <section className="py-16 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-3">
              Completed Industry Projects
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Showcase your achievements and review your successfully completed projects with industry experts.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/student/certificates")}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center"
          >
            <Award className="w-5 h-5 mr-2" />
            <span>View Certificates</span>
          </motion.button>
        </div>

        {completedProjects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {completedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Project Header with Ribbon */}
                <div className="relative">
                  <div className="absolute top-0 right-0">
                    <div
                      className={`w-32 h-32 overflow-hidden absolute -top-16 -right-16 ${
                        project.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      <div className="text-white font-semibold py-1 text-center text-xs absolute bottom-0 right-0 w-32 transform rotate-45 translate-y-12 translate-x-6">
                        {project.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start mb-3">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          project.status === "Completed" ? "bg-green-100" : "bg-blue-100"
                        }`}
                      >
                        <CheckCircle
                          className={`w-5 h-5 ${project.status === "Completed" ? "text-green-600" : "text-blue-600"}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                        <p className="text-gray-500 text-sm">
                          Completed on {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2 mb-4">{project.description}</p>

                    {/* Project Meta */}
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <User className="w-4 h-4 mr-2 text-green-500" />
                      <span>Expert: {project.expertName}</span>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-600">A+</div>
                        <div className="text-xs text-gray-500">Grade</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="flex items-center justify-center text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-lg font-bold ml-1">4.9</span>
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 20) + 5}</div>
                        <div className="text-xs text-gray-500">Files</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Footer */}
                <div className="p-4 mt-auto bg-gray-50 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleProjectClick(project.id)}
                    className={`text-sm font-medium flex items-center ${
                      project.status === "Completed"
                        ? "text-green-600 hover:text-green-800"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-200"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No completed projects yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You havenot completed any industry projects yet. Complete your ongoing projects to see them here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/student/projects")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 inline-flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              <span>View All Projects</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default CompletedIndustryProjectsSection

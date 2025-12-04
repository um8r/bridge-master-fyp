"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  X,
  Code,
  CheckCircle,
  UserCircle,
  Building,
  Send,
  DollarSign,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import ProposalModal from "../../stdcomps/ProposalModal"

interface ExpertProject {
  id: string
  title: string
  description: string
  stack?: string
  status?: string
  expertName?: string
  companyName?: string
  budget?: number
  startDate?: string
  endDate?: string
  isFeatured?: boolean
  matchScore?: number
  isRequested?: boolean
}

interface ProjectDetailsPanelProps {
  project: ExpertProject
  onClose: () => void
}

const ProjectDetailsPanel: React.FC<ProjectDetailsPanelProps> = ({ project, onClose }) => {
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false)
  const [studentId, setStudentId] = useState<string>("")

  // Fetch the student ID if needed
  useEffect(() => {
    async function fetchStudentId() {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      try {
        const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) return

        const data = await response.json()
        const studentRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${data.userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!studentRes.ok) return

        const studentData = await studentRes.json()
        setStudentId(studentData.id)
      } catch (error) {
        console.error("Error fetching student data:", error)
      }
    }

    fetchStudentId()
  }, [])

  // Get project image based on title
  const getProjectImage = (title: string) => {
    const seed = title.length % 3
    const images = [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
      "https://images.unsplash.com/photo-1677442135136-760c813a6a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    ]
    return images[seed]
  }

  // Get project benefits
  const getProjectBenefits = () => {
    return [
      "Work directly with industry experts",
      "Add a professional project to your portfolio",
      "Potential for publication or conference presentation",
      "Networking opportunities with industry professionals",
      "Flexible working hours",
    ]
  }

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-y-auto max-h-screen border border-blue-100"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 opacity-50 -z-10"></div>

      {/* Project Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getProjectImage(project.title) || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-80"></div>

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 bg-white/70 text-gray-600 hover:text-gray-900 rounded-full backdrop-blur-sm transition-colors duration-300 shadow-sm"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Expert Info */}
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
            <img
              src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt={project.expertName || "Expert"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-gray-900 font-medium">{project.expertName || "Expert"}</p>
            <p className="text-xs text-blue-700">{project.companyName || "Company"}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Project Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 tracking-wide">
          {project.title}
        </h1>

        {/* Opportunity Banner */}
        <div className="mb-6 bg-blue-50 rounded-lg p-3 border border-blue-200 flex items-center">
          <Zap className="text-amber-600 w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-blue-800 text-sm font-medium">
            This is your chance to work on a real-world project and build your portfolio!
          </p>
        </div>

        {/* Project Info */}
        <div className="mb-8 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tech Stack */}
            {project.stack && (
              <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Code className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-700 block mb-1">Tech Stack</span>
                  <span className="text-gray-700">{project.stack}</span>
                </div>
              </div>
            )}

            {/* Status */}
            {project.status && (
              <div className="flex items-start p-3 rounded-lg bg-amber-50 border border-amber-100">
                <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-700 block mb-1">Status</span>
                  <span className="text-gray-700">{project.status}</span>
                </div>
              </div>
            )}

            {/* Expert */}
            {project.expertName && (
              <div className="flex items-start p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <UserCircle className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-indigo-700 block mb-1">Expert</span>
                  <span className="text-gray-700">{project.expertName}</span>
                </div>
              </div>
            )}

            {/* Company */}
            {project.companyName && (
              <div className="flex items-start p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Building className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-700 block mb-1">Company</span>
                  <span className="text-gray-700">{project.companyName}</span>
                </div>
              </div>
            )}

            {/* Budget */}
            {project.budget !== undefined && (
              <div className="flex items-start p-3 rounded-lg bg-green-50 border border-green-100">
                <DollarSign className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-green-700 block mb-1">Budget</span>
                  <span className="text-gray-700">${project.budget}</span>
                </div>
              </div>
            )}

            {/* Dates */}
            {(project.startDate || project.endDate) && (
              <div className="flex items-start p-3 rounded-lg bg-pink-50 border border-pink-100">
                <Calendar className="w-5 h-5 text-pink-600 mr-3 mt-0.5" />
                <div>
                  <span className="font-semibold text-pink-700 block mb-1">Timeline</span>
                  <div className="flex items-center text-gray-700">
                    {project.startDate && <span>{project.startDate}</span>}
                    {project.startDate && project.endDate && <ArrowRight className="w-3 h-3 mx-2" />}
                    {project.endDate && <span>{project.endDate}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {project.isFeatured && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200">
              <Award className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-700">Featured Project</span>
            </div>
          )}

          {/* Match Score */}
          {project.matchScore !== undefined && project.matchScore > 0 && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 ml-2">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                {project.matchScore} skill{project.matchScore !== 1 ? "s" : ""} matched
              </span>
            </div>
          )}

          {/* Project Benefits */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-green-700 flex items-center mb-3">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              Benefits
            </h3>
            <ul className="space-y-2 pl-6">
              {getProjectBenefits().map((benefit, index) => (
                <li key={index} className="text-gray-700 text-sm flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit Proposal Button */}
        <motion.button
          className="group w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setShowProposalModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            <Send className="w-5 h-5 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            Submit Your Proposal
          </span>
        </motion.button>

        {/* Motivational Text */}
        <p className="text-center text-sm text-blue-700 mt-3 italic">
          Showcase your unique skills and stand out from the crowd!
        </p>

        {/* Timeline */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-blue-700">Project Timeline</h3>
          </div>

          <div className="relative pl-8 border-l-2 border-blue-200 space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-500"></div>
              <h4 className="text-blue-700 font-medium">Application Phase</h4>
              <p className="text-sm text-gray-600 mt-1">
                Submit your proposal explaining why you are a good fit for this project
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-indigo-500"></div>
              <h4 className="text-indigo-700 font-medium">Selection Process</h4>
              <p className="text-sm text-gray-600 mt-1">
                The expert will review all proposals and select the best candidate
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-green-500"></div>
              <h4 className="text-green-700 font-medium">Project Kickoff</h4>
              <p className="text-sm text-gray-600 mt-1">
                Once selected, you will begin working with the expert on the project
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-amber-500"></div>
              <h4 className="text-amber-700 font-medium">Project Completion</h4>
              <p className="text-sm text-gray-600 mt-1">
                Deliver your final work and receive feedback from your expert
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <ProposalModal projectId={project.id} studentId={studentId} onClose={() => setShowProposalModal(false)} />
      )}
    </motion.div>
  )
}

export default ProjectDetailsPanel

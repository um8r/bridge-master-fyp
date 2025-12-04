"use client"

import type React from "react"

import { motion } from "framer-motion"
import { CheckCircle, DollarSign, ExternalLink } from "lucide-react"

interface ProjectStatusCardProps {
  isPaymentPending: boolean
  isProjectComplete: boolean
  projectLink: string
  onPaymentProcess: () => void
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  isPaymentPending,
  isProjectComplete,
  projectLink,
  onPaymentProcess,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 ${
        isPaymentPending ? "border-blue-500" : "border-green-500"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`rounded-full p-2 mr-3 ${isPaymentPending ? "bg-blue-100" : "bg-green-100"}`}>
            {isPaymentPending ? (
              <DollarSign className="h-5 w-5 text-blue-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {isPaymentPending ? "Payment Required" : "Project Completed"}
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          {isPaymentPending
            ? "Project completion approved. Payment is required to finalize the project."
            : "This project is complete. Editing is disabled."}
        </p>

        {/* Show deployment link for completed projects */}
        {isProjectComplete && projectLink && (
          <div className="mb-4">
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mb-2"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              View Project
            </a>
          </div>
        )}

        <button
          onClick={onPaymentProcess}
          className={`w-full py-2 px-4 font-medium rounded-lg transition duration-200 flex items-center justify-center ${
            isPaymentPending ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <DollarSign className="mr-2 h-5 w-5" />
          {isPaymentPending ? "Make Payment" : "View Payment Details"}
        </button>
      </div>
    </motion.div>
  )
}

export default ProjectStatusCard

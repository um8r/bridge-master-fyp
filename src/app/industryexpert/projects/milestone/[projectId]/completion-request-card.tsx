"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Flag, CheckCircle, X, ExternalLink } from "lucide-react"

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
  deploymentLink?: string
}

interface CompletionRequestCardProps {
  request: CompletionRequest
  projectLink: string
  onApprove: () => void
  onReject: () => void
}

const CompletionRequestCard: React.FC<CompletionRequestCardProps> = ({ request, projectLink, onApprove, onReject }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <Flag className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Completion Request</h3>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            <span className="font-medium text-gray-700">Student:</span> {request.studentName}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-700">Request Date:</span>{" "}
            {new Date(request.requestDate).toLocaleString()}
          </p>

          {/* Show deployment link if available */}
          {projectLink && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-600 mb-2">
                <span className="font-medium text-gray-700">Deployment Link:</span>
              </p>
              <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline flex items-center break-all"
              >
                <ExternalLink className="mr-1 h-4 w-4 flex-shrink-0" />
                {projectLink}
              </a>
            </div>
          )}

          <p className="text-gray-600">
            The student has requested to mark this project as complete. Please review the project milestones, tasks, and
            deployment link before approving or rejecting this request.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onApprove}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2 h-5 w-5" />
            Reject
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CompletionRequestCard

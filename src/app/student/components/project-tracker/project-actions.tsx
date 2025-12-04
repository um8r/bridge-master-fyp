"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Award, CheckCircle, Clock, DollarSign } from "lucide-react"

interface ProjectActionsProps {
  isEditingDisabled: boolean
  isPendingCompletion: boolean
  isPaymentPending: boolean
  isProjectComplete: boolean
  projectId: string
  onRequestCompletion: () => void
}

const ProjectActions = ({
  isEditingDisabled,
  isPendingCompletion,
  isPaymentPending,
  isProjectComplete,
  projectId,
  onRequestCompletion,
}: ProjectActionsProps) => {
  return (
    <>
      {/* Project Status Actions */}
      {!isEditingDisabled && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Project Actions</h3>
            <button
              onClick={onRequestCompletion}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Request Project Completion
            </button>
          </div>
        </div>
      )}

      {isPendingCompletion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500 border-t border-r border-b border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 rounded-full p-2 mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Completion Request Pending</h3>
            </div>
            <p className="text-gray-600">
              Your completion request has been sent to the industry expert. Editing is disabled until the request is
              processed.
            </p>
          </div>
        </motion.div>
      )}

      {isPaymentPending && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-blue-500 border-t border-r border-b border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Payment Pending</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your completion request has been approved. The industry expert will now process the payment.
            </p>
          </div>
        </motion.div>
      )}

      {isProjectComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-green-500 border-t border-r border-b border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Project Completed</h3>
            </div>
            <p className="text-gray-600 mb-4">This project is complete. Editing is disabled.</p>
            <Link
              href={`/student/project-certificate/${projectId}`}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Award className="mr-2 h-5 w-5" />
              View Completion Certificate
            </Link>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default ProjectActions

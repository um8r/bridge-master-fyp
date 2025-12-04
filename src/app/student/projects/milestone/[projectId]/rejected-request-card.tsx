"use client"

import type React from "react"
import { motion } from "framer-motion"
import { X, RefreshCw, AlertTriangle } from "lucide-react"

interface RejectedRequestCardProps {
  onSendNewRequest: () => void
}

const RejectedRequestCard: React.FC<RejectedRequestCardProps> = ({ onSendNewRequest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-red-500"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 rounded-full p-2 mr-3">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Completion Request Rejected</h3>
        </div>

        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Your completion request was rejected</p>
              <p className="text-red-700 text-sm mt-1">
                The industry expert has reviewed your project and found that it needs more work before completion.
                Please review the feedback, make necessary improvements, and submit a new completion request.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          You can now submit a new completion request once you have addressed the feedback and made the required
          improvements.
        </p>

        <button
          onClick={onSendNewRequest}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Submit New Completion Request
        </button>
      </div>
    </motion.div>
  )
}

export default RejectedRequestCard

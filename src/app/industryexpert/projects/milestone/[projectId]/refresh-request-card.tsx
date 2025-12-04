"use client"

import type React from "react"

import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

interface RefreshRequestCardProps {
  onRefresh: () => void
}

const RefreshRequestCard: React.FC<RefreshRequestCardProps> = ({ onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <RefreshCw className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Pending Completion</h3>
        </div>

        <p className="text-gray-600 mb-4">
          This project has a pending completion request, but the details could not be loaded. Click the button below to
          refresh and check for completion requests.
        </p>

        <button
          onClick={onRefresh}
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Refresh Completion Requests
        </button>
      </div>
    </motion.div>
  )
}

export default RefreshRequestCard

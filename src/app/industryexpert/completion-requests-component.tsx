"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Calendar, User, FileText, ArrowRight } from "lucide-react"

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

interface CompletionRequestsProps {
  requests: CompletionRequest[]
  onRefresh?: () => Promise<void>
}

const CompletionRequestsComponent: React.FC<CompletionRequestsProps> = ({ requests, onRefresh }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [localRequests, setLocalRequests] = useState<CompletionRequest[]>(requests)

  // Update local requests when the prop changes
  useEffect(() => {
    setLocalRequests(requests)
  }, [requests])

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Error refreshing completion requests:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-200",
        }
      case "ACCEPTED":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        }
      default:
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        }
    }
  }

  if (localRequests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completion Requests</h3>
        <p className="text-gray-600 mb-6">There are no pending completion requests at this time.</p>

        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                <span>Check for New Requests</span>
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {onRefresh && (
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                <span>Refresh Requests</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {localRequests.map((request, index) => {
          const statusColors = getStatusColor(request.status)

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">{request.projectTitle}</h3>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{request.studentName}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}
                      >
                        {request.status}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/industryexpert/projects/milestone/${request.projectId}`)}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                  >
                    <span>View Project</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default CompletionRequestsComponent

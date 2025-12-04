"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle, ArrowRight, FileText } from "lucide-react"

interface ProjectCardProps {
  projectId: string
  title: string
  description: string
  endDate: string
  status?: string
}

const ProjecttCard: React.FC<ProjectCardProps> = ({ projectId, title, description, endDate, status }) => {
  const router = useRouter()

  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  // Determine if project is completed
  const isCompleted = status === "Completed"

  // Determine if project is payment pending
  const isPaymentPending = status === "PaymentPending"

  // Get days remaining until end date
  const getDaysRemaining = () => {
    try {
      const today = new Date()
      const end = new Date(endDate)
      const diffTime = end.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch (e) {
      return null
    }
  }

  const daysRemaining = getDaysRemaining()

  // Determine urgency level based on days remaining
  const getUrgencyColor = () => {
    if (isCompleted || isPaymentPending) return "bg-green-100 text-green-800"
    if (daysRemaining === null) return "bg-gray-100 text-gray-800"
    if (daysRemaining < 0) return "bg-red-100 text-red-800"
    if (daysRemaining < 7) return "bg-amber-100 text-amber-800"
    if (daysRemaining < 14) return "bg-blue-100 text-blue-800"
    return "bg-green-100 text-green-800"
  }

  const handleCardClick = () => {
    router.push(`/industryexpert/projects/milestone/${projectId}`)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
      onClick={handleCardClick}
    >
      {/* Top accent bar - color based on status */}
      <div
        className={`h-2 w-full ${
          isCompleted
            ? "bg-green-500"
            : isPaymentPending
              ? "bg-purple-500"
              : daysRemaining && daysRemaining < 0
                ? "bg-red-500"
                : daysRemaining && daysRemaining < 7
                  ? "bg-amber-500"
                  : "bg-blue-500"
        }`}
      ></div>

      <div className="p-5">
        {/* Project Title with Icon */}
        <div className="flex items-start mb-3">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{title}</h3>
        </div>

        {/* Project Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{description}</p>

        {/* Project Details */}
        <div className="space-y-2 mb-4">
          {/* End Date */}
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-700">
              End Date: <span className="font-medium">{formatDate(endDate)}</span>
            </span>
          </div>

          {/* Days Remaining */}
          {!isCompleted && !isPaymentPending && daysRemaining !== null && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-700">
                {daysRemaining < 0 ? (
                  <span className="text-red-600 font-medium">Overdue by {Math.abs(daysRemaining)} days</span>
                ) : (
                  <span>
                    Days remaining: <span className="font-medium">{daysRemaining}</span>
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Status and Action */}
        <div className="flex justify-between items-center">
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor()}`}>
            {isCompleted ? (
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Completed</span>
              </div>
            ) : isPaymentPending ? (
              <span>Payment Pending</span>
            ) : daysRemaining && daysRemaining < 0 ? (
              <span>Overdue</span>
            ) : daysRemaining && daysRemaining < 7 ? (
              <span>Urgent</span>
            ) : (
              <span>Active</span>
            )}
          </div>

          {/* View Details Button */}
          <div className="text-blue-600 text-sm font-medium flex items-center group">
            <span>View</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjecttCard

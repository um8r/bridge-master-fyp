"use client"

import type React from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, Clock } from "lucide-react"

interface TimelineItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
}

interface MilestoneTimelineProps {
  milestones: TimelineItem[]
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return <p className="text-gray-400">No milestones for timeline.</p>
  }

  // Sort milestones by achievement date
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.achievementDate).getTime() - new Date(b.achievementDate).getTime(),
  )

  return (
    <div className="space-y-6 relative">
      {/* Timeline connector line */}
      <div className="absolute left-7 top-7 bottom-7 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300/30 z-0"></div>

      {sortedMilestones.map((mile, index) => {
        const progressValue = mile.isCompleted ? 100 : 0
        const formattedDate = new Date(mile.achievementDate).toLocaleDateString()

        return (
          <motion.div
            key={mile.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 relative z-10"
          >
            {/* Circular Progress */}
            <div className="w-14 h-14 flex-shrink-0">
              <CircularProgressbar
                value={progressValue}
                text={`${progressValue}%`}
                styles={buildStyles({
                  pathColor: mile.isCompleted ? "#3B82F6" : "#9CA3AF",
                  textColor: "#D1D5DB",
                  trailColor: "#374151",
                  textSize: "28px",
                })}
              />
            </div>

            {/* Content */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-lg flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-600">{mile.title}</h3>
                  {mile.description && <p className="text-sm text-gray-500 mt-1">{mile.description}</p>}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                    mile.isCompleted ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-300"
                  }`}
                >
                  {mile.isCompleted ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
                <span className="ml-auto text-xs font-medium text-blue-400">#{index + 1}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default MilestoneTimeline

"use client"

import { motion } from "framer-motion"
import { Calendar, CheckCircle, Clock, FileText, Plus } from "lucide-react"
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline"
import type { ProgressItem, MilestoneComment } from "../../types/project-tracker-types"

interface MilestonesTabProps {
  progressItems: ProgressItem[]
  comments: Record<string, MilestoneComment[]>
  isEditingDisabled: boolean
  onOpenModal: (item?: ProgressItem) => void
}

const MilestonesTab = ({ progressItems, comments, isEditingDisabled, onOpenModal }: MilestonesTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Milestones</h2>
        {!isEditingDisabled && (
          <button
            onClick={() => onOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Milestone
          </button>
        )}
      </div>

      {progressItems.length > 0 ? (
        <div>
          <div className="mt-4 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Timeline</h3>
            <MilestoneTimeline milestones={progressItems} />
          </div>

          {/* Individual Milestones with Comments */}
          <div className="space-y-6">
            {progressItems.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                          milestone.isCompleted ? "bg-green-100" : "bg-yellow-100"
                        }`}
                      >
                        {milestone.isCompleted ? (
                          <CheckCircle className={`h-5 w-5 text-green-600`} />
                        ) : (
                          <Clock className={`h-5 w-5 text-yellow-600`} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                        <p className="text-gray-600 mt-1">{milestone.description}</p>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <p className="text-sm text-gray-500">
                            Target date: {new Date(milestone.achievementDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          milestone.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {milestone.isCompleted ? "Completed" : "In Progress"}
                      </span>
                      {!isEditingDisabled && (
                        <button
                          onClick={() => onOpenModal(milestone)}
                          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-blue-600 mb-2">Expert Comments</h4>
                    {comments[milestone.id] && comments[milestone.id].length > 0 ? (
                      <div className="space-y-3">
                        {comments[milestone.id].map((comment) => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-700">{comment.comment}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-600">{comment.commenterName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.commentDate).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No comments yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-6">No milestones found for this project.</p>
          {!isEditingDisabled && (
            <button
              onClick={() => onOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Milestone
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MilestonesTab

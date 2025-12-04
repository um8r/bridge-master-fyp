"use client"

import { motion } from "framer-motion"
import { CheckSquare, FileText, Square } from "lucide-react"
import type { TaskItem } from "../../types/project-tracker-types"

interface TasksTabProps {
  tasks: TaskItem[]
  isEditingDisabled: boolean
  onTaskToggle: (task: TaskItem) => void
}

const TasksTab = ({ tasks, isEditingDisabled, onTaskToggle }: TasksTabProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No tasks assigned to this project yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task, index) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => onTaskToggle(task)}
                      disabled={isEditingDisabled || task.taskStatus === "COMPLETED"}
                      className="focus:outline-none"
                    >
                      {task.taskStatus === "COMPLETED" ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="ml-3 flex-1">
                    <p
                      className={`font-medium ${
                        task.taskStatus === "COMPLETED" ? "line-through text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {task.task}
                    </p>
                    {task.description && (
                      <p
                        className={`mt-1 text-sm ${
                          task.taskStatus === "COMPLETED" ? "line-through text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.taskStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.taskStatus}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TasksTab

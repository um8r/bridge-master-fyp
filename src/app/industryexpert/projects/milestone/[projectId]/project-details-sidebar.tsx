"use client"

import type React from "react"

import { User, Calendar, DollarSign } from "lucide-react"

interface ProjectDetailsExtended {
  id: string
  studentId: string
  stdUserId: string
  studentName: string
  status?: string
  title: string
  description: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string
  budget?: number
}

interface ProjectDetailsSidebarProps {
  project: ProjectDetailsExtended
  progress: number
  tasksCompleted: number
  totalTasks: number
  modulesCompleted: number
  totalModules: number
}

const ProjectDetailsSidebar: React.FC<ProjectDetailsSidebarProps> = ({
  project,
  progress,
  tasksCompleted,
  totalTasks,
  modulesCompleted,
  totalModules,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Project Details</h2>
        <p className="text-gray-600 mb-6">{project.description}</p>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium text-gray-800">{project.studentName}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry Expert</p>
              <p className="font-medium text-gray-800">{project.expertName || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium text-gray-800">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {project.budget && (
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium text-gray-800">${project.budget}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Tasks: {tasksCompleted}/{totalTasks} • Modules: {modulesCompleted}/{totalModules}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsSidebar

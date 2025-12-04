"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { Package, Plus, CheckSquare, Square, FileText } from 'lucide-react'

interface ProjectModule {
  id: string
  name: string
  description: string
  status: boolean
  projectId: string
  projectName: string
}

interface ModulesManagementProps {
  projectId: string
  isProjectComplete: boolean
  isPaymentPending: boolean
}

const ModulesManagement: React.FC<ModulesManagementProps> = ({
  projectId,
  isProjectComplete,
  isPaymentPending,
}) => {
  const [modules, setModules] = useState<ProjectModule[]>([])
  const [newModuleName, setNewModuleName] = useState("")
  const [newModuleDescription, setNewModuleDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch modules for the project
  const fetchModules = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-module/get-all/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setModules(data)
      } else {
        console.error("Failed to fetch modules:", res.status)
        setModules([])
      }
    } catch (err) {
      console.error("Error fetching modules:", err)
      setModules([])
    }
  }

  // Add a new module
  const handleAddModule = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (!newModuleName.trim() || !newModuleDescription.trim()) {
      toast.error("Please provide both module name and description.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-module/add/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newModuleName, description: newModuleDescription }),
      })
      if (res.ok) {
        toast.success("Module added successfully.")
        setNewModuleName("")
        setNewModuleDescription("")
        await fetchModules()
      } else {
        console.error("Failed to add module:", res.status)
        toast.error("Failed to add module.")
      }
    } catch (err) {
      console.error("Error adding module:", err)
      toast.error("Error adding module.")
    } finally {
      setLoading(false)
    }
  }

  // Toggle module status
  const handleModuleToggle = async (module: ProjectModule) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const newStatus = !module.status
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-module/update-status/${module.id}?status=${newStatus}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (res.ok) {
        setModules((prev) => prev.map((m) => (m.id === module.id ? { ...m, status: newStatus } : m)))
        toast.success(`Module ${newStatus ? "completed" : "marked as incomplete"}`)
      } else {
        console.error("Failed to update module status:", res.status)
        toast.error("Failed to update module status")
      }
    } catch (err) {
      console.error("Error updating module status:", err)
      toast.error("Error updating module status")
    }
  }

  // Fetch modules on component mount
  useEffect(() => {
    if (projectId) {
      fetchModules()
    }
  }, [projectId])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Project Modules</h2>
      </div>

      {/* Add Module Form */}
      {!isProjectComplete && !isPaymentPending && (
        <div className="bg-gray-50 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Module</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="module-name" className="block text-sm font-medium text-gray-700 mb-1">
                Module Name
              </label>
              <input
                id="module-name"
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Enter module name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="module-description" className="block text-sm font-medium text-gray-700 mb-1">
                Module Description
              </label>
              <textarea
                id="module-description"
                value={newModuleDescription}
                onChange={(e) => setNewModuleDescription(e.target.value)}
                placeholder="Enter module description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleAddModule}
              disabled={loading}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition duration-200 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              {loading ? "Adding..." : "Add Module"}
            </button>
          </div>
        </div>
      )}

      {/* List of Modules */}
      {modules.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No modules assigned to this project yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            {isProjectComplete || isPaymentPending 
              ? "This project is completed." 
              : "Add modules to help organize project components."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {modules.map((module, index) => (
              <motion.li
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => handleModuleToggle(module)}
                      disabled={isProjectComplete || isPaymentPending}
                      className="focus:outline-none disabled:cursor-not-allowed"
                    >
                      {module.status ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="ml-3 flex-1">
                    <p
                      className={`font-medium ${
                        module.status ? "line-through text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {module.name}
                    </p>
                    {module.description && (
                      <p
                        className={`mt-1 text-sm ${
                          module.status ? "line-through text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {module.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        module.status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {module.status ? "COMPLETED" : "PENDING"}
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

export default ModulesManagement

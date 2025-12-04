"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { Rocket, Calendar, Users, Code, Link, FileText, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"

const CreateProjectPage: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectTeam, setProjectTeam] = useState(0)
  const [projectStack, setProjectStack] = useState("")
  const [projectStatus, setProjectStatus] = useState("")
  const [projectStartDate, setProjectStartDate] = useState("")
  const [projectEndDate, setProjectEndDate] = useState("")
  const [projectLink, setProjectLink] = useState("")
  const [studentId, setStudentId] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function authorizeUserAndFetchStudentId() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          const userId = userData.userId

          const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (studentResponse.ok) {
            const studentData = await studentResponse.json()
            setStudentId(studentData.id)
          } else {
            router.push("/unauthorized")
          }
        } else {
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("Error:", error)
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }

    authorizeUserAndFetchStudentId()
  }, [router])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (!studentId) {
      toast.error("Failed to create project. Student ID is missing.", {
        position: "top-center",
        autoClose: 3000,
      })
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("jwtToken")
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/student-add-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          team: projectTeam,
          stack: projectStack,
          currentStatus: projectStatus,
          startDate: projectStartDate,
          endDate: projectEndDate,
          studentId: studentId,
          link: projectLink,
        }),
      })

      if (response.ok) {
        toast.success("Project created successfully!", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/student")
      } else {
        toast.error("Failed to create project.", {
          position: "top-center",
          autoClose: 3000,
        })
        setSubmitting(false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while creating the project.", {
        position: "top-center",
        autoClose: 3000,
      })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <div className="text-xl font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4"
            >
              <Rocket className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Project</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share the details of your project to track progress and collaborate with others.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Project Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project title"
                      required
                    />
                  </div>
                </div>

                {/* Project Link */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Link <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://your-project-link.com"
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Describe your project in detail"
                    required
                  />
                </div>

                {/* Technology Stack */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technology Stack <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Code className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={projectStack}
                      onChange={(e) => setProjectStack(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="React, Node.js, MongoDB, etc."
                      required
                    />
                  </div>
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={projectTeam}
                      onChange={(e) => setProjectTeam(Number(e.target.value))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Number of team members"
                      required
                    />
                  </div>
                </div>

                {/* Current Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Testing">Testing</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={projectStartDate}
                      onChange={(e) => setProjectStartDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={projectEndDate}
                      onChange={(e) => setProjectEndDate(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Launch Project
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CreateProjectPage

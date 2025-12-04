"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  CalendarDays,
  Award,
  Star,
  CheckCircle,
  MessageSquare,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Code,
  FileCheck,
  Clock,
  User,
  BarChart,
  Briefcase,
  Share2,
  ExternalLink,
} from "lucide-react"

// Types
interface ProgressItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
}

interface ProjectDetails {
  id: string
  title: string
  description: string
  status: string
  endDate: string
  expertName: string
  indExpertId: string
  iExptUserId: string
  studentName: string
  stack?: string
}

interface MilestoneComment {
  id: string
  comment: string
  commentDate: string
  commenterName: string
  commenter_id: string
  milestone_id: string
}

interface TaskItem {
  id: string
  projectId: string
  task: string
  description: string
  taskStatus: string
}

interface Review {
  id: string
  review1: string
  rating: number
  datePosted: string
  reviewerName: string
}

interface ProjectModule {
  id: string
  projectId: string
  name: string
  description: string
  status: boolean
  projectName?: string
}

const CompletedProjectDetails = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // State
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [milestones, setMilestones] = useState<ProgressItem[]>([])
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({})
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [modules, setModules] = useState<ProjectModule[]>([])
  const [projectLink, setProjectLink] = useState<string>("")

  // Calculate project stats
  const getProjectStats = () => {
    return {
      totalMilestones: milestones.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.taskStatus === "COMPLETED").length,
      averageRating: reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "N/A",
      projectDuration: project ? calculateDuration(project.endDate) : "N/A",
    }
  }

  // Calculate project duration in days
  const calculateDuration = (endDate: string) => {
    const end = new Date(endDate)
    // Assume start date is 3 months before end date for demo purposes
    const start = new Date(end)
    start.setMonth(start.getMonth() - 3)

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch project details
        const projectRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!projectRes.ok) {
          throw new Error("Failed to fetch project details")
        }

        const projectData = await projectRes.json()
        setProject(projectData)

        // Verify project is completed
        if (projectData.status !== "Completed") {
          router.push(`/student/projects/milestone/${projectId}`)
          return
        }

        // Fetch milestones
        const milestonesRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (milestonesRes.ok) {
          const milestonesData = await milestonesRes.json()
          setMilestones(
            milestonesData.map((m: ProgressItem) => ({
              ...m,
              isCompleted: true, // All milestones are completed in a completed project
            })),
          )

          // Fetch comments for each milestone
          for (const milestone of milestonesData) {
            await fetchComments(milestone.id)
          }
        }

        // Fetch tasks
        const tasksRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/get-tasks/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }

        // Fetch reviews
        const reviewsRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/reviews/get-reviews/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setReviews(reviewsData)
        }

        // Fetch modules
        await fetchModules()

        // Fetch project link
        await fetchProjectLink()
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Failed to load project data")
        toast.error("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectData()
    }
  }, [projectId, router])

  // Fetch comments for a milestone
  const fetchComments = async (milestoneId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone-comment/get-milestone-comments/?milestoneId=${milestoneId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (res.ok) {
        const data = await res.json()
        setComments((prev) => ({
          ...prev,
          [milestoneId]: typeof data === "string" && data.includes("No comments") ? [] : data,
        }))
      }
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  // Fetch project modules
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
      }
    } catch (err) {
      console.error("Error fetching modules:", err)
    }
  }

  // Fetch project deployment link
  const fetchProjectLink = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-link/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const link = await res.text()
        setProjectLink(link.replace(/"/g, "")) // Remove quotes from response
      } else {
        console.log("No deployment link available")
        setProjectLink("")
      }
    } catch (err) {
      console.error("Error fetching project link:", err)
      setProjectLink("")
    }
  }

  // Toggle milestone expansion
  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId)
  }

  // Handle print certificate
  const handlePrintCertificate = () => {
    router.push(`/student/project-certificate/${projectId}`)
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
      ))
  }

  // Get project image based on title
  const getProjectImage = (title: string) => {
    const seed = title?.length % 5 || 0
    const images = [
      "https://images.unsplash.com/photo-1573495612937-f02b92648e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22731b9b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ]
    return images[seed]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-6">Error</h1>
          <p className="text-gray-700">{error || "Project not found"}</p>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const stats = getProjectStats()

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-64 overflow-hidden">
        <img
          src={getProjectImage(project.title) || "/placeholder.svg"}
          alt="Project Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Completed</div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Certified</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">Successfully completed project with industry expert</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        {/* Project Overview Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Project Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Overview</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Completion Date</p>
                    <p className="font-medium text-gray-700">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Industry Expert</p>
                    <p className="font-medium text-gray-700">
                      <Link
                        href={`/student/industry-profile/${project.indExpertId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {project.expertName}
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-medium text-gray-700">{project.studentName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Code className="w-5 h-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Tech Stack</p>
                    <p className="font-medium text-gray-700">{project.stack || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Actions */}
            <div className="md:w-64 flex flex-col space-y-3">
              <button
                onClick={handlePrintCertificate}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition flex items-center justify-center"
              >
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </button>

              <button
                onClick={() => window.print()}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow transition flex items-center justify-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Details
              </button>

              <Link
                href="/student"
                className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2">
              <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalMilestones}</p>
            <p className="text-sm text-gray-500">Milestones Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col items-center">
            <div className="bg-green-100 p-2 rounded-full mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.completedTasks}</p>
            <p className="text-sm text-gray-500">Tasks Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col items-center">
            <div className="bg-yellow-100 p-2 rounded-full mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col items-center">
            <div className="bg-purple-100 p-2 rounded-full mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.projectDuration}</p>
            <p className="text-sm text-gray-500">Days Duration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Completed Milestones Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Achieved Milestones
                </h2>
              </div>

              {milestones.length === 0 ? (
                <div className="p-12 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="No milestones"
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
                  />
                  <p className="text-gray-500">No milestones were recorded for this project.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="transition-all duration-200">
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => toggleMilestone(milestone.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{milestone.title}</h3>
                            <p className="text-sm text-gray-500">
                              Achieved on: {new Date(milestone.achievementDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-3">Completed</div>
                          {expandedMilestone === milestone.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedMilestone === milestone.id && (
                        <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                          <p className="text-gray-700 mb-4">{milestone.description}</p>

                          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-blue-500" />
                            Expert Comments
                          </h4>

                          {comments[milestone.id]?.length > 0 ? (
                            <div className="space-y-3">
                              {comments[milestone.id].map((comment) => (
                                <div key={comment.id} className="bg-white p-4 rounded-md border border-gray-200">
                                  <p className="text-gray-700">{comment.comment}</p>
                                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                    <span className="font-medium">{comment.commenterName}</span>
                                    <span>{new Date(comment.commentDate).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No comments for this milestone.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-blue-500" />
                  Completed Tasks
                </h2>
              </div>

              {tasks.length === 0 ? (
                <div className="p-12 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                    alt="No tasks"
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
                  />
                  <p className="text-gray-500">No tasks were recorded for this project.</p>
                </div>
              ) : (
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <li key={task.id} className="py-4 flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{task.task}</h4>
                          {task.description && <p className="text-gray-600 text-sm mt-1">{task.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Project Modules Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-500" />
                  Project Modules
                </h2>
              </div>

              {modules.length === 0 ? (
                <div className="p-12 text-center">
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="No modules"
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
                  />
                  <p className="text-gray-500">No modules were created for this project.</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className={`border rounded-lg p-4 ${
                          module.status ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                                module.status ? "bg-green-100" : "bg-gray-100"
                              }`}
                            >
                              {module.status ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{module.name}</h3>
                              <p className="text-gray-600 mt-1">{module.description}</p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              module.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {module.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Expert Info Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Industry Expert</h2>
              </div>
              <div className="p-6 flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                  alt={project.expertName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">{project.expertName}</h3>
                  <Link
                    href={`/student/industry-profile/${project.indExpertId}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Project Deployment Link */}
            {projectLink && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-blue-500" />
                    Live Project
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Deployment URL</p>
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 break-all text-sm"
                      >
                        {projectLink}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(projectLink, "_blank")}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Project
                  </button>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-500" />
                  Project Reviews
                </h2>
              </div>

              <div className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-6">
                    <img
                      src="https://images.unsplash.com/photo-1574068468668-a05a11f871da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                      alt="No reviews"
                      className="w-24 h-24 mx-auto mb-4 rounded-full object-cover opacity-50"
                    />
                    <p className="text-gray-500">No reviews have been submitted for this project.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800">{review.reviewerName}</h3>
                            <div className="flex mt-1">{renderStars(review.rating)}</div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.datePosted).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review1}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-500" />
                  Completion Certificate
                </h2>
              </div>
              <div className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1523294587484-bae6cc870010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
                  alt="Certificate"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p className="text-gray-700 mb-4">
                  Congratulations on completing this project! You can view and download your certificate of completion.
                </p>
                <button
                  onClick={handlePrintCertificate}
                  className="inline-flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4 mr-2" />
                  View Certificate
                </button>
              </div>
            </div>

            {/* Share Project */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-blue-500" />
                  Share Your Success
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Share your achievement with your network and add this project to your portfolio.
                </p>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition flex-1">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CompletedProjectDetails

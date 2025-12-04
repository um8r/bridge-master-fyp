"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import ChatForStudent from "@/app/common_components/ChatforStudent"
import MilestoneTimeline from "@/app/student/stdcomps/MilestoneTimeline"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Star,
  User,
  X,
  CheckSquare,
  Square,
  Plus,
  ArrowLeft,
  Award,
  MessageSquare,
  ExternalLink,
  Package,
  Edit3,
  Save,
  Globe,
} from "lucide-react"
import RejectedRequestCard from "./rejected-request-card"

// --------- Interfaces ---------
interface ProgressUpdate {
  id: string
  content: string
  date: string
}

interface ProgressItem {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
  updates?: ProgressUpdate[]
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
  review: string
  rating: number
  datePosted: string
  reviewerName: string
}

interface ProjectModule {
  id: string
  name: string
  description: string
  status: boolean
  projectId: string
  projectName: string
}

interface ProjectDetailsExtended extends ProjectDetails {
  studentId: string
  stdUserId: string
  studentName: string
}

const ProjectProgressTracker: React.FC = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // State for project details and user info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null)
  const [studentUserId, setStudentUserId] = useState<string>("")
  const [expertUserId, setExpertUserId] = useState<string>("")
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([])
  const [comments, setComments] = useState<Record<string, MilestoneComment[]>>({})
  const [currentCommentItem, setCurrentCommentItem] = useState<ProgressItem | null>(null)
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [modules, setModules] = useState<ProjectModule[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReviewText, setNewReviewText] = useState("")
  const [newReviewRating, setNewReviewRating] = useState<number>(0)

  // Deployment link state - ENHANCED
  const [deploymentLink, setDeploymentLink] = useState("")
  const [projectLink, setProjectLink] = useState("")
  const [isEditingLink, setIsEditingLink] = useState(false)
  const [tempDeploymentLink, setTempDeploymentLink] = useState("")

  // Modal state for add/edit milestone
  const [showModal, setShowModal] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  })
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<"milestones" | "tasks" | "modules" | "reviews" | "chat" | "deployment">(
    "milestones",
  )

  // Determine if project is completed, pending completion, or payment pending
  const isProjectComplete = project?.status === "Completed"
  const isPendingCompletion = project?.status === "PendingCompletion"
  const isPaymentPending = project?.status === "PaymentPending"
  const isEditingDisabled = isProjectComplete || isPendingCompletion || isPaymentPending

  // Calculate project progress including modules
  const calculateProgress = () => {
    const totalTasks = tasks.length
    const totalModules = modules.length
    const completedTasks = tasks.filter((task) => task.taskStatus === "COMPLETED").length
    const completedModules = modules.filter((module) => module.status === true).length

    const totalItems = totalTasks + totalModules
    if (totalItems === 0) return 0

    const completedItems = completedTasks + completedModules
    return Math.round((completedItems / totalItems) * 100)
  }

  const getProjectImage = () => {
    if (!project) return "/project-management-teamwork.png"

    const title = project.title.toLowerCase()
    const description = project.description.toLowerCase()

    if (title.includes("web") || description.includes("web")) {
      return "/web-development-concept.png"
    } else if (
      title.includes("mobile") ||
      description.includes("mobile") ||
      title.includes("app") ||
      description.includes("app")
    ) {
      return "/mobile-app-development.png"
    } else if (
      title.includes("ai") ||
      description.includes("ai") ||
      title.includes("machine learning") ||
      description.includes("machine learning")
    ) {
      return "/artificial-intelligence-network.png"
    } else if (title.includes("data") || description.includes("data")) {
      return "/data-science-concept.png"
    } else {
      return "/technology-project.png"
    }
  }

  const [hasRejectedRequest, setHasRejectedRequest] = useState(false)
  const [rejectedRequestId, setRejectedRequestId] = useState<string | null>(null)

  // -----------------------------
  // NEW: Deployment Link Management Functions
  // -----------------------------

  // Fetch current deployment link
  const fetchDeploymentLink = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-link/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const link = await res.text()
        // Clean the response - remove quotes and trim whitespace
        const cleanLink = link.replace(/^"|"$/g, "").trim()
        console.log("Fetched deployment link:", cleanLink) // Debug log
        if (cleanLink && cleanLink !== "" && cleanLink !== "null") {
          setProjectLink(cleanLink)
          setDeploymentLink(cleanLink)
          setTempDeploymentLink(cleanLink)
          console.log("Deployment link set in state:", cleanLink) // Debug log
        } else {
          console.log("No valid deployment link found") // Debug log
          setProjectLink("")
          setDeploymentLink("")
          setTempDeploymentLink("")
        }
      } else {
        // Handle different error cases
        const errorText = await res.text()
        console.log("Deployment link fetch response:", res.status, errorText)
        setProjectLink("")
        setDeploymentLink("")
        setTempDeploymentLink("")
      }
    } catch (err) {
      console.error("Error fetching deployment link:", err)
      setProjectLink("")
      setDeploymentLink("")
      setTempDeploymentLink("")
    }
  }

  // Update deployment link
  const handleUpdateDeploymentLink = async () => {
    if (!tempDeploymentLink.trim()) {
      toast.error("Please enter a valid deployment link")
      return
    }

    // Basic URL validation
    try {
      new URL(tempDeploymentLink)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/deployement/${projectId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Fix: Properly stringify the string for the API
        body: JSON.stringify(tempDeploymentLink.trim()),
      })

      if (res.ok) {
        const responseText = await res.text()
        console.log("Update response:", responseText) // Debug log

        // Immediately update the state
        const cleanLink = tempDeploymentLink.trim()
        setDeploymentLink(cleanLink)
        setProjectLink(cleanLink)
        setIsEditingLink(false)

        toast.success("Deployment link updated successfully! Expert can now see your project.")

        // Wait a moment then refresh from server to confirm
        setTimeout(async () => {
          await fetchDeploymentLink()
          await debugDeploymentLink()
        }, 1000)
      } else {
        const errorText = await res.text()
        console.error("Failed to update deployment link:", res.status, errorText)
        toast.error(`Failed to update deployment link: ${errorText || res.status}`)
      }
    } catch (err) {
      console.error("Error updating deployment link:", err)
      toast.error("Error updating deployment link")
    }
  }

  // Add this debug function
  const debugDeploymentLink = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    console.log("Debug: Checking project status and link...")
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const projectData = await res.json()
        console.log("Debug: Project data:", projectData)
        console.log("Debug: Project status:", projectData.status)
        console.log("Debug: Project link:", projectData.link)
      }
    } catch (err) {
      console.error("Debug error:", err)
    }
  }

  // Cancel editing deployment link
  const handleCancelEditLink = () => {
    setTempDeploymentLink(deploymentLink)
    setIsEditingLink(false)
  }

  // -----------------------------
  // Existing Functions (keeping all the original functionality)
  // -----------------------------

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }
      if (!projectId) return
      try {
        // Get authorized user info (student's userId)
        const authRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (authRes.ok) {
          const authData = await authRes.json()
          setStudentUserId(authData.userId)
        }

        // Fetch project details
        const resProject = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resProject.ok) {
          const projectData = await resProject.json()
          setProject(projectData)
          setExpertUserId(projectData.iExptUserId)
        }

        // Fetch milestones
        const resMilestones = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resMilestones.ok) {
          const data = await resMilestones.json()
          const today = new Date().toISOString().split("T")[0]
          const items = data.map((m: ProgressItem) => ({
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: [],
          }))
          setProgressItems(items)

          for (const milestone of items) {
            await fetchComments(milestone.id)
          }
        } else {
          setProgressItems([])
        }

        await checkCompletionRequestStatus()
        await fetchTasks()
        await fetchModules()

        // NEW: Fetch deployment link
        await fetchDeploymentLink()

        if (project && (project.status === "Completed" || project.status === "PaymentPending")) {
          await fetchReviews()
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to load project data.")
      } finally {
        setLoading(false)
      }
    }
    if (projectId) fetchData()
  }, [projectId, router])

  // All other existing functions remain the same...
  const refreshProgressItems = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const today = new Date().toISOString().split("T")[0]
        const updated = data.map((m: ProgressItem) => {
          const existing = progressItems.find((x) => x.id === m.id)
          return {
            ...m,
            isCompleted: m.achievementDate <= today,
            updates: existing?.updates || [],
          }
        })
        setProgressItems(updated)

        for (const milestone of updated) {
          await fetchComments(milestone.id)
        }
      } else {
        setProgressItems([])
      }
    } catch (err) {
      console.error("Refresh error:", err)
    }
  }

  const handleOpenModal = (item?: ProgressItem) => {
    if (isEditingDisabled) {
      toast.info("Editing is disabled while the project is pending completion, payment, or completed.")
      return
    }

    if (item) {
      setEditItemId(item.id)
      setItemFormData({
        title: item.title,
        description: item.description,
        achievementDate: item.achievementDate,
      })
    } else {
      setEditItemId(null)
      setItemFormData({ title: "", description: "", achievementDate: "" })
    }
    setShowModal(true)
  }

  const handleSaveItem = async () => {
    if (isEditingDisabled) {
      toast.info("Editing is disabled while the project is pending completion, payment, or completed.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    if (!itemFormData.title.trim()) {
      toast.error("Milestone title is required")
      return
    }
    if (!itemFormData.achievementDate) {
      toast.error("Target date is required")
      return
    }

    try {
      if (editItemId) {
        const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/update-milestone?milesstoneId=${editItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemFormData),
        })
        if (!res.ok) {
          console.error("Failed to update milestone. Status:", res.status)
          toast.error("Failed to update milestone")
        } else {
          toast.success("Milestone updated successfully")
          await refreshProgressItems()
        }
      } else {
        const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/add-milestone/${projectId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemFormData),
        })
        if (!res.ok) {
          console.error("Failed to add milestone. Status:", res.status)
          toast.error("Failed to add milestone")
        } else {
          toast.success("Milestone added successfully")
          await refreshProgressItems()
        }
      }
    } catch (err) {
      console.error("Error saving milestone:", err)
      toast.error("Error saving milestone")
    } finally {
      setShowModal(false)
      setItemFormData({ title: "", description: "", achievementDate: "" })
    }
  }

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

  const fetchTasks = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/get-tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      } else {
        console.error("Failed to fetch tasks:", res.status)
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

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

  const handleTaskToggle = async (task: TaskItem) => {
    if (isEditingDisabled) {
      toast.info("Task updates are disabled while the project is pending completion, payment, or completed.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    if (task.taskStatus === "COMPLETED") {
      toast.info("Task is already completed")
      return
    }

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/marks-as-complete/${projectId}/${task.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, taskStatus: "COMPLETED" } : t)))
        toast.success("Task marked as completed")
      } else {
        console.error("Failed to mark task as complete:", res.status)
        toast.error("Failed to mark task as complete")
      }
    } catch (err) {
      console.error("Error marking task as complete:", err)
      toast.error("Error marking task as complete")
    }
  }

  const handleModuleToggle = async (module: ProjectModule) => {
    if (isEditingDisabled) {
      toast.info("Module updates are disabled while the project is pending completion, payment, or completed.")
      return
    }

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

  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (newReviewRating < 1 || newReviewRating > 5 || !newReviewText.trim()) {
      toast.error("Please enter a valid review and a rating between 1 and 5.")
      return
    }
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/reviews/add-review/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ReviewerId: studentUserId,
          Review: newReviewText,
          Rating: newReviewRating,
        }),
      })
      if (res.ok) {
        toast.success("Review added successfully.")
        setNewReviewText("")
        setNewReviewRating(0)
        await fetchReviews()
      } else {
        toast.error("Failed to add review.")
      }
    } catch (err) {
      console.error("Error adding review:", err)
      toast.error("Error adding review.")
    }
  }

  const fetchReviews = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/reviews/get-reviews/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      } else {
        console.error("Failed to fetch reviews:", res.status)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  const handleRequestCompletion = async () => {
    if (isPendingCompletion || isPaymentPending || isProjectComplete) {
      toast.info("A completion request is already pending or the project is already completed.")
      return
    }

    // Check if deployment link exists
    if (!deploymentLink.trim()) {
      toast.error("Please add a deployment link before requesting completion.")
      setActiveTab("deployment")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    try {
      const completionRes = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/put-completion-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectId),
        },
      )

      if (completionRes.ok) {
        toast.success("Completion request sent successfully. Awaiting industry expert approval.")
        setProject((prev) => (prev ? { ...prev, status: "PendingCompletion" } : prev))
        setHasRejectedRequest(false)
        setRejectedRequestId(null)
      } else {
        const errorText = await completionRes.text()
        console.error("Failed to request project completion:", completionRes.status, errorText)
        toast.error(`Failed to request project completion: ${completionRes.status} ${errorText || ""}`)
      }
    } catch (err) {
      console.error("Error requesting project completion:", err)
      toast.error(`Error requesting project completion: ${err || "Unknown error"}`)
    }
  }

  const checkCompletionRequestStatus = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId || !studentUserId) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/get-completion-request/${studentUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()

        const pendingRequest =
          Array.isArray(data) && data.find((req: any) => req.projectId === projectId && req.status === "PENDING")

        if (pendingRequest) {
          setProject((prev) => (prev ? { ...prev, status: "PendingCompletion" } : prev))
          setHasRejectedRequest(false)
          setRejectedRequestId(null)
          return
        }

        const rejectedRequest =
          Array.isArray(data) && data.find((req: any) => req.projectId === projectId && req.status === "REJECTED")

        if (rejectedRequest) {
          setHasRejectedRequest(true)
          setRejectedRequestId(rejectedRequest.id)
          setProject((prev) => (prev ? { ...prev, status: "Active" } : prev))
          toast.info("Your completion request was rejected. You can submit a new request after making improvements.")
        } else {
          setHasRejectedRequest(false)
          setRejectedRequestId(null)
        }
      }
    } catch (err) {
      console.error("Error checking completion request status:", err)
    }
  }

  const handleSendNewRequestAfterRejection = () => {
    setHasRejectedRequest(false)
    setRejectedRequestId(null)
    handleRequestCompletion()
  }

  useEffect(() => {
    if (projectId) {
      fetchTasks()
      fetchModules()
    }
  }, [projectId])

  useEffect(() => {
    if (project?.status === "Completed" || project?.status === "PaymentPending") {
      fetchReviews()
    }
  }, [project])

  useEffect(() => {
    const interval = setInterval(() => {
      if (projectId && studentUserId && !isProjectComplete && !isPaymentPending) {
        checkCompletionRequestStatus()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [projectId, studentUserId, isProjectComplete, isPaymentPending])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border border-gray-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error Loading Project</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getProjectImage() || "/placeholder.svg"}
            alt={project?.title || "Project Banner"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-800 rounded-full p-2 transition duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            {project?.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 flex flex-wrap gap-2"
          >
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                project?.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : project?.status === "PendingCompletion"
                    ? "bg-yellow-100 text-yellow-800"
                    : project?.status === "PaymentPending"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {project?.status === "Completed" && <CheckCircle className="mr-1 h-4 w-4" />}
              {project?.status === "PendingCompletion" && <Clock className="mr-1 h-4 w-4" />}
              {project?.status === "PaymentPending" && <DollarSign className="mr-1 h-4 w-4" />}
              {project?.status}
            </span>
            <span className="bg-white/70 text-gray-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Due: {new Date(project?.endDate || "").toLocaleDateString()}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Project Details</h2>
                <p className="text-gray-600 mb-6">{project?.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student</p>
                      <p className="font-medium text-gray-800">{project?.studentName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry Expert</p>
                      <p className="font-medium text-gray-800">{project?.expertName || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date(project?.endDate || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* NEW: Deployment Link Display in Sidebar */}
                  {deploymentLink && (
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <Globe className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Deployment Link</p>
                        <a
                          href={deploymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 underline text-sm break-all"
                        >
                          {deploymentLink.length > 30 ? `${deploymentLink.substring(0, 30)}...` : deploymentLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-blue-600">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Tasks: {tasks.filter((t) => t.taskStatus === "COMPLETED").length}/{tasks.length} • Modules:{" "}
                    {modules.filter((m) => m.status).length}/{modules.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Actions */}
            {!isEditingDisabled && !hasRejectedRequest && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Project Actions</h3>
                  <button
                    onClick={handleRequestCompletion}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Request Project Completion
                  </button>
                  {!deploymentLink && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Add deployment link first in the Deployment tab
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasRejectedRequest && <RejectedRequestCard onSendNewRequest={handleSendNewRequestAfterRejection} />}

            {isPendingCompletion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500 border-t border-r border-b border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Completion Request Pending</h3>
                  </div>
                  <p className="text-gray-600">
                    Your completion request has been sent to the industry expert. Editing is disabled until the request
                    is processed.
                  </p>
                </div>
              </motion.div>
            )}

            {isPaymentPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-blue-500 border-t border-r border-b border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Payment Pending</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your completion request has been approved. The industry expert will now process the payment.
                  </p>
                </div>
              </motion.div>
            )}

            {isProjectComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-green-500 border-t border-r border-b border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Project Completed</h3>
                  </div>
                  <p className="text-gray-600 mb-4">This project is complete. Editing is disabled.</p>

                  {projectLink && (
                    <div className="mb-4">
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mb-2"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        View Project
                      </a>
                    </div>
                  )}

                  <Link
                    href={`/student/project-certificate/${projectId}`}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <Award className="mr-2 h-5 w-5" />
                    View Completion Certificate
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("milestones")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                      activeTab === "milestones"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Milestones
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                      activeTab === "tasks"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab("modules")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                      activeTab === "modules"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Modules
                  </button>
                  {/* NEW: Deployment Tab */}
                  <button
                    onClick={() => setActiveTab("deployment")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                      activeTab === "deployment"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Globe className="inline-block w-4 h-4 mr-1" />
                    Deployment
                  </button>
                  {(isProjectComplete || isPaymentPending) && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                        activeTab === "reviews"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Reviews
                    </button>
                  )}
                  {studentUserId && expertUserId && (
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap ${
                        activeTab === "chat"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Chat
                    </button>
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* NEW: Deployment Tab */}
                {activeTab === "deployment" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Deployment</h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-blue-800">Deployment Link</h3>
                          <p className="text-blue-700 text-sm mt-1">
                            Add your projects deployment link here. Your industry expert will be able to see and review
                            your live project immediately.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Current Deployment Link Display */}
                    {(deploymentLink || projectLink) && !isEditingLink && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Deployment</h3>
                            <div className="flex items-center mb-3">
                              <ExternalLink className="h-4 w-4 text-gray-500 mr-2" />
                              <a
                                href={deploymentLink || projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                {deploymentLink || projectLink}
                              </a>
                            </div>
                            <div className="flex items-center text-sm text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Visible to your industry expert</span>
                            </div>
                          </div>
                          {!isEditingDisabled && (
                            <button
                              onClick={() => {
                                setIsEditingLink(true)
                                setTempDeploymentLink(deploymentLink || projectLink)
                              }}
                              className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition duration-200 flex items-center"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add/Edit Deployment Link Form */}
                    {(!deploymentLink || isEditingLink) && !isEditingDisabled && (
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {deploymentLink ? "Update Deployment Link" : "Add Deployment Link"}
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="deployment-url" className="block text-sm font-medium text-gray-700 mb-2">
                              Deployment URL <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="deployment-url"
                              type="url"
                              value={tempDeploymentLink}
                              onChange={(e) => setTempDeploymentLink(e.target.value)}
                              placeholder="https://your-project.vercel.app"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Enter the complete URL where your project is deployed (e.g., Vercel, Netlify, Heroku,
                              etc.)
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={handleUpdateDeploymentLink}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {deploymentLink ? "Update Link" : "Save Link"}
                            </button>

                            {isEditingLink && (
                              <button
                                onClick={handleCancelEditLink}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition duration-200"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deployment Guidelines */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Deployment Guidelines</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Ensure your project is fully functional and accessible via the provided URL</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Test all features before submitting the deployment link</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Your industry expert will review the live project using this link</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>You can update the deployment link anytime before project completion</span>
                        </li>
                      </ul>
                    </div>

                    {isEditingDisabled && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-yellow-800">Editing Disabled</h3>
                            <p className="text-yellow-700 text-sm mt-1">
                              Deployment link cannot be modified while the project is pending completion, payment, or
                              completed.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add this debug section in the deployment tab, right after the deployment guidelines */}
                    {process.env.NODE_ENV === "development" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                        <h3 className="font-medium text-yellow-800 mb-2">Debug Information</h3>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>Deployment Link State: {deploymentLink || "Empty"}</p>
                          <p>Project Link State: {projectLink || "Empty"}</p>
                          <p>Temp Link State: {tempDeploymentLink || "Empty"}</p>
                          <p>Project ID: {projectId}</p>
                          <p>Is Editing: {isEditingLink ? "Yes" : "No"}</p>
                        </div>
                        <div className="mt-3 space-x-2">
                          <button
                            onClick={fetchDeploymentLink}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded"
                          >
                            Refresh Link
                          </button>
                          <button
                            onClick={debugDeploymentLink}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded"
                          >
                            Debug Project
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Existing tabs remain the same... */}
                {activeTab === "milestones" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Milestones</h2>
                      {!isEditingDisabled && (
                        <button
                          onClick={() => handleOpenModal()}
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
                                        milestone.isCompleted
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {milestone.isCompleted ? "Completed" : "In Progress"}
                                    </span>
                                    {!isEditingDisabled && (
                                      <button
                                        onClick={() => handleOpenModal(milestone)}
                                        className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </div>
                                </div>

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
                            onClick={() => handleOpenModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Milestone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tasks Tab */}
                {activeTab === "tasks" && (
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
                                    onClick={() => handleTaskToggle(task)}
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
                )}

                {/* Modules Tab */}
                {activeTab === "modules" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Modules</h2>
                    </div>

                    {modules.length === 0 ? (
                      <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No modules assigned to this project yet.</p>
                        <p className="text-sm text-gray-500 mt-2">Modules will be assigned by your industry expert.</p>
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
                                    disabled={isEditingDisabled}
                                    className="focus:outline-none"
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
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (isProjectComplete || isPaymentPending) && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Reviews</h2>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="bg-white rounded-lg p-6 text-center mb-6 border border-gray-200">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No reviews have been submitted yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        {reviews.map((review, index) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-lg p-5"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">{review.reviewerName}</p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.datePosted).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-3 text-gray-700">{review.review}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="bg-white rounded-lg p-5 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Review</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                          </label>
                          <textarea
                            id="review-text"
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setNewReviewRating(rating)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  newReviewRating >= rating
                                    ? "bg-yellow-500 text-yellow-900"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleAddReview}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                        >
                          <Star className="mr-2 h-5 w-5" />
                          Submit Review
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Tab */}
                {activeTab === "chat" && studentUserId && expertUserId && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Chat with Expert</h2>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-4 bg-gray-50 flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {project?.expertName ? `Chat with ${project.expertName}` : "Expert Chat"}
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 mb-4">
                          Use the chat button in the bottom right corner to communicate with your industry expert.
                        </p>
                        <ChatForStudent
                          studentId={studentUserId}
                          expertId={expertUserId}
                          expertName={project?.expertName}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Modal */}
      {!isEditingDisabled && showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl border border-gray-200"
          >
            <h3 className="text-xl font-bold text-blue-600 mb-4">{editItemId ? "Edit Milestone" : "Add Milestone"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Complete Research Phase"
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe what needs to be accomplished"
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={itemFormData.achievementDate}
                  onChange={(e) => setItemFormData({ ...itemFormData, achievementDate: e.target.value })}
                  className="w-full p-3 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setItemFormData({ title: "", description: "", achievementDate: "" })
                }}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
              >
                {editItemId ? "Update" : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default ProjectProgressTracker

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import ChatForIndustry from "@/app/common_components/ChatforIndustry"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Calendar, CheckCircle, Clock, DollarSign, FileText, Flag, MessageSquare, RefreshCw, Star, User, X, CheckSquare, Square, ChevronDown, ChevronUp, Plus, Send, ArrowLeft } from 'lucide-react'

// --------- Interfaces ---------
interface IndustryExpertProfile {
  userId: string
  indExptId: string
  firstName: string
  lastName: string
  email: string
}

interface Milestone {
  id: string
  title: string
  description: string
  achievementDate: string
  isCompleted?: boolean
}

interface StudentDetails {
  studentId: string
  firstName: string
  lastName: string
  stdUserId: string
}

interface Comment {
  id: string
  comment: string
  commenterName: string
  commentDate: string
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

interface CompletionRequest {
  id: string
  projectId: string
  projectTitle: string
  studentName: string
  requestDate: string
  status: string
}

interface ProjectModule {
  id: string
  projectId: string
  name: string
  description: string
  status: boolean
  projectName?: string
}

interface AddProjectModuleDTO {
  name: string
  description: string
}

interface ProjectLink {
  link: string
}

const MilestonePage: React.FC = () => {
  const { projectId } = useParams()
  const router = useRouter()

  // Logged-in industry expert profile (if available)
  const [expertProfile, setExpertProfile] = useState<IndustryExpertProfile | null>(null)
  // Project details and student info
  const [project, setProject] = useState<ProjectDetailsExtended | null>(null)
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  // Milestones and comments
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [currentMilestoneId, setCurrentMilestoneId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([])
  // New Task inputs (visible only to industry experts)
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  // Review state (if needed when project is completed)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReviewText, setNewReviewText] = useState("")
  const [newReviewRating, setNewReviewRating] = useState<number>(0)
  // Completion requests
  const [completionRequests, setCompletionRequests] = useState<CompletionRequest[]>([])
  const [currentRequest, setCurrentRequest] = useState<CompletionRequest | null>(null)
  // Modal state for adding/editing milestones
  const [showModal, setShowModal] = useState(false)
  const [editItemId, setEditItemId] = useState<string | null>(null)
  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
  })
  // Loading and error state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Debug state
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  // Active tab state
  const [activeTab, setActiveTab] = useState<"milestones" | "tasks" | "reviews" | "chat" | "modules">("milestones")

  // Project modules state
  const [modules, setModules] = useState<ProjectModule[]>([])
  const [newModuleName, setNewModuleName] = useState("")
  const [newModuleDescription, setNewModuleDescription] = useState("")

  // Project link state
  const [projectLink, setProjectLink] = useState<string>("")
  const [newProjectLink, setNewProjectLink] = useState<string>("")
  const [showLinkForm, setShowLinkForm] = useState(false)

  // Determine if the project is completed or pending completion
  const isProjectComplete = project?.status === "Completed"
  const isPendingCompletion = project?.status === "PendingCompletion"
  const isPaymentPending = project?.status === "PaymentPending"

  // Get project image based on title or description
  const getProjectImage = () => {
    if (!project)
      return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"

    const title = project.title.toLowerCase()
    const description = project.description.toLowerCase()

    if (title.includes("web") || description.includes("web")) {
      return "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    } else if (
      title.includes("mobile") ||
      description.includes("mobile") ||
      title.includes("app") ||
      description.includes("app")
    ) {
      return "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    } else if (
      title.includes("ai") ||
      description.includes("ai") ||
      title.includes("machine learning") ||
      description.includes("machine learning")
    ) {
      return "https://images.unsplash.com/photo-1677442135136-760c813028c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    } else if (title.includes("data") || description.includes("data")) {
      return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    } else {
      return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
    }
  }

  // Get student avatar
  const getStudentAvatar = () => {
    return "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
  }

  // Get expert avatar
  const getExpertAvatar = () => {
    return "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
  }

  // Calculate project progress
  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((task) => task.taskStatus === "COMPLETED").length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  // -----------------------------
  // 1) Fetch Expert, Project Details, and Milestones
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
        // Get authorized user info
        const authRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!authRes.ok) throw new Error("Failed to get authorized user info.")
        const authData = await authRes.json()

        // Fetch industry expert profile using logged-in user ID
        const expertRes = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${authData.userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!expertRes.ok) throw new Error("Failed to fetch industry expert profile.")
        const expertData = await expertRes.json()
        setExpertProfile({
          userId: expertData.userId,
          indExptId: expertData.indExptId,
          firstName: expertData.firstName,
          lastName: expertData.lastName,
          email: expertData.email,
        })

        // Fetch project details (includes student info)
        const projectRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!projectRes.ok) throw new Error("Failed to fetch project details.")
        const projectData = await projectRes.json()
        setProject(projectData)
        setStudentDetails({
          studentId: projectData.studentId,
          stdUserId: projectData.stdUserId,
          firstName: projectData.studentName.split(" ")[0] ?? "",
          lastName: projectData.studentName.split(" ")[1] ?? "",
        })

        // Fetch milestones
        const milestonesRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone/get-project-milestones/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!milestonesRes.ok) throw new Error("Failed to fetch milestones.")
        const milestonesData = await milestonesRes.json()

        // Add isCompleted property based on achievement date
        const today = new Date().toISOString().split("T")[0]
        const processedMilestones = milestonesData.map((m: Milestone) => ({
          ...m,
          isCompleted: m.achievementDate <= today,
        }))

        setMilestones(processedMilestones)

        // Fetch completion requests for this expert
        await fetchCompletionRequests(expertData.indExptId)

        // If project is completed, fetch reviews
        if (projectData.status === "Completed") {
          await fetchReviews()
        }

        // Fetch tasks
        await fetchTasks()

        // Fetch modules
        await fetchModules()

        // Fetch project link
        await fetchProjectLink()
      } catch (err) {
        console.error(err)
        setError("Failed to load project data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId, router])

  // -----------------------------
  // 2) Fetch Completion Requests
  // -----------------------------
  const fetchCompletionRequests = async (expertId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setDebugInfo(`Fetching completion requests for expert ID: ${expertId}`)

    try {
      // First, try to fetch using the expert ID
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/get-completion-request/${expertId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        setDebugInfo((prev) => `${prev}\nReceived ${data.length} requests from API`)

        // Check if we got an empty array or error message
        if (Array.isArray(data) && data.length === 0) {
          setDebugInfo((prev) => `${prev}\nNo completion requests found for this expert`)
          setCompletionRequests([])
        } else if (typeof data === "string") {
          setDebugInfo((prev) => `${prev}\nAPI returned string: ${data}`)
          setCompletionRequests([])
        } else {
          setCompletionRequests(data)

          // Find if there's a request for the current project
          const currentProjectRequest = data.find((req: CompletionRequest) => req.projectId === projectId)
          if (currentProjectRequest) {
            setCurrentRequest(currentProjectRequest)
            setDebugInfo((prev) => `${prev}\nFound request for current project: ${currentProjectRequest.id}`)
          } else {
            setDebugInfo((prev) => `${prev}\nNo request found for current project ID: ${projectId}`)

            // If no request found for this project, check project status
            if (project?.status === "PendingCompletion") {
              // If project status is PendingCompletion but no request found, try to fetch directly by project ID
              await fetchCompletionRequestByProject()
            }
          }
        }
      } else {
        const errorText = await res.text()
        setDebugInfo((prev) => `${prev}\nError fetching requests: ${res.status} - ${errorText}`)
        console.error("Failed to fetch completion requests:", res.status, errorText)

        // If expert ID fetch fails, try fetching by project ID as fallback
        await fetchCompletionRequestByProject()
      }
    } catch (err) {
      setDebugInfo((prev) => `${prev}\nException fetching requests: ${err}`)
      console.error("Error fetching completion requests:", err)

      // If expert ID fetch throws exception, try fetching by project ID as fallback
      await fetchCompletionRequestByProject()
    }
  }

  // Fallback method to fetch completion request by project ID
  const fetchCompletionRequestByProject = async () => {
    if (!projectId) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setDebugInfo((prev) => `${prev}\nTrying fallback: Fetching completion request by project ID: ${projectId}`)

    try {
      // Try to fetch the specific request for this project
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/get-project-request/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (res.ok) {
        const data = await res.json()
        setDebugInfo((prev) => `${prev}\nReceived project-specific request data`)

        if (data && data.id) {
          setCurrentRequest(data)
          setDebugInfo((prev) => `${prev}\nSet current request from project-specific endpoint: ${data.id}`)

          // Add this request to the completionRequests array if it's not already there
          setCompletionRequests((prev) => {
            if (prev.some((req) => req.id === data.id)) {
              return prev
            }
            return [...prev, data]
          })
        } else {
          setDebugInfo((prev) => `${prev}\nNo project-specific request found or invalid data format`)
        }
      } else {
        const errorText = await res.text()
        setDebugInfo((prev) => `${prev}\nError fetching project-specific request: ${res.status} - ${errorText}`)
        console.error("Failed to fetch project-specific completion request:", res.status, errorText)
      }
    } catch (err) {
      setDebugInfo((prev) => `${prev}\nException fetching project-specific request: ${err}`)
      console.error("Error fetching project-specific completion request:", err)
    }
  }

  // -----------------------------
  // 3) Fetch Comments for a Milestone
  // -----------------------------
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

  // -----------------------------
  // 4) Add a new comment
  // -----------------------------
  const handleAddComment = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !expertProfile || !currentMilestoneId) return
    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/milestone-comment/add-milestone-comment?milestoneId=${currentMilestoneId}&expertId=${expertProfile.indExptId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newComment),
        },
      )
      if (res.ok) {
        toast.success("Comment added successfully")
        setNewComment("")
        await fetchComments(currentMilestoneId)
      } else {
        console.error("Failed to add comment:", res.status)
        toast.error("Failed to add comment")
      }
    } catch (err) {
      console.error("Error adding comment:", err)
      toast.error("Error adding comment")
    }
  }

  // -----------------------------
  // 5) Fetch Tasks
  // -----------------------------
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

  // -----------------------------
  // 6) Handle Task Toggle (Update Task Status)
  // -----------------------------
  const handleTaskToggle = async (task: TaskItem) => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return

    // Only allow marking tasks as complete (not toggling back to pending)
    // This matches the controller's functionality
    if (task.taskStatus === "COMPLETED") {
      toast.info("Task is already completed")
      return
    }

    try {
      // Use the marks-as-complete endpoint from the controller
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/marks-as-complete/${projectId}/${task.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        // Update local state to show task as completed
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

  // -----------------------------
  // 7) Handle Add Task (Industry Expert adds a new task)
  // -----------------------------
  const handleAddTask = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (!newTask.trim() || !newTaskDescription.trim()) {
      toast.error("Please provide both task title and description.")
      return
    }
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-progress/add-tasks/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: newTask, description: newTaskDescription }),
      })
      if (res.ok) {
        toast.success("Task added successfully.")
        setNewTask("")
        setNewTaskDescription("")
        await fetchTasks()
      } else {
        console.error("Failed to add task:", res.status)
        toast.error("Failed to add task.")
      }
    } catch (err) {
      console.error("Error adding task:", err)
      toast.error("Error adding task.")
    }
  }

  // -----------------------------
  // 8) Fetch Reviews (if project is completed)
  // -----------------------------
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

  // -----------------------------
  // 9) Handle Add Review (Industry Expert adds a review)
  // -----------------------------
  const handleAddReview = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId || !expertProfile) return
    if (newReviewRating < 1 || newReviewRating > 5 || !newReviewText.trim()) {
      toast.error("Please provide both a review and a rating between 1 and 5.")
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
          ReviewerId: expertProfile.userId,
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
        const errorText = await res.text()
        console.error("Failed to add review:", res.status, errorText)
        toast.error(`Failed to add review: ${errorText || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error adding review:", err)
      toast.error("Error adding review.")
    }
  }

  // -----------------------------
  // 10) Handle Approve Project Completion (Expert approves student's request)
  // -----------------------------
  const handleApproveCompletion = async () => {
    if (!currentRequest) {
      toast.error("No completion request found for this project")
      return
    }

    if (!window.confirm("Are you sure you want to approve this project completion request?")) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/handle-request/${currentRequest.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify("ACCEPTED"), // The status should be "ACCEPTED" as per the API
        },
      )

      if (res.ok) {
        toast.success("Project completion approved. Please proceed to payment to complete the project.")
        // Update local project state to reflect payment pending status
        setProject((prev) => (prev ? { ...prev, status: "PaymentPending" } : prev))
        // Remove the current request
        setCurrentRequest(null)
        // Refresh completion requests
        if (expertProfile) {
          await fetchCompletionRequests(expertProfile.indExptId)
        }

        // Show payment button
        toast.info("Please click the 'Make Payment' button to complete the transaction.", {
          autoClose: 10000, // Keep this message visible longer
        })
      } else {
        const errorText = await res.text()
        console.error("Failed to approve project completion:", res.status, errorText)
        toast.error(`Failed to approve project completion: ${errorText || res.status}`)
      }
    } catch (err) {
      console.error("Error approving project completion:", err)
      toast.error(`Error approving project completion: ${err || "Unknown error"}`)
    }
  }

  // -----------------------------
  // 11) Handle Reject Project Completion (Expert rejects student's request)
  // -----------------------------
  const handleRejectCompletion = async () => {
    if (!currentRequest) {
      toast.error("No completion request found for this project")
      return
    }

    if (!window.confirm("Are you sure you want to reject this project completion request?")) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    try {
      const res = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/request-for-project-completion/handle-request/${currentRequest.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify("REJECTED"), // The status should be "REJECTED" as per the API
        },
      )

      if (res.ok) {
        toast.success("Project completion request rejected. The project is now back to active status.")
        // Update local project state to reflect active status
        setProject((prev) => (prev ? { ...prev, status: "Active" } : prev))
        // Remove the current request
        setCurrentRequest(null)
        // Refresh completion requests
        if (expertProfile) {
          await fetchCompletionRequests(expertProfile.indExptId)
        }
      } else {
        const errorText = await res.text()
        console.error("Failed to reject project completion:", res.status, errorText)
        toast.error(`Failed to reject project completion: ${errorText || res.status}`)
      }
    } catch (err) {
      console.error("Error rejecting project completion:", err)
      toast.error(`Error rejecting project completion: ${err || "Unknown error"}`)
    }
  }

  // -----------------------------
  // 12) Handle Payment Process
  // -----------------------------
  const handlePaymentProcess = () => {
    if (!projectId) {
      toast.error("Project ID is missing. Cannot proceed to payment.")
      return
    }

    // Navigate to payment page
    router.push(`/industryexpert/payment/${projectId}`)
  }

  // -----------------------------
  // Project Link Functions
  // -----------------------------
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
        console.log("No deployment link available yet")
        setProjectLink("")
      }
    } catch (err) {
      console.error("Error fetching project link:", err)
      setProjectLink("")
    }
  }

  const handleUpdateProjectLink = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (!newProjectLink.trim()) {
      toast.error("Please enter a valid project link.")
      return
    }

    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/deployement/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProjectLink),
      })
      if (res.ok) {
        toast.success("Project link updated successfully.")
        setProjectLink(newProjectLink)
        setNewProjectLink("")
        setShowLinkForm(false)
      } else {
        console.error("Failed to update project link:", res.status)
        toast.error("Failed to update project link.")
      }
    } catch (err) {
      console.error("Error updating project link:", err)
      toast.error("Error updating project link.")
    }
  }

  // Manually check for completion requests
  const handleManualRefresh = async () => {
    if (!expertProfile) {
      toast.error("Expert profile not loaded yet")
      return
    }

    setDebugInfo("Manually refreshing completion requests...")
    toast.info("Refreshing completion requests...")

    await fetchCompletionRequests(expertProfile.indExptId)

    // Also check if the current project status is PendingCompletion
    if (project?.status === "PendingCompletion") {
      await fetchCompletionRequestByProject()
    }

    // Refresh project details to get the latest status
    const token = localStorage.getItem("jwtToken")
    if (token && projectId) {
      try {
        const projectRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-project-by-id/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          setProject(projectData)
        }
      } catch (err) {
        console.error("Error refreshing project details:", err)
      }
    }

    toast.success("Refresh complete")
  }

  // Fetch tasks when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  // When project becomes complete, fetch reviews
  useEffect(() => {
    if (project?.status === "Completed") {
      fetchReviews()
    }
  }, [project])

  // Check for completion requests when project status changes to PendingCompletion
  useEffect(() => {
    if (project?.status === "PendingCompletion" && expertProfile) {
      // If project status is PendingCompletion, try to fetch completion requests again
      fetchCompletionRequests(expertProfile.indExptId)
    }
    if (project?.status === "Completed") {
      fetchReviews()
    }
  }, [project?.status, expertProfile])

  // -----------------------------
  // Project Modules Functions
  // -----------------------------
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
      }
    } catch (err) {
      console.error("Error fetching modules:", err)
    }
  }

  const handleAddModule = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token || !projectId) return
    if (!newModuleName.trim() || !newModuleDescription.trim()) {
      toast.error("Please provide both module name and description.")
      return
    }
    try {
      const res = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/project-module/add/${projectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newModuleName,
          description: newModuleDescription,
        }),
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
    }
  }

  const handleModuleStatusToggle = async (module: ProjectModule) => {
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
        toast.success(`Module ${newStatus ? "activated" : "deactivated"} successfully`)
      } else {
        console.error("Failed to update module status:", res.status)
        toast.error("Failed to update module status")
      }
    } catch (err) {
      console.error("Error updating module status:", err)
      toast.error("Error updating module status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading project data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
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
    <div className="min-h-screen bg-gray-100">
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
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition duration-200"
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
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
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

                  {project?.budget && (
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
                    <span className="text-sm font-medium text-blue-600">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Deployment Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Project Deployment</h3>
                  {!isProjectComplete && (
                    <button
                      onClick={() => setShowLinkForm(!showLinkForm)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {showLinkForm ? "Cancel" : projectLink ? "Update Link" : "Add Link"}
                    </button>
                  )}
                </div>

                {projectLink ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Deployment URL</p>
                        <a
                          href={projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 break-all"
                        >
                          {projectLink}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(projectLink, "_blank")}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Live Project
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 rounded-full p-3 mx-auto w-fit mb-3">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No deployment link available yet</p>
                  </div>
                )}

                {/* Add/Update Link Form */}
                {showLinkForm && !isProjectComplete && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="project-link" className="block text-sm font-medium text-gray-700 mb-1">
                          Deployment URL
                        </label>
                        <input
                          id="project-link"
                          type="url"
                          value={newProjectLink}
                          onChange={(e) => setNewProjectLink(e.target.value)}
                          placeholder="https://your-project-deployment.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleUpdateProjectLink}
                          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                        >
                          {projectLink ? "Update Link" : "Add Link"}
                        </button>
                        <button
                          onClick={() => {
                            setShowLinkForm(false)
                            setNewProjectLink("")
                          }}
                          className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Project Completion Request Actions */}
            {currentRequest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <Flag className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Completion Request</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Student:</span> {currentRequest.studentName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">Request Date:</span>{" "}
                      {new Date(currentRequest.requestDate).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      The student has requested to mark this project as complete. Please review the project milestones
                      and tasks before approving or rejecting this request.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleApproveCompletion}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Approve
                    </button>
                    <button
                      onClick={handleRejectCompletion}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manual refresh button for completion requests */}
            {project?.status === "PendingCompletion" && !currentRequest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 border-yellow-500"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 rounded-full p-2 mr-3">
                      <RefreshCw className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Pending Completion</h3>
                  </div>

                  <p className="text-gray-600 mb-4">
                    This project has a pending completion request, but the details could not be loaded. Click the button
                    below to refresh and check for completion requests.
                  </p>

                  <button
                    onClick={handleManualRefresh}
                    className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh Completion Requests
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment Pending or Completed Status */}
            {(isProjectComplete || isPaymentPending) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden mb-6 border-l-4 ${
                  isPaymentPending ? "border-blue-500" : "border-green-500"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`rounded-full p-2 mr-3 ${isPaymentPending ? "bg-blue-100" : "bg-green-100"}`}>
                      {isPaymentPending ? (
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {isPaymentPending ? "Payment Required" : "Project Completed"}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {isPaymentPending
                      ? "Project completion approved. Payment is required to finalize the project."
                      : "This project is complete. Editing is disabled."}
                  </p>

                  <button
                    onClick={handlePaymentProcess}
                    className={`w-full py-2 px-4 font-medium rounded-lg transition duration-200 flex items-center justify-center ${
                      isPaymentPending
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    {isPaymentPending ? "Make Payment" : "View Payment Details"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* All Completion Requests Section */}
            {completionRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">All Completion Requests</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {completionRequests.map((request) => (
                          <tr key={request.id} className={request.projectId === projectId ? "bg-blue-50" : ""}>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                              {request.projectTitle}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{request.studentName}</td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.requestDate).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : request.status === "ACCEPTED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm">
                              {request.projectId !== projectId && (
                                <button
                                  onClick={() => router.push(`/industryexpert/projects/milestone/${request.projectId}`)}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("milestones")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "milestones"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Milestones
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "tasks"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab("modules")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "modules"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Modules
                  </button>
                  {isProjectComplete && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 ${
                        activeTab === "reviews"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Reviews
                    </button>
                  )}
                  {expertProfile?.userId && studentDetails?.stdUserId && (
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`py-4 px-6 font-medium text-sm border-b-2 ${
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
                {/* Milestones Tab */}
                {activeTab === "milestones" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Milestones</h2>
                    </div>

                    {milestones.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No milestones found for this project.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {milestones.map((mile, index) => (
                          <motion.div
                            key={mile.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                              mile.isCompleted ? "border-green-200" : "border-yellow-200"
                            }`}
                          >
                            <div className="p-5">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <div
                                    className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                                      mile.isCompleted ? "bg-green-100" : "bg-yellow-100"
                                    }`}
                                  >
                                    {mile.isCompleted ? (
                                      <CheckCircle className={`h-5 w-5 text-green-600`} />
                                    ) : (
                                      <Clock className={`h-5 w-5 text-yellow-600`} />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{mile.title}</h3>
                                    <p className="text-gray-600 mt-1">{mile.description}</p>
                                    <div className="flex items-center mt-2">
                                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                      <p className="text-sm text-gray-500">
                                        Target date: {new Date(mile.achievementDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    mile.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {mile.isCompleted ? "Completed" : "In Progress"}
                                </span>
                              </div>

                              {/* Button to load comments */}
                              <button
                                onClick={() => {
                                  if (currentMilestoneId === mile.id) {
                                    setCurrentMilestoneId(null)
                                  } else {
                                    setCurrentMilestoneId(mile.id)
                                    fetchComments(mile.id)
                                  }
                                }}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {currentMilestoneId === mile.id ? "Hide Comments" : "View Comments"}
                                {currentMilestoneId === mile.id ? (
                                  <ChevronUp className="h-4 w-4 ml-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                )}
                              </button>

                              {/* Comments Section */}
                              {currentMilestoneId === mile.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Comments</h4>

                                  {comments[mile.id]?.length > 0 ? (
                                    <div className="space-y-4 mb-4">
                                      {comments[mile.id].map((c) => (
                                        <div key={c.id} className="bg-gray-50 rounded-lg p-4">
                                          <p className="text-gray-700">{c.comment}</p>
                                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                            <span className="font-medium">{c.commenterName}</span>
                                            <span>{new Date(c.commentDate).toLocaleString()}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500 italic mb-4">No comments yet</p>
                                  )}

                                  {!isProjectComplete && !isPaymentPending && (
                                    <div className="mt-4">
                                      <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                      />
                                      <button
                                        onClick={handleAddComment}
                                        className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                                      >
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Comment
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
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

                    {/* Add Task Form */}
                    {!isProjectComplete && !isPaymentPending && (
                      <div className="bg-gray-50 rounded-lg p-5 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                              Task Title
                            </label>
                            <input
                              id="task-title"
                              type="text"
                              value={newTask}
                              onChange={(e) => setNewTask(e.target.value)}
                              placeholder="Enter task title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                              Task Description
                            </label>
                            <textarea
                              id="task-description"
                              value={newTaskDescription}
                              onChange={(e) => setNewTaskDescription(e.target.value)}
                              placeholder="Enter task description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                            />
                          </div>

                          <button
                            onClick={handleAddTask}
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                          >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Task
                          </button>
                        </div>
                      </div>
                    )}

                    {/* List of Tasks */}
                    {tasks.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
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
                                    disabled={isProjectComplete || isPaymentPending || task.taskStatus === "COMPLETED"}
                                    className="focus:outline-none"
                                  >
                                    {task.taskStatus === "COMPLETED" ? (
                                      <CheckSquare className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Square className="h-5 w-5 text-gray-400" />
                                    )}
                                  </button>
                                </div>
                                <div className="ml-3 flex-1">
                                  <p
                                    className={`font-medium ${
                                      task.taskStatus === "COMPLETED" ? "line-through text-gray-500" : "text-gray-800"
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
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="module-description"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Module Description
                            </label>
                            <textarea
                              id="module-description"
                              value={newModuleDescription}
                              onChange={(e) => setNewModuleDescription(e.target.value)}
                              placeholder="Enter module description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                            />
                          </div>

                          <button
                            onClick={handleAddModule}
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                          >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Module
                          </button>
                        </div>
                      </div>
                    )}

                    {/* List of Modules */}
                    {modules.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No modules created for this project yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {modules.map((module, index) => (
                          <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                              module.status ? "border-green-200" : "border-gray-200"
                            }`}
                          >
                            <div className="p-5">
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
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      module.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {module.status ? "Active" : "Inactive"}
                                  </span>
                                  {!isProjectComplete && !isPaymentPending && (
                                    <button
                                      onClick={() => handleModuleStatusToggle(module)}
                                      className={`px-3 py-1 rounded-lg text-sm font-medium transition duration-200 ${
                                        module.status
                                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                                          : "bg-green-100 text-green-700 hover:bg-green-200"
                                      }`}
                                    >
                                      {module.status ? "Deactivate" : "Activate"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && isProjectComplete && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Project Reviews</h2>
                    </div>

                    {/* Existing Reviews */}
                    {reviews.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
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
                              <div className="flex items-center">
                                <div className="mr-3">
                                  <Image
                                    src={getExpertAvatar() || "/placeholder.svg"}
                                    alt={review.reviewerName}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                </div>
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

                    {/* Add Review Form */}
                    <div className="bg-gray-50 rounded-lg p-5">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    ? "bg-yellow-400 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
                {activeTab === "chat" && expertProfile?.userId && studentDetails?.stdUserId && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800 heading-underline">Chat with Student</h2>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <ChatForIndustry expertId={expertProfile.userId} studentId={studentDetails.stdUserId} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information (only visible during development) */}
      {debugInfo && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-yellow-600">Debug Information</h3>
              <button
                onClick={() => setDebugInfo(null)}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              >
                Clear Debug Info
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 p-3 rounded">{debugInfo}</pre>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default MilestonePage
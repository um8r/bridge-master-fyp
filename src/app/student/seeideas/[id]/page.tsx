"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  ArrowLeft,
  User,
  Code,
  Lightbulb,
  Mail,
  Building,
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Share2,
  Download,
  Star,
  MessageSquare,
  Bookmark,
  Cpu,
  Globe,
  Smartphone,
  Cloud,
  Shield,
  Database,
  Server,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface IdeaDetails {
  id: string
  title: string
  technology: string
  description: string
  facultyName: string
  email: string
  uniName: string
}

interface UserProfile {
  stdId: string
  firstName: string
  lastName: string
  email: string
  universityName: string
}

// Technology icons mapping
const getTechIcon = (technology: string) => {
  const techLower = technology.toLowerCase()

  if (techLower.includes("ai") || techLower.includes("machine") || techLower.includes("ml")) {
    return <Cpu className="w-5 h-5" />
  } else if (techLower.includes("web") || techLower.includes("react") || techLower.includes("angular")) {
    return <Globe className="w-5 h-5" />
  } else if (techLower.includes("mobile") || techLower.includes("android") || techLower.includes("ios")) {
    return <Smartphone className="w-5 h-5" />
  } else if (techLower.includes("cloud") || techLower.includes("aws") || techLower.includes("azure")) {
    return <Cloud className="w-5 h-5" />
  } else if (techLower.includes("security") || techLower.includes("cyber")) {
    return <Shield className="w-5 h-5" />
  } else if (techLower.includes("data") || techLower.includes("database")) {
    return <Database className="w-5 h-5" />
  } else if (techLower.includes("backend") || techLower.includes("server")) {
    return <Server className="w-5 h-5" />
  } else {
    return <Code className="w-5 h-5" />
  }
}

// Get image for idea based on technology
const getIdeaImage = (technology: string) => {
  const techLower = technology.toLowerCase()

  if (techLower.includes("ai") || techLower.includes("machine") || techLower.includes("ml")) {
    return "https://images.unsplash.com/photo-1677442135136-760c813a6a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
  } else if (techLower.includes("web") || techLower.includes("react") || techLower.includes("angular")) {
    return "https://images.unsplash.com/photo-1581092160607-ee22731b9b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  } else if (techLower.includes("mobile") || techLower.includes("android") || techLower.includes("ios")) {
    return "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  } else if (techLower.includes("cloud") || techLower.includes("aws") || techLower.includes("azure")) {
    return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  } else if (techLower.includes("security") || techLower.includes("cyber")) {
    return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  } else if (techLower.includes("data") || techLower.includes("database")) {
    return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2034&q=80"
  } else if (techLower.includes("iot") || techLower.includes("embedded")) {
    return "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  } else {
    return "https://images.unsplash.com/photo-1573495612937-f02b92648e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
  }
}

const IdeaDetailsPage: React.FC = () => {
  const [idea, setIdea] = useState<IdeaDetails | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestPlaced, setRequestPlaced] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [relatedIdeas, setRelatedIdeas] = useState<IdeaDetails[]>([])

  const { id } = useParams()
  const router = useRouter()

  useEffect(() => {
    // Check if idea is bookmarked
    const savedBookmarks = localStorage.getItem("bookmarkedIdeas")
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks)
      setIsBookmarked(bookmarks.includes(id))
    }

    const fetchIdeaDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("Please log in to access this page.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
        return
      }

      try {
        // 1) Fetch idea details
        const ideaResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-idea-by-id/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!ideaResponse.ok) {
          throw new Error("Failed to fetch idea details.")
        }

        const ideaData: IdeaDetails[] = await ideaResponse.json()
        if (ideaData.length > 0) {
          setIdea(ideaData[0])

          // Fetch related ideas (ideas with similar technology)
          const allIdeasResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-ideas-by-uni/${ideaData[0].uniName}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (allIdeasResponse.ok) {
            const allIdeas: IdeaDetails[] = await allIdeasResponse.json()
            // Filter related ideas by technology and exclude current idea
            const related = allIdeas
              .filter(
                (i) =>
                  i.id !== ideaData[0].id &&
                  (i.technology.toLowerCase().includes(ideaData[0].technology.toLowerCase()) ||
                    ideaData[0].technology.toLowerCase().includes(i.technology.toLowerCase())),
              )
              .slice(0, 3) // Limit to 3 related ideas

            setRelatedIdeas(related)
          }
        } else {
          throw new Error("Idea not found.")
        }

        // 2) Fetch user profile (to get stdId)
        const profileRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileRes.ok) {
          throw new Error("Authorization failed. Please log in again.")
        }

        const profileData = await profileRes.json()
        const userId = profileData.userId

        // 3) Fetch student details
        const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student details.")
        }

        const studentData = await studentResponse.json()
        setUserProfile({
          stdId: studentData.id,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email: studentData.email,
          universityName: studentData.universityName,
        })

        // 4) Check if request is already placed
        const interestResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/interested-for-idea/get-interested-students/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (interestResponse.ok) {
          const interestedStudents = await interestResponse.json()
          if (Array.isArray(interestedStudents)) {
            const isInterested = interestedStudents.some((student: any) => student.studentId === studentData.id)
            setRequestPlaced(isInterested)
          }
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to fetch idea details.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/student/seeideas")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeaDetails()
  }, [id, router])

  const handleExpressInterest = async () => {
    if (!userProfile || !idea) return

    const token = localStorage.getItem("jwtToken")

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/interested-for-idea/student-interested-for-idea/${userProfile.stdId}/${idea.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to place request.")
      }

      toast.success("Your interest has been successfully expressed.", {
        position: "top-center",
        autoClose: 3000,
      })

      setRequestPlaced(true)
    } catch (error) {
      toast.error((error as Error).message || "Failed to place request.", {
        position: "top-center",
        autoClose: 3000,
      })
    }
  }

  const toggleBookmark = () => {
    if (!idea) return

    const savedBookmarks = localStorage.getItem("bookmarkedIdeas")
    let bookmarks: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : []

    if (isBookmarked) {
      bookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== idea.id)
      toast.success("Removed from bookmarks", { autoClose: 2000 })
    } else {
      bookmarks.push(idea.id)
      toast.success("Added to bookmarks", { autoClose: 2000 })
    }

    localStorage.setItem("bookmarkedIdeas", JSON.stringify(bookmarks))
    setIsBookmarked(!isBookmarked)
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

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Idea Not Found</h2>
          <p className="text-gray-600 mb-6">The project idea youre looking for doesnt exist or has been removed.</p>
          <Link
            href="/student/seeideas"
            className="inline-block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Ideas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-64 overflow-hidden">
        <img
          src={getIdeaImage(idea.technology) || "/placeholder.svg"}
          alt={idea.title}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-2">
            <Link
              href="/student/seeideas"
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {getTechIcon(idea.technology)}
              <span className="ml-1">{idea.technology}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{idea.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl">A final year project idea by {idea.facultyName}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 -mt-8 mb-8 relative z-10 flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExpressInterest}
              disabled={requestPlaced}
              className={`flex items-center px-4 py-2 rounded-md ${
                requestPlaced
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition`}
            >
              {requestPlaced ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Interest Expressed
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Express Interest
                </>
              )}
            </button>
            <button
              onClick={toggleBookmark}
              className={`flex items-center px-4 py-2 rounded-md ${
                isBookmarked
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
              } transition`}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-yellow-500" : ""}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                  Project Description
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-line">{idea.description}</p>
              </div>
            </div>

            {/* Project Requirements */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Project Requirements
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-blue-500" />
                      Technical Skills
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      {idea.technology.split(",").map((tech, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{tech.trim()}</span>
                        </li>
                      ))}
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Problem-solving abilities</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      Timeline
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Expected duration: 10-12 months</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Regular progress meetings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Final presentation required</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      Team Size
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Individual or team of 2-3 students</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Collaborative skills required</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Resources
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Access to university labs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Faculty guidance and mentorship</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Relevant research papers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

    
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Faculty Info Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Faculty Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">{idea.facultyName}</h3>
                    <p className="text-sm text-gray-600">{idea.uniName}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{idea.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-800">Computer Science</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-gray-800">{idea.technology}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* University Info */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-500" />
                  University
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">{idea.uniName}</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  This project idea is officially endorsed by the university and aligns with the curriculum requirements
                  for final year projects.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default IdeaDetailsPage

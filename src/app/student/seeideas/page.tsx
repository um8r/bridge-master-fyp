"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Search,
  Lightbulb,
  Code,
  User,
  BookOpen,
  Filter,
  ChevronDown,
  Bookmark,
  TrendingUp,
  Zap,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Shield,
  Server,
} from "lucide-react"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  universityName: string
  uniId: string
  stdId: string
}

interface Idea {
  id: string
  title: string
  technology: string
  description: string
  facultyName: string
  email: string
  uniName: string
}

// Technology categories with icons
const techCategories = [
  { name: "All", icon: <Code className="w-4 h-4" /> },
  { name: "AI/ML", icon: <Cpu className="w-4 h-4" /> },
  { name: "Web", icon: <Globe className="w-4 h-4" /> },
  { name: "Mobile", icon: <Smartphone className="w-4 h-4" /> },
  { name: "Cloud", icon: <Cloud className="w-4 h-4" /> },
  { name: "Security", icon: <Shield className="w-4 h-4" /> },
  { name: "Database", icon: <Database className="w-4 h-4" /> },
  { name: "Backend", icon: <Server className="w-4 h-4" /> },
]

// Technology image mapping
const getTechImage = (technology: string): string => {
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

function getTechIcon(technology: string) {
  const techLower = technology.toLowerCase()

  if (techLower.includes("ai") || techLower.includes("machine") || techLower.includes("ml")) {
    return <Cpu className="w-3 h-3" />
  } else if (techLower.includes("web") || techLower.includes("react") || techLower.includes("angular")) {
    return <Globe className="w-3 h-3" />
  } else if (techLower.includes("mobile") || techLower.includes("android") || techLower.includes("ios")) {
    return <Smartphone className="w-3 h-3" />
  } else if (techLower.includes("cloud") || techLower.includes("aws") || techLower.includes("azure")) {
    return <Cloud className="w-3 h-3" />
  } else if (techLower.includes("security") || techLower.includes("cyber")) {
    return <Shield className="w-3 h-3" />
  } else if (techLower.includes("data") || techLower.includes("database")) {
    return <Database className="w-3 h-3" />
  } else if (techLower.includes("backend") || techLower.includes("server")) {
    return <Server className="w-3 h-3" />
  } else {
    return <Code className="w-3 h-3" />
  }
}

const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<string[]>([])
  const [takenIds, setTakenIds] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    // Load bookmarked ideas from localStorage
    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem("bookmarkedIdeas")
        if (savedBookmarks) {
          setBookmarkedIdeas(JSON.parse(savedBookmarks))
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error)
      }
    }

    // Load taken ideas from localStorage or API
    const loadTakenIdeas = () => {
      try {
        const savedTakenIds = localStorage.getItem("takenIdeas")
        if (savedTakenIds) {
          setTakenIds(JSON.parse(savedTakenIds))
        } else {
          // Fallback to default if needed
          setTakenIds(["idea123", "someOtherId"])
        }
      } catch (error) {
        console.error("Error loading taken ideas:", error)
        setTakenIds(["idea123", "someOtherId"])
      }
    }

    loadBookmarks()
    loadTakenIdeas()
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
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
      // 1) Get user info
      const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!profileResponse.ok) {
        throw new Error("Authorization failed. Please log in again.")
      }

      const profileData = await profileResponse.json()
      const userId = profileData.userId

      // 2) Get student details
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
      const uniId = studentData.universityId

      // Save user profile
      setUserProfile({
        userId: studentData.userId,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        universityName: studentData.universityName,
        uniId: uniId,
        stdId: studentData.id,
      })

      // 3) Get ideas by university
      const ideasResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-ideas-by-uni/${uniId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!ideasResponse.ok) {
        throw new Error("Failed to fetch ideas.")
      }

      const ideasData = await ideasResponse.json()

      // Filter out taken ideas
      const filtered = ideasData.filter((idea: Idea) => !takenIds.includes(idea.id))
      setIdeas(filtered)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Toggle bookmark for an idea
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click

    const newBookmarkedIdeas = bookmarkedIdeas.includes(id)
      ? bookmarkedIdeas.filter((ideaId) => ideaId !== id)
      : [...bookmarkedIdeas, id]

    setBookmarkedIdeas(newBookmarkedIdeas)

    try {
      localStorage.setItem("bookmarkedIdeas", JSON.stringify(newBookmarkedIdeas))
      toast.success(bookmarkedIdeas.includes(id) ? "Removed from bookmarks" : "Added to bookmarks", { autoClose: 2000 })
    } catch (error) {
      console.error("Error saving bookmarks:", error)
      toast.error("Failed to save bookmark")
    }
  }

  // Filter ideas by searchTerm and category
  const getFilteredIdeas = () => {
    const filtered = ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" || idea.technology.toLowerCase().includes(selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })

    // Sort ideas
    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return b.id.localeCompare(a.id)
      } else if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "bookmarked") {
        const aBookmarked = bookmarkedIdeas.includes(a.id) ? 1 : 0
        const bBookmarked = bookmarkedIdeas.includes(b.id) ? 1 : 0
        return bBookmarked - aBookmarked
      }
      return 0
    })
  }

  const handleIdeaClick = (id: string) => {
    router.push(`/student/seeideas/${id}`)
  }

  // Memoize filtered and sorted ideas
  const sortedIdeas = getFilteredIdeas()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading project ideas...</p>
          <p className="text-sm text-gray-500 mt-2">Discovering your next big project</p>
        </div>
      </div>
    )
  }

  if (error) {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/login-user")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Project Ideas Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">Final Year Project Ideas</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Discover innovative project ideas from your university faculty members
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* University Profile Card */}
        {userProfile && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 -mt-16 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">{userProfile.universityName}</h2>
                <p className="text-gray-600">
                  Welcome, {userProfile.firstName} {userProfile.lastName}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{ideas.length}</p>
                <p className="text-sm text-gray-600">Total Ideas</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(ideas.map((idea) => idea.facultyName)).size}
                </p>
                <p className="text-sm text-gray-600">Faculty Members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-3">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{new Set(ideas.map((idea) => idea.technology)).size}</p>
                <p className="text-sm text-gray-600">Technologies</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-3">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookmarkedIdeas.length}</p>
                <p className="text-sm text-gray-600">Bookmarked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas by title, technology or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {techCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Sort By */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="bookmarked">Bookmarked First</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Technology Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {techCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category.name
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        {sortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer relative flex flex-col h-full transform hover:-translate-y-1"
                onClick={() => handleIdeaClick(idea.id)}
              >
                {/* Idea Image with Overlay */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

                  {/* Bookmark Button - Redesigned */}
                  <button
                    onClick={(e) => toggleBookmark(idea.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 z-10 transform group-hover:scale-105"
                    aria-label={bookmarkedIdeas.includes(idea.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedIdeas.includes(idea.id)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                  </button>

                  {/* Technology Badge - Redesigned */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm flex items-center">
                      {getTechIcon(idea.technology)}
                      <span className="ml-1">{idea.technology}</span>
                    </span>
                  </div>

                  {/* Title - Redesigned */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-50 transition-colors duration-300">
                      {idea.title}
                    </h3>
                  </div>
                </div>

                {/* Idea Content - Redesigned */}
                <div className="p-5 flex-grow flex flex-col">
                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{idea.description}</p>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-3"></div>

                  {/* Faculty Info - Redesigned */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-50 p-2 rounded-full mr-2.5">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{idea.facultyName}</p>
                        <p className="text-xs text-gray-500">{idea.email}</p>
                      </div>
                    </div>

                    {/* View Details Button - Redesigned */}
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-xs font-medium mr-1.5">Details</span>
                      <div className="bg-blue-50 p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                        <Zap className="w-3.5 h-3.5 transform group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No ideas found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm
                ? `No ideas match your search "${searchTerm}". Try different keywords or filters.`
                : "No project ideas are available for your university at the moment."}
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className={`px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors ${!searchTerm && selectedCategory === "All" ? "hidden" : ""}`}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Trending Technologies Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Trending Technologies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-full mr-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-purple-800">AI & Machine Learning</h3>
              </div>
              <p className="text-sm text-purple-700">
                Explore cutting-edge AI technologies including deep learning, NLP, and computer vision.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-800">Web Development</h3>
              </div>
              <p className="text-sm text-blue-700">
                Build modern web applications using React, Angular, Vue, and other cutting-edge frameworks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-2">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-green-800">Mobile Development</h3>
              </div>
              <p className="text-sm text-green-700">
                Create native and cross-platform mobile apps for iOS and Android platforms.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-2">
                <div className="bg-yellow-100 p-2 rounded-full mr-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-bold text-yellow-800">Cybersecurity</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Develop solutions for network security, encryption, and vulnerability assessment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default IdeasPage

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import {
  Search,
  BookOpen,
  User,
  Building,
  ExternalLink,
  Download,
  Bookmark,
  Filter,
  ChevronDown,
  Clock,
  Star,
  GraduationCap,
  FileText,
  Layers,
  Code,
  Database,
  Globe,
  Cpu,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react"

interface EducationalResource {
  id: string
  title: string
  content: string
  sourceLink: string
  facultyId: string
  facultyName: string
  facultyPost: string
  facultyDepartment: string
  universityId: string
  universityName: string
  universityLocation: string
  imageUrl?: string
  category?: string
  dateAdded?: string
  bookmarked?: boolean
}

const StudentEducationalResources = () => {
  const router = useRouter()
  const [resources, setResources] = useState<EducationalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "university" | "bookmarked" | "recent">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [universityId, setUniversityId] = useState<string | null>(null)
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([])
  const [userProfile, setUserProfile] = useState<{ name: string; university: string } | null>(null)

  // Resource categories
  const categories = [
    { name: "all", label: "All Categories", icon: <Layers className="w-4 h-4" /> },
    { name: "programming", label: "Programming", icon: <Code className="w-4 h-4" /> },
    { name: "data-science", label: "Data Science", icon: <Database className="w-4 h-4" /> },
    { name: "web-development", label: "Web Development", icon: <Globe className="w-4 h-4" /> },
    { name: "ai-ml", label: "AI & Machine Learning", icon: <Cpu className="w-4 h-4" /> },
    { name: "cybersecurity", label: "Cybersecurity", icon: <Shield className="w-4 h-4" /> },
  ]

  // Placeholder images with categories
  const placeholderImages = [
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      category: "programming",
    },
    {
      url: "https://images.unsplash.com/photo-1501504901893-7f44a978966d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      category: "data-science",
    },
    {
      url: "https://images.unsplash.com/photo-1516761497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      category: "web-development",
    },
    {
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      category: "ai-ml",
    },
    {
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      category: "cybersecurity",
    },
  ]

  // Assign category based on content keywords
  const assignCategory = (content: string): string => {
    const contentLower = content.toLowerCase()
    if (contentLower.includes("python") || contentLower.includes("java") || contentLower.includes("programming")) {
      return "programming"
    } else if (
      contentLower.includes("data") ||
      contentLower.includes("analytics") ||
      contentLower.includes("statistics")
    ) {
      return "data-science"
    } else if (contentLower.includes("web") || contentLower.includes("html") || contentLower.includes("css")) {
      return "web-development"
    } else if (
      contentLower.includes("ai") ||
      contentLower.includes("machine learning") ||
      contentLower.includes("neural")
    ) {
      return "ai-ml"
    } else if (contentLower.includes("security") || contentLower.includes("cyber") || contentLower.includes("hack")) {
      return "cybersecurity"
    }

    // Default to a random category if no keywords match
    const categories = ["programming", "data-science", "web-development", "ai-ml", "cybersecurity"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  // Get image based on category
  const getImageForCategory = (category: string): string => {
    const image = placeholderImages.find((img) => img.category === category)
    return image ? image.url : placeholderImages[0].url
  }

  useEffect(() => {
    // Load bookmarked resources from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedResources")
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks))
    }

    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("jwtToken")
        if (!token) {
          router.push("/auth/login-user")
          return
        }

        // Fetch user profile to get university ID
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const profileData = await profileResponse.json()
        const userId = profileData.userId

        // Get student details
        const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!studentResponse.ok) {
          throw new Error("Failed to fetch student details")
        }

        const studentData = await studentResponse.json()
        const uniId = studentData.universityId
        setUniversityId(uniId)

        // Set user profile
        setUserProfile({
          name: `${studentData.firstName} ${studentData.lastName}`,
          university: studentData.universityName,
        })

        // Get all resources
        const allResourcesResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/get-all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!allResourcesResponse.ok) {
          throw new Error("Failed to fetch educational resources")
        }

        const allResourcesData = await allResourcesResponse.json()

        // If we have university ID, also get university-specific resources
        let combinedResources: EducationalResource[] = allResourcesData
        if (uniId) {
          const uniResourcesResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/get-by-id/${uniId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (uniResourcesResponse.ok) {
            const uniResourcesData = await uniResourcesResponse.json()
            combinedResources = [...allResourcesData, ...uniResourcesData]
          }
        }

        // Deduplicate resources and add random placeholder images, categories, and dates
        const uniqueResources = Array.from(
          new Map<string, EducationalResource>(combinedResources.map((item) => [item.id, item])).values(),
        ).map((resource: EducationalResource) => {
          const category = assignCategory(resource.content)
          return {
            ...resource,
            category,
            imageUrl: getImageForCategory(category),
            dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            bookmarked: bookmarkedResources.includes(resource.id),
          }
        })

        setResources(uniqueResources)
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
        toast.error(error instanceof Error ? error.message : "Failed to load resources")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [router])

  // Toggle bookmark for a resource
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newBookmarkedResources = bookmarkedResources.includes(id)
      ? bookmarkedResources.filter((resourceId) => resourceId !== id)
      : [...bookmarkedResources, id]

    setBookmarkedResources(newBookmarkedResources)
    localStorage.setItem("bookmarkedResources", JSON.stringify(newBookmarkedResources))

    // Update the resources state to reflect the bookmark change
    setResources(
      resources.map((resource) => (resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource)),
    )

    toast.success(bookmarkedResources.includes(id) ? "Removed from bookmarks" : "Added to bookmarks", {
      autoClose: 2000,
    })
  }

  // Filter resources based on search term, filter type, and category
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.universityName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter

    if (filter === "university" && universityId) {
      return matchesSearch && resource.universityId === universityId && matchesCategory
    } else if (filter === "bookmarked") {
      return matchesSearch && resource.bookmarked && matchesCategory
    } else if (filter === "recent") {
      // For demo purposes, we'll just use the first 5 resources as "recent"
      const recentIds = resources.slice(0, 5).map((r) => r.id)
      return matchesSearch && recentIds.includes(resource.id) && matchesCategory
    }

    return matchesSearch && matchesCategory
  })

  // Sort resources by date (newest first)
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (a.dateAdded && b.dateAdded) {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    }
    return 0
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading educational resources...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your learning materials</p>
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
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Educational Resources Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">Educational Resources</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Discover learning materials from top faculty and universities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* User Profile Card */}
        {userProfile && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 -mt-16 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {userProfile.name}</h2>
                <p className="text-gray-600">Find resources to enhance your learning journey</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>{userProfile.university}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{resources.length}</p>
                <p className="text-sm text-gray-600">Total Resources</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(resources.map((resource) => resource.universityName)).size}
                </p>
                <p className="text-sm text-gray-600">Universities</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-3">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(resources.map((resource) => resource.facultyName)).size}
                </p>
                <p className="text-sm text-gray-600">Faculty Members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-3">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookmarkedResources.length}</p>
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
                placeholder="Search resources by title, content, faculty or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "university" | "bookmarked" | "recent")}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Resources</option>
                <option value="university">My University</option>
                <option value="bookmarked">Bookmarked</option>
                <option value="recent">Recently Added</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Layers className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setCategoryFilter(category.name)}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  categoryFilter === category.name
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Indicators */}
        <div className="flex items-center mb-6">
          {filter !== "all" && (
            <div className="flex items-center mr-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {filter === "university" ? (
                <Building className="w-4 h-4 mr-1" />
              ) : filter === "bookmarked" ? (
                <Bookmark className="w-4 h-4 mr-1" />
              ) : (
                <Clock className="w-4 h-4 mr-1" />
              )}
              <span>
                {filter === "university" ? "My University" : filter === "bookmarked" ? "Bookmarked" : "Recently Added"}
              </span>
            </div>
          )}

          {categoryFilter !== "all" && (
            <div className="flex items-center mr-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {categories.find((c) => c.name === categoryFilter)?.icon}
              <span className="ml-1">{categories.find((c) => c.name === categoryFilter)?.label}</span>
            </div>
          )}

          {searchTerm && (
            <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              <Search className="w-4 h-4 mr-1" />
              <span>Search: {searchTerm}</span>
            </div>
          )}
        </div>

        {/* Trending Topics */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Trending Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Machine Learning
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Web Development
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Data Science
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Cybersecurity
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Cloud Computing
            </span>
          </div>
        </div>

        {/* Resources Grid */}
        {sortedResources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="No resources found"
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? `No resources match your search "${searchTerm}". Try different keywords or filters.`
                : filter === "university"
                  ? "No resources available from your university."
                  : filter === "bookmarked"
                    ? "You haven't bookmarked any resources yet."
                    : "No educational resources available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Resource Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={resource.imageUrl || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {resource.category && resource.category.replace("-", " ")}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(resource.id, e)}
                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${resource.bookmarked ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                    />
                  </button>

                  {/* Title */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="text-lg font-bold text-white">{resource.title}</h3>
                  </div>
                </div>

                {/* Resource Content */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{resource.content}</p>

                  {/* Faculty & University Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {resource.facultyName}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {resource.facultyDepartment}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      {resource.universityName}
                    </span>
                  </div>

                  {/* Date Added */}
                  {resource.dateAdded && (
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Clock className="w-3 h-3 mr-1" />
                      Added {new Date(resource.dateAdded).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    {resource.sourceLink && (
                      <a
                        href={resource.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Source
                      </a>
                    )}

                    <button className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Faculty */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-blue-500" />
            Featured Faculty
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from(new Set(resources.map((resource) => resource.facultyName)))
              .slice(0, 3)
              .map((facultyName, index) => {
                const facultyResource = resources.find((resource) => resource.facultyName === facultyName)
                if (!facultyResource) return null

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-blue-200">
                      <img
                        src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"}/${index + 1}.jpg`}
                        alt={facultyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-gray-800 text-center">{facultyName}</h3>
                    <p className="text-sm text-gray-500 text-center mb-2">{facultyResource.facultyDepartment}</p>
                    <p className="text-xs text-blue-600 text-center">
                      {resources.filter((resource) => resource.facultyName === facultyName).length} resources
                    </p>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default StudentEducationalResources

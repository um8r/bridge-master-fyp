"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Cpu, Code, Database, Globe, Layers, Shield, Search, Filter, ChevronDown, Users, Bookmark, Calendar, TrendingUp, Award, Briefcase, Server, Zap } from 'lucide-react'

interface Fyp {
  id: string
  title: string
  fypId: string
  description: string
  members: number
  technology?: string
  category?: string
  imageUrl?: string
}

const IndustryFypPage: React.FC = () => {
  /* ──────────────────────────────
     state, router, side‑effects
  ────────────────────────────── */
  const [fyps, setFyps] = useState<Fyp[]>([])
  const [filteredFyps, setFilteredFyps] = useState<Fyp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [facultyName, setFacultyName] = useState<string>("")
  const router = useRouter()

  // Technology categories
  const categories = [
    { name: "all", label: "All Categories", icon: <Layers className="w-4 h-4" /> },
    { name: "web", label: "Web Development", icon: <Globe className="w-4 h-4" /> },
    { name: "ai", label: "AI & ML", icon: <Cpu className="w-4 h-4" /> },
    { name: "mobile", label: "Mobile Apps", icon: <Zap className="w-4 h-4" /> },
    { name: "data", label: "Data Science", icon: <Database className="w-4 h-4" /> },
    { name: "security", label: "Cybersecurity", icon: <Shield className="w-4 h-4" /> },
    { name: "cloud", label: "Cloud Computing", icon: <Server className="w-4 h-4" /> },
  ]

  // Project images based on category
  const projectImages = {
    web: "/placeholder.svg?key=935ub",
    ai: "/placeholder.svg?key=eajjh",
    mobile: "/placeholder.svg?key=0zxxr",
    data: "/placeholder.svg?key=rc55a",
    security: "/placeholder.svg?key=2twiw",
    cloud: "/placeholder.svg?key=ve5ts",
    default: "/placeholder.svg?key=k85yk",
  }

  // Assign category based on project title or description
  const assignCategory = (fyp: Fyp): string => {
    const text = `${fyp.title} ${fyp.description || ""}`.toLowerCase()
    
    if (text.includes("web") || text.includes("frontend") || text.includes("backend") || text.includes("html")) {
      return "web"
    } else if (
      text.includes("ai") ||
      text.includes("machine learning") ||
      text.includes("neural") ||
      text.includes("deep learning")
    ) {
      return "ai"
    } else if (text.includes("mobile") || text.includes("android") || text.includes("ios") || text.includes("app")) {
      return "mobile"
    } else if (text.includes("data") || text.includes("analytics") || text.includes("visualization")) {
      return "data"
    } else if (text.includes("security") || text.includes("cyber") || text.includes("encryption")) {
      return "security"
    } else if (text.includes("cloud") || text.includes("aws") || text.includes("azure")) {
      return "cloud"
    }

    // Default to a random category if no keywords match
    const categoryNames = ["web", "ai", "mobile", "data", "security", "cloud"]
    return categoryNames[Math.floor(Math.random() * categoryNames.length)]
  }

  // Get image based on category
  const getImageForCategory = (category: string): string => {
    return projectImages[category as keyof typeof projectImages] || projectImages.default
  }

  useEffect(() => {
    const fetchFacultyFypData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        /* 1️⃣  authorized‑user info (gets userId) */
        const authRes = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!authRes.ok) throw new Error("Failed to fetch user info.")
        const { userId } = await authRes.json()

        /* 2️⃣  faculty details (gets facultyId) */
        const facRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!facRes.ok) throw new Error("Failed to fetch faculty info.")
        const facultyData = await facRes.json()
        const { id: facultyId, firstName, lastName } = facultyData
        setFacultyName(`${firstName} ${lastName}`)

        /* 3️⃣  FYPs for that faculty */
        const fypRes = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-fyp-by-faculty-id/${facultyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!fypRes.ok) throw new Error("Failed to fetch FYPs.")
        const data = await fypRes.json()

        // Enhance FYP data with categories and images
        const enhancedFyps = data.map((fyp: Fyp) => {
          const category = assignCategory(fyp)
          return {
            ...fyp,
            category,
            imageUrl: getImageForCategory(category),
            technology: fyp.technology || generateRandomTechnology(category),
          }
        })

        setFyps(enhancedFyps)
        setFilteredFyps(enhancedFyps)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "An unknown error occurred."
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchFacultyFypData()
  }, [router])

  // Generate random technology based on category
  const generateRandomTechnology = (category: string): string => {
    const technologies = {
      web: ["React", "Angular", "Vue.js", "Next.js", "Node.js", "Django", "Laravel"],
      ai: ["TensorFlow", "PyTorch", "Keras", "OpenAI", "Computer Vision", "NLP"],
      mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
      data: ["Python", "R", "Tableau", "Power BI", "Hadoop", "Spark"],
      security: ["Blockchain", "Encryption", "Penetration Testing", "Network Security"],
      cloud: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
    }

    const techList = technologies[category as keyof typeof technologies] || technologies.web
    return techList[Math.floor(Math.random() * techList.length)]
  }

  // Filter FYPs based on search and category
  useEffect(() => {
    const filtered = fyps.filter((fyp) => {
      const matchesSearch =
        fyp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fyp.description && fyp.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        fyp.fypId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || fyp.category === categoryFilter

      return matchesSearch && matchesCategory
    })

    setFilteredFyps(filtered)
  }, [searchTerm, categoryFilter, fyps])

  /* ──────────────────────────────
     helpers
  ────────────────────────────── */
  const handleFypClick = (fypId: string) => {
    router.push(`/faculty/finalyp/detail/${fypId}`)
  }

  /* ──────────────────────────────
     render
  ────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading Industry FYPs...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your project dashboard</p>
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
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-900 h-80 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute left-0 top-0 h-full w-full text-white/5"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
          >
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="0" y="0" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="120" y="0" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="240" y="0" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="360" y="0" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="0" y="120" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="120" y="120" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="240" y="120" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="360" y="120" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="0" y="240" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="120" y="240" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="240" y="240" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="360" y="240" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="0" y="360" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="120" y="360" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="240" y="360" width="100" height="100" />
            <rect fill="none" stroke="currentColor" strokeWidth="2" x="360" y="360" width="100" height="100" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900/90"></div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-2 flex items-center">
              <Briefcase className="mr-4 h-10 w-10" />
              Industry FYPs
            </h1>
            <p className="text-blue-100 text-xl max-w-2xl">
              Explore industry-sponsored final year projects for students
            </p>
            {facultyName && (
              <div className="mt-4 inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-50">
                <Award className="mr-2 h-5 w-5" />
                <span>Supervised by: {facultyName}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-5xl"
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-4 mx-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{fyps.length}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-purple-100 p-3 rounded-full mr-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {fyps.reduce((sum, fyp) => sum + (fyp.members || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Set(fyps.map((fyp) => fyp.category)).size}
                  </p>
                  <p className="text-sm text-gray-600">Technologies</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pt-20">
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
                placeholder="Search projects by title, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
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
        {(searchTerm || categoryFilter !== "all") && (
          <div className="flex items-center mb-6">
            {categoryFilter !== "all" && (
              <div className="flex items-center mr-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
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
        )}

        {/* FYP Grid */}
        {filteredFyps.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <img
              src="/placeholder.svg?key=lu839"
              alt="No projects found"
              className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? `No projects match your search "${searchTerm}". Try different keywords or filters.`
                : categoryFilter !== "all"
                ? `No projects found in the "${
                    categories.find((c) => c.name === categoryFilter)?.label
                  }" category.`
                : "No industry FYPs available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFyps.map((fyp, index) => (
              <motion.div
                key={fyp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleFypClick(fyp.id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={fyp.imageUrl || "/placeholder.svg"}
                    alt={fyp.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                      {fyp.category}
                    </span>
                  </div>

                  {/* Members Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {fyp.members || 3}
                    </span>
                  </div>

                  {/* FYP ID */}
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded">
                      ID: {fyp.fypId}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{fyp.title}</h3>

                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      {fyp.technology || "Technology"}
                    </span>
                  </div>

                  {/* Description */}
                  {fyp.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{fyp.description}</p>
                  )}

                  {/* View Details Button */}
                  <div className="flex justify-end">
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
                      View Details
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default IndustryFypPage

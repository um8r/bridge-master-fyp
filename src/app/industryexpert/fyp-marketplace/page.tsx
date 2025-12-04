"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Loader2, User, Users, Code, Calendar, DollarSign, Briefcase, Filter, Building, BookOpen, CheckCircle, Clock, Star, Award, Zap, ChevronRight, X, ExternalLink, Download, Share2 } from 'lucide-react'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Define interfaces for our data types
interface Faculty {
  id: string
  firstName: string
  lastName: string
  department: string
  universityName: string
}

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  facultyName?: string
  facultyId?: string
  universityName?: string
  department?: string
  technology?: string
  yearOfCompletion?: number
  batch?: string
  status?: string
  imageUrl?: string
  category?: string
}

export default function FYPMarketplacePage() {
  // State variables
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [allFyps, setAllFyps] = useState<FYP[]>([])
  const [buyFyps, setBuyFyps] = useState<FYP[]>([])
  const [sponsorFyps, setSponsorFyps] = useState<FYP[]>([])
  const [filteredBuyFyps, setFilteredBuyFyps] = useState<FYP[]>([])
  const [filteredSponsorFyps, setFilteredSponsorFyps] = useState<FYP[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all")
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"buy" | "sponsor">("buy")

  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [selectedFyp, setSelectedFyp] = useState<FYP | null>(null)
  const [agreementType, setAgreementType] = useState<"buy" | "sponsor" | null>(null)

  const router = useRouter()

  // Project categories and their images
  const projectCategories = {
    web: {
      name: "Web Development",
      image: "/placeholder.svg?key=qkp91",
    },
    mobile: {
      name: "Mobile App",
      image: "/placeholder.svg?key=z06nq",
    },
    ai: {
      name: "AI & Machine Learning",
      image: "/placeholder.svg?key=3fc8c",
    },
    data: {
      name: "Data Science",
      image: "/placeholder.svg?key=67cz6",
    },
    cloud: {
      name: "Cloud Computing",
      image: "/placeholder.svg?key=38ybu",
    },
    iot: {
      name: "IoT",
      image: "/placeholder.svg?key=vzdbb",
    },
    security: {
      name: "Cybersecurity",
      image: "/placeholder.svg?key=rihta",
    },
    blockchain: {
      name: "Blockchain",
      image: "/placeholder.svg?key=c2tdy",
    },
    default: {
      name: "Technology",
      image: "/placeholder.svg?key=gpxtn",
    },
  }

  // Assign category based on project title or description
  const assignCategory = (fyp: FYP): string => {
    const text = `${fyp.title} ${fyp.description || ""} ${fyp.technology || ""}`.toLowerCase()

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
    } else if (text.includes("iot") || text.includes("internet of things") || text.includes("sensor")) {
      return "iot"
    } else if (text.includes("blockchain") || text.includes("crypto") || text.includes("token")) {
      return "blockchain"
    }

    // Default to a random category if no keywords match
    const categoryNames = ["web", "ai", "mobile", "data", "security", "cloud", "iot", "blockchain"]
    return categoryNames[Math.floor(Math.random() * categoryNames.length)]
  }

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get industry expert details
        const expertResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!expertResponse.ok) throw new Error("Failed to fetch industry expert details")

        const expertData = await expertResponse.json()
        setIndustryExpertId(expertData.indExptId)

        // Step 3: Fetch all faculties
        const facultiesResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculties", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!facultiesResponse.ok) throw new Error("Failed to fetch faculties")

        const facultiesData = await facultiesResponse.json()
        setFaculties(facultiesData)

        // Step 4: Fetch FYPs for all faculties
        const collectedFyps: FYP[] = []

        for (const faculty of facultiesData) {
          try {
            const fypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-fyp-by-faculty-id/${faculty.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (fypResponse.ok) {
              const fypData = await fypResponse.json()
              // Enhance FYP data with faculty information
              const enhancedFyps = fypData.map((fyp: FYP) => {
                const category = assignCategory(fyp)
                return {
                  ...fyp,
                  facultyId: faculty.id,
                  facultyName: `${faculty.firstName} ${faculty.lastName}`,
                  universityName: faculty.universityName,
                  department: faculty.department,
                  yearOfCompletion:
                    fyp.yearOfCompletion || (fyp.batch ? Number.parseInt(fyp.batch) + 4 : new Date().getFullYear() + 4),
                  category,
                  imageUrl: projectCategories[category as keyof typeof projectCategories]?.image || projectCategories.default.image,
                }
              })
              collectedFyps.push(...enhancedFyps)
            }
          } catch (err) {
            console.error(`Failed to fetch FYPs for faculty ${faculty.id}:`, err)
          }
        }

        // Step 5: Also try the dedicated marketplace endpoints
        try {
          // Try to fetch "Buy" FYPs (completed projects)
          const buyFypsResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/for-marketplace/buy", {
            headers: { Authorization: `Bearer ${token}` },
          })

          // Try to fetch "Sponsor" FYPs (ongoing projects)
          const sponsorFypsResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/for-marketplace/sponsor", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (buyFypsResponse.ok) {
            const buyFypsData = await buyFypsResponse.json()
            // Add to collected FYPs, avoiding duplicates
            const existingIds = new Set(collectedFyps.map((fyp: FYP) => fyp.id))
            const newBuyFyps = buyFypsData
              .filter((fyp: FYP) => !existingIds.has(fyp.id))
              .map((fyp: FYP) => {
                const category = assignCategory(fyp)
                return {
                  ...fyp,
                  category,
                  imageUrl: projectCategories[category as keyof typeof projectCategories]?.image || projectCategories.default.image,
                }
              })
            collectedFyps.push(...newBuyFyps)
          }

          if (sponsorFypsResponse.ok) {
            const sponsorFypsData = await sponsorFypsResponse.json()
            // Add to collected FYPs, avoiding duplicates
            const existingIds = new Set(collectedFyps.map((fyp: FYP) => fyp.id))
            const newSponsorFyps = sponsorFypsData
              .filter((fyp: FYP) => !existingIds.has(fyp.id))
              .map((fyp: FYP) => {
                const category = assignCategory(fyp)
                return {
                  ...fyp,
                  category,
                  imageUrl: projectCategories[category as keyof typeof projectCategories]?.image || projectCategories.default.image,
                }
              })
            collectedFyps.push(...newSponsorFyps)
          }
        } catch (err) {
          console.error("Failed to fetch from marketplace endpoints:", err)
        }

        // Step 6: Process all collected FYPs
        setAllFyps(collectedFyps)

        // Separate into buy and sponsor categories
        const currentYear = new Date().getFullYear()
        const buyFypsData = collectedFyps.filter(
          (fyp: FYP) =>
            (fyp.yearOfCompletion !== undefined && fyp.yearOfCompletion <= currentYear) ||
            (fyp.status === "Approved" && (!fyp.yearOfCompletion || fyp.yearOfCompletion <= currentYear)),
        )

        const sponsorFypsData = collectedFyps.filter(
          (fyp: FYP) =>
            (fyp.yearOfCompletion !== undefined && fyp.yearOfCompletion > currentYear) ||
            (fyp.status === "Approved" && fyp.yearOfCompletion && fyp.yearOfCompletion > currentYear),
        )

        setBuyFyps(buyFypsData)
        setFilteredBuyFyps(buyFypsData)
        setSponsorFyps(sponsorFypsData)
        setFilteredSponsorFyps(sponsorFypsData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter FYPs based on selected faculty and search query
  useEffect(() => {
    let buyResults = buyFyps
    let sponsorResults = sponsorFyps

    // Filter by faculty
    if (selectedFaculty !== "all") {
      buyResults = buyResults.filter((fyp: FYP) => fyp.facultyId === selectedFaculty)
      sponsorResults = sponsorResults.filter((fyp: FYP) => fyp.facultyId === selectedFaculty)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()

      buyResults = buyResults.filter(
        (fyp: FYP) =>
          fyp.title.toLowerCase().includes(query) ||
          fyp.description.toLowerCase().includes(query) ||
          (fyp.facultyName && fyp.facultyName.toLowerCase().includes(query)) ||
          (fyp.universityName && fyp.universityName.toLowerCase().includes(query)) ||
          (fyp.technology && fyp.technology.toLowerCase().includes(query)) ||
          (fyp.department && fyp.department.toLowerCase().includes(query)),
      )

      sponsorResults = sponsorResults.filter(
        (fyp: FYP) =>
          fyp.title.toLowerCase().includes(query) ||
          fyp.description.toLowerCase().includes(query) ||
          (fyp.facultyName && fyp.facultyName.toLowerCase().includes(query)) ||
          (fyp.universityName && fyp.universityName.toLowerCase().includes(query)) ||
          (fyp.technology && fyp.technology.toLowerCase().includes(query)) ||
          (fyp.department && fyp.department.toLowerCase().includes(query)),
      )
    }

    setFilteredBuyFyps(buyResults)
    setFilteredSponsorFyps(sponsorResults)
  }, [selectedFaculty, searchQuery, buyFyps, sponsorFyps])

  // Handle FYP selection
  const handleFypClick = (fypId: string) => {
    router.push(`/industryexpert/fyp/${fypId}`)
  }

  // Handle requesting an FYP
  const handleRequestFyp = (event: React.MouseEvent, fyp: FYP, type: "buy" | "sponsor") => {
    event.stopPropagation()
    setSelectedFyp(fyp)
    setAgreementType(type)
    setShowAgreementModal(true)
  }

  const submitFypRequest = async () => {
    if (!industryExpertId || !selectedFyp) {
      toast.error("Missing required information")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/add/${selectedFyp.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(industryExpertId),
      })

      if (response.ok) {
        toast.success(
          "FYP request submitted successfully! The university admin will review your request and you'll be notified once it's approved or rejected.",
          { autoClose: 8000 },
        )
        setShowAgreementModal(false)
      } else {
        const errorData = await response.text()
        toast.error(`Failed to request FYP: ${errorData}`)
      }
    } catch (err) {
      toast.error("An error occurred while requesting the FYP")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-300/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <p className="text-xl text-blue-100 font-medium">Loading FYP Marketplace...</p>
          <p className="text-sm text-blue-300">Discovering innovative projects</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 max-w-md">
          <div className="bg-red-500/20 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-blue-100 mb-6">{error}</p>
          <button
            onClick={() => router.push("/industryexpert")}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/30 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg
            className="absolute left-0 top-0 h-full w-full text-white"
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
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">FYP Marketplace</h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Discover and invest in innovative student projects from top universities
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-blue-50 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                <span>{allFyps.length} Projects Available</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-blue-50 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>{filteredBuyFyps.length} Completed Projects</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-blue-50 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{filteredSponsorFyps.length} Ongoing Projects</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, faculty, technology..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Faculty Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="all">All Faculties</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.firstName} {faculty.lastName} - {faculty.department}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none transition-all ${
              activeTab === "buy"
                ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("buy")}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>Buy Completed Projects</span>
              <span
                className={`${
                  activeTab === "buy" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                } text-xs px-2 py-0.5 rounded-full`}
              >
                {filteredBuyFyps.length}
              </span>
            </div>
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none transition-all ${
              activeTab === "sponsor"
                ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("sponsor")}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span>Sponsor Ongoing Projects</span>
              <span
                className={`${
                  activeTab === "sponsor" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                } text-xs px-2 py-0.5 rounded-full`}
              >
                {filteredSponsorFyps.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* FYP Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {activeTab === "buy" && (
          <>
            {filteredBuyFyps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBuyFyps.map((fyp: FYP) => (
                  <motion.div
                    key={fyp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleFypClick(fyp.id)}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={fyp.imageUrl || "/placeholder.svg?height=200&width=400&query=technology+project"}
                        alt={fyp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      
                      {/* Completed Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {projectCategories[fyp.category as keyof typeof projectCategories]?.name || "Technology"}
                        </span>
                      </div>
                      
                      {/* FYP ID */}
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded">
                          ID: {fyp.fypId}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {fyp.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3">{fyp.description}</p>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{fyp.facultyName || "Unknown Faculty"}</span>
                        </div>

                        {fyp.universityName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4 text-blue-500" />
                            <span>{fyp.universityName}</span>
                          </div>
                        )}

                        {fyp.department && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span>{fyp.department}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                          {fyp.members && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {fyp.members} Members
                            </span>
                          )}

                          {fyp.technology && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center">
                              <Code className="h-3 w-3 mr-1" />
                              {fyp.technology}
                            </span>
                          )}

                          {fyp.yearOfCompletion && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {fyp.yearOfCompletion}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleRequestFyp(e, fyp, "buy")}
                        className="w-full mt-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg shadow-green-600/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>Buy Project</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md">
                  <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No completed projects found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedFaculty !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no completed projects available for purchase at the moment"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedFaculty("all")
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {activeTab === "sponsor" && (
          <>
            {filteredSponsorFyps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSponsorFyps.map((fyp: FYP) => (
                  <motion.div
                    key={fyp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleFypClick(fyp.id)}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={fyp.imageUrl || "/placeholder.svg?height=200&width=400&query=technology+project"}
                        alt={fyp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                      
                      {/* In Progress Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {projectCategories[fyp.category as keyof typeof projectCategories]?.name || "Technology"}
                        </span>
                      </div>
                      
                      {/* FYP ID */}
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded">
                          ID: {fyp.fypId}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {fyp.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3">{fyp.description}</p>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{fyp.facultyName || "Unknown Faculty"}</span>
                        </div>

                        {fyp.universityName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4 text-blue-500" />
                            <span>{fyp.universityName}</span>
                          </div>
                        )}

                        {fyp.department && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span>{fyp.department}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">
                          {fyp.members && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {fyp.members} Members
                            </span>
                          )}

                          {fyp.technology && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center">
                              <Code className="h-3 w-3 mr-1" />
                              {fyp.technology}
                            </span>
                          )}

                          {fyp.yearOfCompletion && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expected: {fyp.yearOfCompletion}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleRequestFyp(e, fyp, "sponsor")}
                        className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span>Sponsor Project</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md">
                  <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No ongoing projects found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedFaculty !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no ongoing projects available for sponsorship at the moment"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedFaculty("all")
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Agreement Modal */}
      {showAgreementModal && selectedFyp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl max-w-2xl w-full border border-gray-200 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {agreementType === "buy" ? "Purchase Agreement" : "Sponsorship Agreement"}
                </h2>
                <button
                  onClick={() => setShowAgreementModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-80 overflow-y-auto border border-gray-200">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <img
                    src={selectedFyp.imageUrl || "/placeholder.svg?height=60&width=60&query=project"}
                    alt={selectedFyp.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedFyp.title}</h3>
                    <p className="text-sm text-gray-500">ID: {selectedFyp.fypId}</p>
                  </div>
                </div>

                {agreementType === "buy" ? (
                  <div className="text-gray-700 space-y-3 text-sm">
                    <p>By proceeding with this purchase request, I agree to the following terms:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        I acknowledge that I am requesting to purchase the intellectual property rights to this Final
                        Year Project.
                      </li>
                      <li>
                        I agree to respect the copyright of the original creators and will provide appropriate
                        attribution when using this project.
                      </li>
                      <li>
                        I understand that I will not publicly share or distribute the source code or proprietary
                        elements of this project without proper authorization.
                      </li>
                      <li>
                        I agree to use this project in accordance with the universitys intellectual property policies.
                      </li>
                      <li>
                        I understand that the final terms of purchase will be determined upon approval by the university
                        administration.
                      </li>
                      <li>I acknowledge that this request may be rejected at the university ke discretion.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="text-gray-700 space-y-3 text-sm">
                    <p>By proceeding with this sponsorship request, I agree to the following terms:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>I acknowledge that I am requesting to sponsor this ongoing Final Year Project.</li>
                      <li>
                        I agree to maintain the confidentiality of any proprietary information shared during the
                        collaboration.
                      </li>
                      <li>
                        I will not disclose any sensitive details about the project to unauthorized third parties.
                      </li>
                      <li>
                        I understand that the intellectual property rights will be shared as specified in the final
                        agreement upon approval.
                      </li>
                      <li>
                        I agree to provide reasonable support and resources to the student team as needed for the
                        projects success.
                      </li>
                      <li>I acknowledge that this request may be rejected at the universitys discretion.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowAgreementModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFypRequest}
                  className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center ${
                    agreementType === "buy"
                      ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/20"
                      : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                  }`}
                >
                  {agreementType === "buy" ? (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>I Agree & Submit Purchase Request</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>I Agree & Submit Sponsorship Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
    </div>
  )
}


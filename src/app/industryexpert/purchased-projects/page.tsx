"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Loader2, FileText, Download, ExternalLink, Calendar, DollarSign, User, BookOpen, Search, Filter, X } from 'lucide-react'

interface BoughtFYP {
  id: string
  fypId: string
  fypTitle: string
  indExpertId: string
  indExpertName: string
  price: number
  purchaseDate?: string
}

interface DetailedFYP {
  id: string
  title: string
  description: string
  members: number
  technology?: string
  yearOfCompletion?: number
  faculty?: {
    name: string
    department?: string
  }
  students?: {
    name: string
    department?: string
  }[]
}

export default function PurchasedProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [boughtFyps, setBoughtFyps] = useState<BoughtFYP[]>([])
  const [detailedFyps, setDetailedFyps] = useState<Record<string, DetailedFYP>>({})
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTechnology, setFilterTechnology] = useState("")
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "price" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    const fetchPurchasedProjects = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info to get the industry expert ID
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

        // Step 3: Fetch all bought FYPs
        const boughtFypsResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!boughtFypsResponse.ok) {
          if (boughtFypsResponse.status === 404) {
            // No bought FYPs found, which is not an error
            setBoughtFyps([])
            setLoading(false)
            return
          }
          throw new Error("Failed to fetch purchased projects")
        }

        const boughtFypIds = await boughtFypsResponse.json()
        
        // Step 4: Fetch details for each bought FYP
        const boughtFypsDetails: BoughtFYP[] = []
        const detailedFypsMap: Record<string, DetailedFYP> = {}
        
        for (const id of boughtFypIds) {
          // Get bought FYP details
          const boughtFypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/by-id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (boughtFypResponse.ok) {
            const boughtFypData = await boughtFypResponse.json()
            
            // Only include FYPs purchased by the current industry expert
            if (boughtFypData.indExpertId === expertData.indExptId) {
              boughtFypsDetails.push(boughtFypData)
              
              // Get detailed FYP info
              const fypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${boughtFypData.fypId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              
              if (fypResponse.ok) {
                const fypData = await fypResponse.json()
                detailedFypsMap[boughtFypData.fypId] = fypData
              }
            }
          }
        }
        
        setBoughtFyps(boughtFypsDetails)
        setDetailedFyps(detailedFypsMap)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchasedProjects()
  }, [router])

  // Filter and sort the bought FYPs
  const filteredAndSortedFyps = boughtFyps
    .filter(fyp => {
      const detailedFyp = detailedFyps[fyp.fypId]
      
      // Search term filter
      const matchesSearch = 
        fyp.fypTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (detailedFyp?.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Technology filter
      const matchesTechnology = !filterTechnology || 
        detailedFyp?.technology?.toLowerCase().includes(filterTechnology.toLowerCase())
      
      // Year filter
      const matchesYear = !filterYear || detailedFyp?.yearOfCompletion === filterYear
      
      return matchesSearch && matchesTechnology && matchesYear
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0
        const dateB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      } else { // title
        return sortOrder === "asc" 
          ? a.fypTitle.localeCompare(b.fypTitle)
          : b.fypTitle.localeCompare(a.fypTitle)
      }
    })

  // Get unique technologies and years for filters
  const technologies = Array.from(
    new Set(
      Object.values(detailedFyps)
        .map(fyp => fyp.technology)
        .filter(Boolean) as string[]
    )
  )
  
  const years = Array.from(
    new Set(
      Object.values(detailedFyps)
        .map(fyp => fyp.yearOfCompletion)
        .filter(Boolean) as number[]
    )
  ).sort((a, b) => b - a) // Sort years in descending order

  const handleDownloadAgreement = async (boughtFypId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth/login-user")
      return
    }

    try {
      // This endpoint would need to be implemented to return the agreement document
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/get-agreement/${boughtFypId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to download agreement")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `purchase-agreement-${boughtFypId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while downloading the agreement"
      toast.error(errorMessage)
    }
  }

  const handleViewProject = (fypId: string) => {
    router.push(`/industryexpert/purchased-projects/${fypId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-xl text-gray-700">Loading your purchased projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/industryexpert")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">My Purchased Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage and access all the Final Year Projects you have purchased
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [
                    "date" | "price" | "title",
                    "asc" | "desc"
                  ]
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
              </select>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Technology
                </label>
                <select
                  value={filterTechnology}
                  onChange={(e) => setFilterTechnology(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Technologies</option>
                  {technologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Year
                </label>
                <select
                  value={filterYear || ""}
                  onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              {(filterTechnology || filterYear) && (
                <div className="md:col-span-2 flex justify-end">
                  <button
                    onClick={() => {
                      setFilterTechnology("")
                      setFilterYear(null)
                    }}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredAndSortedFyps.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Purchased Projects</h2>
            <p className="text-gray-600 mb-6">
              You havenot purchased any Final Year Projects yet.
            </p>
            <button
              onClick={() => router.push("/industryexpert/fyp-marketplace")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedFyps.map((boughtFyp) => {
              const detailedFyp = detailedFyps[boughtFyp.fypId]
              return (
                <div
                  key={boughtFyp.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {boughtFyp.fypTitle}
                    </h2>
                    
                    {detailedFyp && (
                      <div className="mb-4">
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {detailedFyp.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {detailedFyp.technology && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{detailedFyp.technology}</span>
                            </div>
                          )}
                          
                          {detailedFyp.yearOfCompletion && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{detailedFyp.yearOfCompletion}</span>
                            </div>
                          )}
                          
                          {detailedFyp.members && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{detailedFyp.members} Members</span>
                            </div>
                          )}
                          
                          {boughtFyp.price && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{boughtFyp.price.toLocaleString()} PKR</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewProject(boughtFyp.fypId)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Project
                      </button>
                      
                      <button
                        onClick={() => handleDownloadAgreement(boughtFyp.id)}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Agreement
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
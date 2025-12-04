// File: /app/industryexpert/purchased-projects/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Loader2, ArrowLeft, Download, FileText, User, Users, Calendar, BookOpen, Mail, Phone, DollarSign, ExternalLink, Code, Database, Layers, CheckCircle, Github, LinkIcon, FileDown, MessageSquare } from 'lucide-react'

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
  fypId: string
  members: number
  technology?: string
  yearOfCompletion?: number
  batch?: string
  status?: string
  faculty?: {
    id: string
    name: string
    department?: string
    interest?: string
    post?: string
  }
  students?: {
    id: string
    name: string
    department?: string
    rollNumber?: string
    cvLink?: string
    skills?: string
  }[]
}

interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export default function PurchasedProjectDetailPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [boughtFyp, setBoughtFyp] = useState<BoughtFYP | null>(null)
  const [detailedFyp, setDetailedFyp] = useState<DetailedFYP | null>(null)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "files" | "team" | "contact">("overview")
  const [deploymentLink, setDeploymentLink] = useState<string | null>(null)
  const [githubLink, setGithubLink] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const fypId = params.id as string

  useEffect(() => {
    const fetchProjectDetails = async () => {
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
        const indExpertId = expertData.indExptId

        // Step 3: Fetch the bought FYP record
        const boughtFypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/by-id/${fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!boughtFypResponse.ok) {
          // Try to find by FYP ID instead
          const allBoughtFypsResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/get-all", {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (!allBoughtFypsResponse.ok) {
            throw new Error("Failed to fetch purchased project")
          }
          
          const boughtFypIds = await allBoughtFypsResponse.json()
          
          // Check each bought FYP to find one matching this FYP ID and expert
          let foundBoughtFyp = null
          for (const id of boughtFypIds) {
            const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/by-id/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.fypId === fypId && data.indExpertId === indExpertId) {
                foundBoughtFyp = data
                break
              }
            }
          }
          
          if (!foundBoughtFyp) {
            throw new Error("You don't have access to this project")
          }
          
          setBoughtFyp(foundBoughtFyp)
        } else {
          const boughtFypData = await boughtFypResponse.json()
          
          // Verify this bought FYP belongs to the current industry expert
          if (boughtFypData.indExpertId !== indExpertId) {
            throw new Error("You don't have access to this project")
          }
          
          setBoughtFyp(boughtFypData)
        }

        // Step 4: Fetch detailed FYP info
        const fypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (!fypResponse.ok) {
          throw new Error("Failed to fetch project details")
        }
        
        const fypData = await fypResponse.json()
        setDetailedFyp(fypData)
        
        // Step 5: Fetch project files (if you have an API for this)
        // This is a placeholder - you would need to implement this API
        try {
          const filesResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-files/get-by-fyp/${fypId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (filesResponse.ok) {
            const filesData = await filesResponse.json()
            setProjectFiles(filesData)
          }
        } catch (fileErr) {
          console.error("Error fetching project files:", fileErr)
          // Don't throw error here, just continue without files
        }
        
        // Step 6: Fetch project links (if available)
        // These are placeholders - you would need to implement these APIs
        try {
          const linksResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-links/get-by-fyp/${fypId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (linksResponse.ok) {
            const linksData = await linksResponse.json()
            if (linksData.deploymentUrl) setDeploymentLink(linksData.deploymentUrl)
            if (linksData.githubUrl) setGithubLink(linksData.githubUrl)
          }
        } catch (linkErr) {
          console.error("Error fetching project links:", linkErr)
          // Don't throw error here, just continue without links
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [fypId, router])

  const handleDownloadAgreement = async () => {
    if (!boughtFyp) return
    
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth/login-user")
      return
    }

    try {
      // This endpoint would need to be implemented to return the agreement document
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/bought-fyp/get-agreement/${boughtFyp.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to download agreement")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `purchase-agreement-${boughtFyp.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while downloading the agreement"
      toast.error(errorMessage)
    }
  }

  const handleDownloadFile = async (file: ProjectFile) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(file.url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while downloading the file"
      toast.error(errorMessage)
    }
  }

  const handleContactStudent = (studentId: string) => {
    // Navigate to a chat or contact page with this student
    router.push(`/industryexpert/contact-student/${studentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-xl text-gray-700">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !detailedFyp || !boughtFyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || "Failed to load project details"}</p>
          <button
            onClick={() => router.push("/industryexpert/purchased-projects")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
          >
            Return to Purchased Projects
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
          <button
            onClick={() => router.push("/industryexpert/purchased-projects")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Purchased Projects
          </button>

          <h1 className="text-3xl font-bold text-gray-800">{detailedFyp.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {detailedFyp.fypId}
            </span>
            {detailedFyp.technology && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {detailedFyp.technology}
              </span>
            )}
            {detailedFyp.yearOfCompletion && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {detailedFyp.yearOfCompletion}
              </span>
            )}
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {detailedFyp.members} Members
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("files")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "files"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Files
                  </button>
                  <button
                    onClick={() => setActiveTab("team")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "team"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Team
                  </button>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === "contact"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Contact
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Project Overview</h2>
                    <p className="text-gray-700 mb-6 whitespace-pre-line">{detailedFyp.description}</p>

                    {/* Project Details */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Year of Completion</p>
                            <p className="font-medium text-gray-800">{detailedFyp.yearOfCompletion || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Technology</p>
                            <p className="font-medium text-gray-800">{detailedFyp.technology || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Team Size</p>
                            <p className="font-medium text-gray-800">{detailedFyp.members} Members</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Purchase Price</p>
                            <p className="font-medium text-gray-800">{boughtFyp.price.toLocaleString()} PKR</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
                          <Code className="h-8 w-8 text-blue-500 mb-2" />
                          <h4 className="font-medium text-gray-800">Frontend</h4>
                          <p className="text-sm text-gray-600 text-center mt-1">
                            {detailedFyp.technology?.includes("React") ? "React.js" : 
                             detailedFyp.technology?.includes("Angular") ? "Angular" :
                             detailedFyp.technology?.includes("Vue") ? "Vue.js" :
                             detailedFyp.technology?.includes("Web") ? "HTML/CSS/JS" : "Not specified"}
                          </p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
                          <Database className="h-8 w-8 text-blue-500 mb-2" />
                          <h4 className="font-medium text-gray-800">Backend</h4>
                          <p className="text-sm text-gray-600 text-center mt-1">
                            {detailedFyp.technology?.includes("Node") ? "Node.js" : 
                             detailedFyp.technology?.includes("Django") ? "Django" :
                             detailedFyp.technology?.includes("Laravel") ? "Laravel" :
                             detailedFyp.technology?.includes("Spring") ? "Spring Boot" : "Not specified"}
                          </p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
                          <Layers className="h-8 w-8 text-blue-500 mb-2" />
                          <h4 className="font-medium text-gray-800">Database</h4>
                          <p className="text-sm text-gray-600 text-center mt-1">
                            {detailedFyp.technology?.includes("SQL") ? "SQL Database" : 
                             detailedFyp.technology?.includes("Mongo") ? "MongoDB" :
                             detailedFyp.technology?.includes("Firebase") ? "Firebase" : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Project Links */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deploymentLink ? (
                          <a
                            href={deploymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <LinkIcon className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-800">Live Demo</p>
                              <p className="text-sm text-blue-600 truncate">{deploymentLink}</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 opacity-50">
                            <LinkIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-800">Live Demo</p>
                              <p className="text-sm text-gray-500">Not available</p>
                            </div>
                          </div>
                        )}

                        {githubLink ? (
                          <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <Github className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-800">GitHub Repository</p>
                              <p className="text-sm text-blue-600 truncate">{githubLink}</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 opacity-50">
                            <Github className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-800">GitHub Repository</p>
                              <p className="text-sm text-gray-500">Not available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Files Tab */}
                {activeTab === "files" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Project Files</h2>
                    
                    {projectFiles.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">No project files available yet.</p>
                        <p className="text-sm text-gray-500">
                          Project files may be added by the administrator after purchase verification.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Group files by type */}
                        {[
                          { type: "document", label: "Documentation", icon: FileText },
                          { type: "source", label: "Source Code", icon: Code },
                          { type: "database", label: "Database Files", icon: Database },
                          { type: "other", label: "Other Files", icon: FileDown },
                        ].map((group) => {
                          const groupFiles = projectFiles.filter(file => 
                            file.type.toLowerCase().includes(group.type.toLowerCase())
                          )
                          
                          if (groupFiles.length === 0) return null
                          
                          return (
                            <div key={group.type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <group.icon className="h-5 w-5 text-blue-500" />
                                {group.label}
                              </h3>
                              <div className="space-y-2">
                                {groupFiles.map((file) => (
                                  <div 
                                    key={file.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="h-5 w-5 text-blue-500" />
                                      <div>
                                        <p className="font-medium text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                          {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDownloadFile(file)}
                                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                                    >
                                      <Download className="h-4 w-4 text-gray-700" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                        
                        {/* Download All Button */}
                        <button
                          onClick={() => toast.info("Preparing download of all files...")}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 mt-4"
                        >
                          <Download className="h-5 w-5" />
                          Download All Files
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Tab */}
                {activeTab === "team" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Project Team</h2>
                    
                    {/* Faculty Supervisor */}
                    {detailedFyp.faculty && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Faculty Supervisor</h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3 mb-3 md:mb-0">
                              <div className="bg-blue-100 text-blue-800 rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl">
                                {detailedFyp.faculty.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{detailedFyp.faculty.name}</p>
                                <p className="text-sm text-gray-600">
                                  {detailedFyp.faculty.post || "Faculty Member"}, {detailedFyp.faculty.department || "Department"}
                                </p>
                              </div>
                            </div>
                            {detailedFyp.faculty.interest && (
                              <div className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                                {detailedFyp.faculty.interest}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Student Team */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Student Team</h3>
                      
                      {detailedFyp.students && detailedFyp.students.length > 0 ? (
                        <div className="space-y-4">
                          {detailedFyp.students.map((student) => (
                            <div key={student.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3 mb-3 md:mb-0">
                                  <div className="bg-green-100 text-green-800 rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl">
                                    {student.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                      {student.department && <span>{student.department}</span>}
                                      {student.rollNumber && (
                                        <>
                                          <span className="text-gray-300">|</span>
                                          <span>{student.rollNumber}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {student.cvLink && (
                                    <a
                                      href={student.cvLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 text-sm flex items-center gap-1"
                                    >
                                      <FileText className="h-3 w-3" />
                                      CV
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleContactStudent(student.id)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm flex items-center gap-1"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    Contact
                                  </button>
                                </div>
                              </div>
                              
                              {student.skills && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-sm text-gray-600 mb-2">Skills:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {student.skills.split(',').map((skill, index) => (
                                      <span 
                                        key={index}
                                        className="px-2 py-1 bg-white text-xs text-gray-700 rounded-full border border-gray-200"
                                      >
                                        {skill.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No student information available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                      <p className="text-gray-700 mb-4">
                        If you have any questions about this project or need technical support, you can contact the student team or faculty supervisor.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            Contact Student Team
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Reach out to the student team for technical questions about the project.
                          </p>
                          <button
                            onClick={() => router.push("/industryexpert/contact-team/" + fypId)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message Team
                          </button>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Contact Faculty Supervisor
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Contact the faculty supervisor for questions about the project academic aspects.
                          </p>
                          <button
                            onClick={() => router.push("/industryexpert/contact-faculty/" + (detailedFyp.faculty?.id || ""))}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message Faculty
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
                      <p className="text-gray-700 mb-4">
                        For any issues related to your purchase, payment, or platform support, please contact our support team.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email Support</p>
                            <p className="font-medium text-gray-800">support@bridgeit.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Phone className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Support</p>
                            <p className="font-medium text-gray-800">+92 300 1234567</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Info */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Information</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Purchase Date</span>
                    <span className="font-medium text-gray-800">
                      {boughtFyp.purchaseDate 
                        ? new Date(boughtFyp.purchaseDate).toLocaleDateString() 
                        : "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium text-gray-800">{boughtFyp.price.toLocaleString()} PKR</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Purchased
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-gray-800 text-sm">{boughtFyp.id.substring(0, 8)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleDownloadAgreement}
                  className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Agreement
                </button>
              </div>
            </div>
            
            {/* Project Stats */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Project Stats</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{detailedFyp.members}</p>
                    <p className="text-sm text-gray-600">Team Members</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{projectFiles.length}</p>
                    <p className="text-sm text-gray-600">Files</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{detailedFyp.yearOfCompletion || "N/A"}</p>
                    <p className="text-sm text-gray-600">Year</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {detailedFyp.faculty ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-600">Faculty Support</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  {deploymentLink && (
                    <a
                      href={deploymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live Demo
                    </a>
                  )}
                  
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      View Source Code
                    </a>
                  )}
                  
                  <button
                    onClick={() => setActiveTab("files")}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Download Files
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Team
                  </button>
                </div>
              </div>
            </div>
            
            {/* Verification Badge */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Verified Purchase</p>
                <p className="text-sm text-gray-600">
                  This project has been verified and is ready for use.
                </p>
              </div>
            </div>
          </div>
        </div>
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
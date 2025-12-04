"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader2, User, CheckCircle, XCircle, BookOpen } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface StudentDTO {
  id: string
  name: string
  department?: string
  rollNumber?: string
  cvLink?: string
  skills?: string
}

interface FacultyDTO {
  id: string
  name: string
  interest?: string
  department?: string
  post?: string
}

interface DetailedFYP {
  id: string
  title?: string
  members?: number
  batch?: string
  technology?: string
  description?: string
  status?: string
  faculty?: FacultyDTO
  students?: StudentDTO[]
  fypId?: string
}

export default function FYPDetailsPage() {
  const [fyp, setFyp] = useState<DetailedFYP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)
  const [requestStatus, setRequestStatus] = useState<string | null>(null)

  const router = useRouter()
  const params = useParams()
  const fypId = params.id as string

  useEffect(() => {
    const fetchFypDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Get user info
        const userResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

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

        // Step 3: Fetch detailed FYP information
        const fypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!fypResponse.ok) throw new Error("Failed to fetch FYP details")

        const fypData = await fypResponse.json()
        setFyp(fypData)

        // Step 4: Check if already requested
        // Note: This endpoint is hypothetical - you may need to adjust based on your actual API
        try {
          const requestResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/check-status?fypId=${fypId}&expertId=${expertData.indExptId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (requestResponse.ok) {
            const requestData = await requestResponse.json()
            setRequestStatus(requestData.status)
          }
        } catch (err) {
          console.error("Failed to check request status:", err)
          // Continue without setting request status
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchFypDetails()
  }, [fypId, router])

  const handleRequestFyp = async () => {
    if (!industryExpertId) {
      toast.error("Industry expert ID not found")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/add/${fypId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(industryExpertId),
        },
      )

      if (response.ok) {
        toast.success(
          "FYP request submitted successfully! The university admin will review your request and you'll be notified once it's approved or rejected.",
          { autoClose: 8000 },
        )
        setRequestStatus("pending")
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading FYP Details...</p>
        </div>
      </div>
    )
  }

  if (error || !fyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error || "FYP not found"}</p>
          <button
            onClick={() => router.push("/industryexpert/fyp-marketplace")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/industryexpert/fyp-marketplace")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{fyp.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                {fyp.fypId && (
                  <div className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md">{fyp.fypId}</div>
                )}
                {requestStatus === "approved" && (
                  <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                  </div>
                )}
                {requestStatus === "rejected" && (
                  <div className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-md flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Rejected
                  </div>
                )}
                {requestStatus === "pending" && (
                  <div className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-md flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Pending
                  </div>
                )}
                {fyp.status && (
                  <div className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-md">Status: {fyp.status}</div>
                )}
              </div>
            </div>

            {!requestStatus && (
              <button
                onClick={handleRequestFyp}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                Request Project
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Description</h2>
              <p className="text-gray-300 whitespace-pre-line">{fyp.description}</p>
            </div>

            {/* Technologies */}
            {fyp.technology && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {fyp.technology.split(",").map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Students */}
            {fyp.students && fyp.students.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                <div className="space-y-6">
                  {fyp.students.map((student) => (
                    <div key={student.id} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{student.name}</h3>
                        {student.department && <p className="text-gray-400 text-sm">{student.department}</p>}
                        {student.rollNumber && (
                          <p className="text-gray-400 text-sm">Roll Number: {student.rollNumber}</p>
                        )}
                        {student.skills && (
                          <div className="mt-2">
                            <p className="text-gray-400 text-xs mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {student.skills.split(",").map((skill, index) => (
                                <span key={index} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {student.cvLink && (
                          <a
                            href={student.cvLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-purple-400 hover:text-purple-300 text-sm"
                          >
                            View CV
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>

              <div className="space-y-4">
                {fyp.members && (
                  <div>
                    <p className="text-gray-400 text-sm">Team Size</p>
                    <p className="text-gray-200">{fyp.members} members</p>
                  </div>
                )}

                {fyp.batch && (
                  <div>
                    <p className="text-gray-400 text-sm">Batch</p>
                    <p className="text-gray-200">{fyp.batch}</p>
                  </div>
                )}

                {fyp.status && (
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-gray-200">{fyp.status}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Faculty Information */}
            {fyp.faculty && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Faculty Supervisor</h2>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>

                  <div>
                    <h3 className="font-medium text-white">{fyp.faculty.name}</h3>
                    {fyp.faculty.post && <p className="text-gray-400 text-sm">{fyp.faculty.post}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  {fyp.faculty.department && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{fyp.faculty.department}</span>
                    </div>
                  )}

                  {fyp.faculty.interest && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Research Interests:</p>
                      <p className="text-gray-300 text-sm">{fyp.faculty.interest}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

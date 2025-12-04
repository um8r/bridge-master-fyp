
// buy thre proejcts industry expertt




"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUser, FaBook, FaUsers } from "react-icons/fa"

interface FypRequest {
  id: string
  status: number | null
  studentIds: string[]
  fypId: string
  industryExpertId: string
  industryExpertName: string
  fypTitle: string
  fypDescription: string
  fyp_fypId: string
}

const FypRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<FypRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingRequests, setProcessingRequests] = useState<Record<string, boolean>>({})
  const [uniId, setUniId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    const fetchRequests = async () => {
      try {
        // Step 1: Get user info
        const userResponse = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get university admin details
        const adminResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-uni-admins/admins-by-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!adminResponse.ok) throw new Error("Failed to fetch University Admin profile")

        const adminData = await adminResponse.json()
        const universityId = adminData.uniId
        setUniId(universityId)

        // Step 3: Fetch pending FYP requests for this university
        const requestsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/pending-for-admin/${universityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()
          setRequests(requestsData)
        } else if (requestsResponse.status === 404) {
          // No pending requests found
          setRequests([])
        } else {
          throw new Error("Failed to fetch pending requests")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(`Error: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [router])

  const handleApprove = async (requestId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/approve/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        toast.success(
          "Request approved successfully! Notifications have been sent to the industry expert and students.",
        )
        // Remove the approved request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId))
      } else {
        throw new Error("Failed to approve request")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const handleReject = async (requestId: string) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/reject/${requestId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        toast.success("Request rejected successfully! The industry expert has been notified.")
        // Remove the rejected request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId))
      } else {
        throw new Error("Failed to reject request")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const viewFypDetails = (fypId: string) => {
    router.push(`/uniadmin/fyp-details/${fypId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading FYP requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 text-white py-10 px-4 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          FYP Requests
        </h1>
        <p className="text-gray-500 mb-8">
          Review and manage requests from industry experts to collaborate on Final Year Projects
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-300">
            <p>{error}</p>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-gray-100 rounded-lg shadow-lg p-8 text-center">
            <FaBook className="text-5xl mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-500 mb-2">No Pending Requests</h2>
            <p className="text-gray-500">
              There are currently no pending FYP requests from industry experts that require your approval.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{request.fypTitle}</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                          ID: {request.fyp_fypId}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingRequests[request.id]}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingRequests[request.id] ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processingRequests[request.id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {processingRequests[request.id] ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <FaUser className="text-blue-400 text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-300">Industry Expert</h3>
                        <p className="text-gray-400">{request.industryExpertName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FaUsers className="text-green-400 text-xl mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-300">Student Team</h3>
                        <p className="text-gray-400">
                          {request.studentIds.length} student{request.studentIds.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-300 mb-2">Project Description</h3>
                    <p className="text-gray-400 line-clamp-3">{request.fypDescription}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => viewFypDetails(request.fypId)}
                      className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <span>View Full Project Details</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  )
}

export default FypRequestsPage

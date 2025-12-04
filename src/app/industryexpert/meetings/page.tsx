"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle, Clock, Filter, Loader2, Search, Video, X } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Meeting {
  id: string
  fypId: string
  fypTitle: string
  chosenSlot: string
  meetLink?: string
  isMeetDone: boolean
  status?: string
}

export default function IndustryExpertMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "completed">("all")

  const router = useRouter()

  useEffect(() => {
    const fetchMeetings = async () => {
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
        const industryExpertId = expertData.indExptId

        // Step 3: Fetch meetings for this industry expert
        const meetingsResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/by-id/${industryExpertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!meetingsResponse.ok) {
          if (meetingsResponse.status === 404) {
            // No meetings found, set empty array
            setMeetings([])
            setFilteredMeetings([])
            return
          }
          throw new Error("Failed to fetch meetings")
        }

        const data = await meetingsResponse.json()
        const meetingsData = Array.isArray(data) ? data : [data]
        setMeetings(meetingsData)
        setFilteredMeetings(meetingsData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [router])

  useEffect(() => {
    // Apply filters and search
    let result = [...meetings]

    // Apply status filter
    if (statusFilter === "upcoming") {
      result = result.filter((meeting) => !meeting.isMeetDone)
    } else if (statusFilter === "completed") {
      result = result.filter((meeting) => meeting.isMeetDone)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (meeting) => meeting.fypTitle.toLowerCase().includes(query) || meeting.chosenSlot.toLowerCase().includes(query),
      )
    }

    setFilteredMeetings(result)
  }, [meetings, statusFilter, searchQuery])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setSearchQuery("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading meetings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push("/industryexpert")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Dashboard
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
          <h1 className="text-3xl font-bold text-purple-400">My Meetings</h1>
          <p className="text-gray-400 mt-2">Manage and track all your scheduled meetings with student teams</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by project title or date..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative inline-block">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span>Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === "all" ? "bg-purple-900/30 text-purple-300" : "text-gray-200 hover:bg-gray-700"}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All Meetings
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === "upcoming" ? "bg-purple-900/30 text-purple-300" : "text-gray-200 hover:bg-gray-700"}`}
                    onClick={() => setStatusFilter("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === "completed" ? "bg-purple-900/30 text-purple-300" : "text-gray-200 hover:bg-gray-700"}`}
                    onClick={() => setStatusFilter("completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            {(statusFilter !== "all" || searchQuery) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Meetings List */}
        {filteredMeetings.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
            <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No meetings found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {meetings.length === 0
                ? "You don't have any scheduled meetings yet. Check your approved requests to schedule meetings with student teams."
                : "No meetings match your current filters. Try adjusting your search or filter criteria."}
            </p>
            {meetings.length === 0 && (
              <button
                onClick={() => router.push("/industryexpert/approved-requests")}
                className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
              >
                View Approved Requests
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => router.push(`/industryexpert/meetings/${meeting.id}`)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-lg text-gray-200 line-clamp-2">{meeting.fypTitle}</h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.isMeetDone
                          ? meeting.status === "Successful"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-yellow-900/30 text-yellow-400"
                          : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {meeting.isMeetDone
                        ? meeting.status === "Successful"
                          ? "Successful"
                          : "Needs Improvement"
                        : "Upcoming"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatDate(meeting.chosenSlot)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    {meeting.meetLink ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">Meeting link available</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">Awaiting meeting link</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-700/30 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${meeting.isMeetDone ? "text-green-400" : "text-gray-500"}`} />
                    <span className="text-sm text-gray-300">{meeting.isMeetDone ? "Completed" : "Pending"}</span>
                  </div>
                  <span className="text-sm text-purple-400">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
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

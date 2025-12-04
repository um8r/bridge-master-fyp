"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Calendar,
  Video,
  Loader2,
  CheckCircle,
  XCircle,
  LinkIcon,
  ExternalLink,
  FileText,
  ArrowLeft,
  Bell,
  Plus,
} from "lucide-react"

interface Meeting {
  id: string
  status?: string
  meetLink?: string
  feedback?: string
  isMeetDone: boolean
  chosenSlot: string
  fypId: string
  fypTitle: string
  indExpId: string
  indExpertName?: string
}

interface MeetingRequest {
  id: string
  fypId: string
  fypTitle: string
  indExpertId: string
  indExpertName?: string
  timeSlots: string[]
}

interface Student {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  fypId?: string
  // other properties
}

export default function StudentMeetingsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([])
  const [studentId, setStudentId] = useState<string | null>(null)
  const [fypId, setFypId] = useState<string | null>(null)

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
        const userResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!userResponse.ok) throw new Error("Failed to authenticate user")

        const userData = await userResponse.json()
        const userId = userData.userId

        // Step 2: Get student details
        const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!studentResponse.ok) throw new Error("Failed to fetch student details")

        const studentData: Student = await studentResponse.json()
        setStudentId(studentData.id)

        // Check if student has a FYP assigned
        if (!studentData.fypId) {
          setLoading(false)
          return // No FYP assigned, so no meetings to fetch
        }

        setFypId(studentData.fypId)

        // Step 3: Get detailed FYP information
        const detailedFypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${studentData.fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!detailedFypResponse.ok) {
          throw new Error("Failed to fetch detailed FYP information")
        }

        const detailedFypData = await detailedFypResponse.json()
        console.log("Detailed FYP data:", detailedFypData)

        // Step 4: Fetch meetings for this FYP
        const meetingsResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/by-id/${studentData.fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (meetingsResponse.ok) {
          const meetingsData = await meetingsResponse.json()
          console.log("Meetings data:", meetingsData)

          // Enhance meetings with industry expert names and FYP details
          const enhancedMeetings = await Promise.all(
            (Array.isArray(meetingsData) ? meetingsData : [meetingsData]).map(async (meeting: Meeting) => {
              try {
                const expertResponse = await fetch(
                  `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${meeting.indExpId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )

                if (expertResponse.ok) {
                  const expertData = await expertResponse.json()
                  return {
                    ...meeting,
                    indExpertName: `${expertData.firstName} ${expertData.lastName}`,
                    fypTitle: detailedFypData.title || meeting.fypTitle, // Use detailed FYP title if available
                  }
                }
                return meeting
              } catch (err) {
                console.error("Error fetching expert details:", err)
                return meeting
              }
            }),
          )

          setMeetings(enhancedMeetings)
        } else if (meetingsResponse.status !== 404) {
          throw new Error("Failed to fetch meetings")
        }

        // Step 5: Fetch meeting requests for this FYP
        const requestsResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/requests/${studentData.fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json()

          // Enhance requests with industry expert names and FYP details
          const enhancedRequests = await Promise.all(
            (Array.isArray(requestsData) ? requestsData : [requestsData]).map(async (request: MeetingRequest) => {
              try {
                const expertResponse = await fetch(
                  `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${request.indExpertId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )

                if (expertResponse.ok) {
                  const expertData = await expertResponse.json()
                  return {
                    ...request,
                    indExpertName: `${expertData.firstName} ${expertData.lastName}`,
                    fypTitle: detailedFypData.title || request.fypTitle, // Use detailed FYP title if available
                  }
                }
                return request
              } catch (err) {
                console.error("Error fetching expert details:", err)
                return request
              }
            }),
          )

          setMeetingRequests(enhancedRequests)
        } else if (requestsResponse.status !== 404) {
          throw new Error("Failed to fetch meeting requests")
        }
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

  const formatTimeSlot = (timeSlot: string) => {
    try {
      const date = new Date(timeSlot)
      return date.toLocaleString()
    } catch (e) {
      return timeSlot
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-xl text-gray-700">Loading your meetings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg border border-red-200 shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/student")}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!fypId) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.push("/student")}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-indigo-600">Your Meetings</h1>
            <p className="text-gray-600 mt-2">Manage meetings with industry experts</p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md max-w-md">
              <Calendar className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800">No FYP Assigned</h3>
              <p className="text-gray-600 mt-2">
                You donot have a Final Year Project assigned yet. Once you have a FYP, you ll be able to schedule
                meetings with industry experts.
              </p>
              <button
                onClick={() => router.push("/student/register-fyp")}
                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
              >
                Register a FYP
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/student")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-indigo-600">Your Meetings</h1>
          <p className="text-gray-600 mt-2">Manage meetings with industry experts</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Meeting Requests Section */}
        {meetingRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pending Meeting Requests</h2>
            </div>

            <div className="space-y-4">
              {meetingRequests.map((request) => (
                <div key={request.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{request.fypTitle}</h3>
                      {request.indExpertName && <p className="text-amber-700 text-sm">From: {request.indExpertName}</p>}
                    </div>

                    <button
                      onClick={() => router.push(`/student/meetings/select-time/${request.id}`)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      Select Time Slot
                    </button>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">
                    The industry expert has suggested {request.timeSlots.length} possible time slots for a meeting.
                    Please select one that works for you.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Meetings Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Meetings</h2>

          {meetings.length > 0 ? (
            <div className="space-y-6">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{meeting.fypTitle}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {meeting.isMeetDone ? (
                            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </div>
                          ) : meeting.meetLink ? (
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Ready
                            </div>
                          ) : (
                            <div className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-md flex items-center gap-1">
                              <LinkIcon className="h-3 w-3" />
                              Needs Link
                            </div>
                          )}
                        </div>
                      </div>

                      {meeting.indExpertName && (
                        <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">
                          <span className="text-gray-600">Industry Expert:</span>{" "}
                          <span className="text-gray-800 font-medium">{meeting.indExpertName}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100">
                        <Calendar className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="text-xs text-gray-600">Scheduled Time</p>
                          <p className="text-gray-800">{formatTimeSlot(meeting.chosenSlot)}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100">
                        <Video className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="text-xs text-gray-600">Meeting Link</p>
                          {meeting.meetLink ? (
                            <a
                              href={meeting.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            >
                              Join Meeting <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <p className="text-amber-600">Not added yet</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {meeting.isMeetDone && meeting.feedback && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-500" />
                          Feedback from Industry Expert
                        </h4>
                        <p className="text-gray-700">{meeting.feedback}</p>

                        {meeting.status && (
                          <div className="mt-3 flex items-center gap-2">
                            <p className="text-sm text-gray-600">Meeting Status:</p>
                            {meeting.status === "Successful" ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" /> Successful
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                <XCircle className="h-4 w-4" /> Needs Improvement
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {!meeting.meetLink && !meeting.isMeetDone && (
                      <div>
                        <button
                          onClick={() => router.push(`/student/meetings/add-link/${meeting.id}`)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add Meeting Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md max-w-md">
                <Calendar className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800">No meetings scheduled</h3>
                <p className="text-gray-600 mt-2">
                  You donot have any meetings scheduled with industry experts yet. Once an industry expert requests a
                  meeting and you select a time slot, it will appear here.
                </p>
                <button
                  onClick={() => router.push("/student")}
                  className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
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

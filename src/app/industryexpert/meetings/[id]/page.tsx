"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Calendar,
  CheckCircle,
  Users,
  Video,
  Loader2,
  ArrowLeft,
  MessageSquare,
  DollarSign,
  Briefcase,
  AlertCircle,
} from "lucide-react"

interface MeetingDetails {
  id: string
  status?: string
  meetLink?: string
  feedback?: string
  isMeetDone: boolean
  chosenSlot: string
  fypId: string
  fypTitle: string
  indExpId: string
}

interface FYP {
  id: string
  title: string
  description: string
  fypId: string
  members: number
  facultyName?: string
  technology?: string
  yearOfCompletion?: number
  students?: {
    id: string
    name: string
    email?: string
  }[]
}

export default function MeetingDetailsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meeting, setMeeting] = useState<MeetingDetails | null>(null)
  const [fyp, setFyp] = useState<FYP | null>(null)
  const [feedback, setFeedback] = useState("")
  const [meetingStatus, setMeetingStatus] = useState<"successful" | "needs-improvement" | "">("")
  const [submitting, setSubmitting] = useState(false)
  const [isSponsored, setIsSponsored] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  const router = useRouter()
  const params = useParams()
  const meetingId = params.id as string

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Step 1: Fetch meeting details
        const meetingResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/by-id/${meetingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!meetingResponse.ok) {
          throw new Error("Failed to fetch meeting details")
        }

        const meetingsData = await meetingResponse.json()
        const meetingDetails = Array.isArray(meetingsData) ? meetingsData[0] : meetingsData
        setMeeting(meetingDetails)

        if (meetingDetails.feedback) {
          setFeedback(meetingDetails.feedback)
        }

        if (meetingDetails.status) {
          setMeetingStatus(meetingDetails.status === "Successful" ? "successful" : "needs-improvement")
        }

        // Step 2: Fetch FYP details
        const fypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${meetingDetails.fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!fypResponse.ok) {
          throw new Error("Failed to fetch FYP details")
        }

        const fypData = await fypResponse.json()
        setFyp(fypData)

        // Step 3: Check if FYP is already sponsored
        try {
          const sponsoredResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/is-sponsored/${meetingDetails.fypId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (sponsoredResponse.ok) {
            const sponsoredData = await sponsoredResponse.json()
            setIsSponsored(sponsoredData)
          }
        } catch (err) {
          console.error("Error checking if FYP is sponsored:", err)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetingDetails()
  }, [meetingId, router])

  const handleCompleteMeeting = async () => {
    if (!feedback || !meetingStatus) {
      toast.error("Please provide feedback and select a meeting status")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")

    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/after-meeting/${meetingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: feedback,
            status: meetingStatus === "successful" ? "Successful" : "Needs Improvement",
          }),
        },
      )

      if (response.ok) {
        toast.success("Meeting feedback submitted successfully!")
        setMeeting((prev) =>
          prev
            ? {
                ...prev,
                isMeetDone: true,
                feedback,
                status: meetingStatus === "successful" ? "Successful" : "Needs Improvement",
              }
            : null,
        )
      } else {
        const errorData = await response.text()
        toast.error(`Failed to submit feedback: ${errorData}`)
      }
    } catch (err) {
      toast.error("An error occurred while submitting feedback")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSponsorProject = () => {
    if (!fyp) return
    router.push(`/industryexpert/sponsor-agreement/${fyp.id}`)
  }

  const handleBuyProject = () => {
    if (!fyp) return
    router.push(`/industryexpert/purchase-agreement/${fyp.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading meeting details...</p>
        </div>
      </div>
    )
  }

  if (error || !meeting || !fyp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/20 p-6 rounded-lg border border-red-700 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error || "Failed to load meeting details"}</p>
          <button
            onClick={() => router.push("/industryexpert/meetings")}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-200"
          >
            Return to Meetings
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
            onClick={() => router.push("/industryexpert/meetings")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Meetings
          </button>
          <h1 className="text-3xl font-bold text-purple-400">Meeting Details</h1>
          <p className="text-gray-400 mt-2">{fyp.title}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-400" />
                Meeting Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Scheduled Time</p>
                    <p className="text-gray-200">{meeting.chosenSlot}</p>
                  </div>
                </div>

                {meeting.meetLink && (
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Meeting Link</p>
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {meeting.meetLink}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CheckCircle className={`h-5 w-5 ${meeting.isMeetDone ? "text-green-400" : "text-yellow-400"}`} />
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={meeting.isMeetDone ? "text-green-300" : "text-yellow-300"}>
                      {meeting.isMeetDone ? "Completed" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Feedback Form */}
            {!meeting.isMeetDone ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  Meeting Feedback
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Meeting Status</label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                          meetingStatus === "successful"
                            ? "bg-green-700 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setMeetingStatus("successful")}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Successful
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                          meetingStatus === "needs-improvement"
                            ? "bg-yellow-700 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setMeetingStatus("needs-improvement")}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Needs Improvement
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Your Feedback</label>
                    <textarea
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white h-32"
                      placeholder="Provide your feedback about the meeting and the project..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleCompleteMeeting}
                      disabled={submitting || !feedback || !meetingStatus}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors flex items-center gap-2 disabled:bg-purple-900 disabled:cursor-not-allowed"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Complete Meeting
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  Meeting Feedback
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {meeting.status === "Successful" ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Meeting Status</p>
                      <p className={meeting.status === "Successful" ? "text-green-300" : "text-yellow-300"}>
                        {meeting.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Your Feedback</p>
                    <div className="p-3 bg-gray-700/50 rounded-md text-gray-300">
                      {meeting.feedback || "No feedback provided"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps Section */}
            {meeting.isMeetDone && (
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Next Steps</h2>

                {fyp.yearOfCompletion && fyp.yearOfCompletion > currentYear ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-blue-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-200">Sponsor This Project</p>
                        <p className="text-gray-400 mt-1">
                          This is an ongoing project (completion year: {fyp.yearOfCompletion}). You can sponsor this
                          project to collaborate with the student team throughout the development process.
                        </p>
                      </div>
                    </div>

                    {isSponsored ? (
                      <div className="bg-green-900/20 border border-green-800 rounded-md p-4 text-green-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          <p className="font-medium">You have successfully sponsored this project!</p>
                        </div>
                        <p className="mt-2">
                          You can now collaborate with the student team throughout the development process.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleSponsorProject}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2"
                      >
                        <Briefcase className="h-4 w-4" />
                        Sponsor Project
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-200">Buy This Project</p>
                        <p className="text-gray-400 mt-1">
                          This is a completed project
                          {fyp.yearOfCompletion ? ` (completed in ${fyp.yearOfCompletion})` : ""}. You can purchase this
                          project to acquire its intellectual property rights.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleBuyProject}
                      className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Buy Project
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Project Title</p>
                  <p className="text-gray-200 font-medium">{fyp.title}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Project ID</p>
                  <p className="text-gray-200">{fyp.fypId}</p>
                </div>

                {fyp.members && (
                  <div>
                    <p className="text-sm text-gray-400">Team Size</p>
                    <p className="text-gray-200">{fyp.members} members</p>
                  </div>
                )}

                {fyp.yearOfCompletion && (
                  <div>
                    <p className="text-sm text-gray-400">Year of Completion</p>
                    <p className="text-gray-200">{fyp.yearOfCompletion}</p>
                  </div>
                )}

                {fyp.technology && (
                  <div>
                    <p className="text-sm text-gray-400">Technologies</p>
                    <p className="text-gray-200">{fyp.technology}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Team */}
            {fyp.students && fyp.students.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Student Team
                </h2>

                <div className="space-y-3">
                  {fyp.students.map((student) => (
                    <div key={student.id} className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="font-medium text-gray-200">{student.name}</p>
                      {student.email && <p className="text-gray-400 text-sm">{student.email}</p>}
                    </div>
                  ))}
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

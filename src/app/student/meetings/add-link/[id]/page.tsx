"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Loader2, LinkIcon, Calendar, User, CheckCircle } from "lucide-react"

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

export default function AddMeetingLinkPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [meetingLink, setMeetingLink] = useState("")
  const [submitting, setSubmitting] = useState(false)

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
        // Fetch meeting details
        const meetingResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/by-id/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!meetingResponse.ok) {
          throw new Error("Failed to fetch meeting details")
        }

        const meetingsData = await meetingResponse.json()
        const meetingDetails = Array.isArray(meetingsData) ? meetingsData[0] : meetingsData

        // If meeting already has a link, pre-fill it
        if (meetingDetails.meetLink) {
          setMeetingLink(meetingDetails.meetLink)
        }

        // Fetch detailed FYP information
        const fypResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${meetingDetails.fypId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (fypResponse.ok) {
          const fypData = await fypResponse.json()
          console.log("FYP data:", fypData)

          // Update meeting with FYP details
          meetingDetails.fypTitle = fypData.title || meetingDetails.fypTitle
        } else {
          console.error("Failed to fetch FYP details:", await fypResponse.text())
        }

        // Fetch industry expert details
        try {
          const expertResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${meetingDetails.indExpId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (expertResponse.ok) {
            const expertData = await expertResponse.json()
            meetingDetails.indExpertName = `${expertData.firstName} ${expertData.lastName}`
          }
        } catch (err) {
          console.error("Error fetching expert details:", err)
        }

        setMeeting(meetingDetails)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!meetingLink) {
      toast.error("Please enter a valid meeting link")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/add-link/${meetingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meetingLink),
      })

      if (response.ok) {
        toast.success("Meeting link added successfully! The industry expert has been notified.")
        setTimeout(() => {
          router.push("/student/meetings")
        }, 2000)
      } else {
        const errorText = await response.text()
        toast.error(`Failed to add meeting link: ${errorText}`)
      }
    } catch (err) {
      toast.error("An error occurred while adding the meeting link")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

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
          <p className="text-xl text-gray-700">Loading meeting details...</p>
        </div>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg border border-red-200 shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || "Failed to load meeting details"}</p>
          <button
            onClick={() => router.push("/student/meetings")}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
          >
            Return to Meetings
          </button>
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
            onClick={() => router.push("/student/meetings")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Meetings
          </button>
          <h1 className="text-3xl font-bold text-indigo-600">Add Meeting Link</h1>
          <p className="text-gray-600 mt-2">{meeting.fypTitle}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 space-y-6">
            {/* Meeting Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Meeting Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="text-gray-800 font-medium">{formatTimeSlot(meeting.chosenSlot)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <p className="text-gray-800 font-medium">{meeting.fypTitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Link Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Zoom, Google Meet, Microsoft Teams, etc.)
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    id="meetingLink"
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full pl-10 p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the URL for your virtual meeting. This link will be shared with the industry expert.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Important</p>
                    <p className="text-gray-700 mt-1">
                      Make sure your meeting link is valid and accessible. The industry expert will use this link to
                      join the meeting at the scheduled time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !meetingLink}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed shadow-sm"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {meeting.meetLink ? "Update Meeting Link" : "Add Meeting Link"}
                </button>
              </div>
            </form>
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

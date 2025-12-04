"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Calendar, Clock, Loader2, CheckCircle, ArrowLeft, User } from "lucide-react"

interface MeetingRequest {
  id: string
  fypId: string
  fypTitle: string
  indExpertId: string
  indExpertName?: string
  timeSlots: string[]
}

export default function SelectMeetingTimePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meetingRequest, setMeetingRequest] = useState<MeetingRequest | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [studentId, setStudentId] = useState<string | null>(null)

  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  useEffect(() => {
    const fetchMeetingRequest = async () => {
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

        const studentData = await studentResponse.json()
        setStudentId(studentData.id)

        // Step 3: Fetch meeting request details
        const meetingResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/request/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!meetingResponse.ok) {
          throw new Error("Failed to fetch meeting request details")
        }

        const meetingData = await meetingResponse.json()

        // Fetch detailed FYP information
        const fypResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp/get-detailed-fyp-by-id/${meetingData.fypId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (fypResponse.ok) {
          const fypData = await fypResponse.json()
          console.log("FYP data:", fypData)

          // Update meeting request with FYP details
          meetingData.fypTitle = fypData.title || meetingData.fypTitle
        } else {
          console.error("Failed to fetch FYP details:", await fypResponse.text())
        }

        // Fetch industry expert name
        try {
          const expertResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${meetingData.indExpertId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          if (expertResponse.ok) {
            const expertData = await expertResponse.json()
            meetingData.indExpertName = `${expertData.firstName} ${expertData.lastName}`
          }
        } catch (err) {
          console.error("Error fetching expert details:", err)
        }

        setMeetingRequest(meetingData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetingRequest()
  }, [requestId, router])

  const formatTimeSlot = (timeSlot: string) => {
    try {
      const date = new Date(timeSlot)
      return date.toLocaleString()
    } catch (e) {
      return timeSlot
    }
  }

  const handleSelectTimeSlot = async () => {
    if (!selectedTimeSlot || !meetingRequest || !studentId) {
      toast.error("Please select a time slot")
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem("jwtToken")

    try {
      console.log("Sending data:", {
        indExpertId: meetingRequest.indExpertId,
        timeSlot: selectedTimeSlot,
      })

      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/add/${meetingRequest.fypId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          indExpertId: meetingRequest.indExpertId,
          timeSlot: selectedTimeSlot,
        }),
      })

      if (response.ok) {
        toast.success("Meeting time selected successfully!")
        setTimeout(() => {
          router.push("/student/meetings")
        }, 2000)
      } else {
        const errorText = await response.text()
        toast.error(`Failed to select meeting time: ${errorText}`)
      }
    } catch (err) {
      toast.error("An error occurred while selecting the meeting time")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-xl text-gray-700">Loading meeting request...</p>
        </div>
      </div>
    )
  }

  if (error || !meetingRequest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg border border-red-200 shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || "Failed to load meeting request"}</p>
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
          <h1 className="text-3xl font-bold text-indigo-600">Select Meeting Time</h1>
          <p className="text-gray-600 mt-2">{meetingRequest.fypTitle}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 space-y-6">
            {/* Meeting Request Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Meeting Request</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <p className="text-gray-800 font-medium">{meetingRequest.fypTitle}</p>
                  </div>
                </div>

                {meetingRequest.indExpertName && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-600">Industry Expert</p>
                      <p className="text-gray-800 font-medium">{meetingRequest.indExpertName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select a Time Slot</h3>
              <p className="text-gray-600 mb-4">
                The industry expert has provided the following time slots. Please select one that works for you.
              </p>

              <div className="space-y-3">
                {meetingRequest.timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTimeSlot === timeSlot
                        ? "bg-indigo-50 border-indigo-300"
                        : "bg-white border-gray-200 hover:border-indigo-200"
                    }`}
                    onClick={() => setSelectedTimeSlot(timeSlot)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        <span className="text-gray-800">{formatTimeSlot(timeSlot)}</span>
                      </div>
                      {selectedTimeSlot === timeSlot && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSelectTimeSlot}
                disabled={submitting || !selectedTimeSlot}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Selected Time
              </button>
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

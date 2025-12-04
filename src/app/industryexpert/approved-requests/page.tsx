"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, Calendar, ArrowRight, Plus, X } from 'lucide-react'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ApprovedRequest {
  id: string
  status: number
  fypId: string
  fypTitle: string
  fyp_fypId: string
  fypDescription?: string
}

interface TimeSlot {
  id: number
  value: string
  label: string
}

export default function ApprovedRequestsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approvedRequests, setApprovedRequests] = useState<ApprovedRequest[]>([])
  const [industryExpertId, setIndustryExpertId] = useState<string | null>(null)

  // Meeting scheduling states
  const [schedulingFypId, setSchedulingFypId] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [schedulingLoading, setSchedulingLoading] = useState(false)

  // Custom time slot input
  const [customDate, setCustomDate] = useState<string>("")
  const [customTime, setCustomTime] = useState<string>("")

  const router = useRouter()

  // Generate available time slots for the next 14 days
  useEffect(() => {
    const slots: TimeSlot[] = []
    const now = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(now)
      date.setDate(now.getDate() + i)
      
      // Format in ISO format for backend
      const isoString = date.toISOString()
      
      // Morning slot (10:00 AM)
      const morningDate = new Date(date)
      morningDate.setHours(10, 0, 0, 0)
      
      // Afternoon slot (2:00 PM)
      const afternoonDate = new Date(date)
      afternoonDate.setHours(14, 0, 0, 0)
      
      // Evening slot (4:00 PM)
      const eveningDate = new Date(date)
      eveningDate.setHours(16, 0, 0, 0)
      
      slots.push({
        id: slots.length + 1,
        value: morningDate.toISOString(),
        label: `${date.toLocaleDateString()} at 10:00 AM`,
      })
      
      slots.push({
        id: slots.length + 1,
        value: afternoonDate.toISOString(),
        label: `${date.toLocaleDateString()} at 2:00 PM`,
      })
      
      slots.push({
        id: slots.length + 1,
        value: eveningDate.toISOString(),
        label: `${date.toLocaleDateString()} at 4:00 PM`,
      })
    }

    setAvailableTimeSlots(slots)
  }, [])

  const fetchApprovedRequests = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    try {
      // Step 1: Get user info
      const profileResponse = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!profileResponse.ok) throw new Error("Failed to fetch profile.")

      const profileData = await profileResponse.json()
      const userId = profileData.userId

      // Step 2: Get industry expert details
      const expertResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!expertResponse.ok) throw new Error("Failed to fetch expert profile.")

      const expertData = await expertResponse.json()
      setIndustryExpertId(expertData.indExptId)

      // Step 3: Fetch FYP requests for this industry expert
      const requestsResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ind-expert-request-fyp/get-by-id/${expertData.indExptId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (requestsResponse.ok) {
        const requestData = await requestsResponse.json()
        console.log("Request data:", requestData)

        // If the response is an array, use it directly, otherwise wrap it in an array
        const requestsArray = Array.isArray(requestData) ? requestData : [requestData]

        // Filter for approved requests (status = 1)
        const approvedRequests = requestsArray.filter((req) => req.status === 1)
        setApprovedRequests(approvedRequests)
      } else {
        if (requestsResponse.status === 404) {
          console.log("No requests found for this industry expert")
          setApprovedRequests([])
        } else {
          console.error("Failed to fetch requests:", await requestsResponse.text())
          throw new Error("Failed to fetch requests")
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedRequests()
  }, [router])

  const handleScheduleMeeting = (fypId: string) => {
    setSchedulingFypId(fypId)
    setSelectedTimeSlot("")
  }

  const selectTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const addCustomTimeSlot = () => {
    if (!customDate || !customTime) {
      toast.error("Please select both date and time")
      return
    }

    try {
      // Create a date object and format it as ISO string
      const dateTimeString = `${customDate}T${customTime}:00.000Z`
      const dateObj = new Date(dateTimeString)
      const isoString = dateObj.toISOString()
      
      setSelectedTimeSlot(isoString)
      setCustomDate("")
      setCustomTime("")
    } catch (err) {
      toast.error("Invalid date or time format")
    }
  }

  const submitMeetingSchedule = async () => {
    if (!schedulingFypId || !selectedTimeSlot || !industryExpertId) {
      toast.error("Please select a time slot")
      return
    }

    setSchedulingLoading(true)
    const token = localStorage.getItem("jwtToken")

    try {
      // Create the proper DTO object as expected by the backend
      const meetingDto = {
        indExpertId: industryExpertId,
        timeSlot: selectedTimeSlot,
      }

      console.log("Sending meeting request:", meetingDto)

      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/fyp-meeting/add/${schedulingFypId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(meetingDto),
        },
      )

      if (response.ok) {
        toast.success("Meeting scheduled successfully! Students will be notified.")
        setSchedulingFypId(null)
        setSelectedTimeSlot("")
      } else {
        const errorText = await response.text()
        toast.error(`Failed to schedule meeting: ${errorText}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setSchedulingLoading(false)
    }
  }

  const formatTimeSlot = (timeSlot: string) => {
    try {
      const date = new Date(timeSlot)
      const formattedDate = date.toLocaleDateString()
      
      const hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      
      return `${formattedDate} at ${formattedHours}:${minutes} ${ampm}`
    } catch (e) {
      return timeSlot
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-xl text-gray-300">Loading your approved requests...</p>
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
          <h1 className="text-3xl font-bold text-purple-400">Approved FYP Requests</h1>
          <p className="text-gray-400 mt-2">Manage your approved Final Year Project collaborations</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {approvedRequests.length > 0 ? (
          <div className="space-y-6">
            {approvedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{request.fypTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-md">
                          {request.fyp_fypId}
                        </div>
                        <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-md flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Approved</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/industryexpert/fyp/${request.fypId}`)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {request.fypDescription && (
                    <p className="text-gray-400 mt-4 line-clamp-2">{request.fypDescription}</p>
                  )}

                  {/* Meeting Scheduling Section */}
                  <div className="mt-6 border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-white mb-3">Schedule a Meeting</h4>

                    {schedulingFypId === request.fypId ? (
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-300 mb-2">Select a time slot for the meeting:</p>

                          {/* Selected time slot */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Selected time slot:</p>
                            {selectedTimeSlot ? (
                              <div className="bg-purple-900/30 text-purple-300 px-3 py-1.5 rounded-md inline-flex items-center gap-2">
                                <span>{formatTimeSlot(selectedTimeSlot)}</span>
                                <button
                                  onClick={() => setSelectedTimeSlot("")}
                                  className="text-purple-300 hover:text-purple-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">No time slot selected yet</p>
                            )}
                          </div>

                          {/* Custom time slot */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Add a custom time slot:</p>
                            <div className="flex flex-wrap gap-3">
                              <input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                              />
                              <input
                                type="time"
                                value={customTime}
                                onChange={(e) => setCustomTime(e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                              />
                              <button
                                onClick={addCustomTimeSlot}
                                disabled={!customDate || !customTime}
                                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-1 disabled:bg-blue-900 disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </button>
                            </div>
                          </div>

                          {/* Predefined time slots */}
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Or select from available time slots:</p>
                            <select
                              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-2"
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  selectTimeSlot(e.target.value)
                                  e.target.value = "" // Reset select after adding
                                }
                              }}
                            >
                              <option value="">-- Select a time slot --</option>
                              {availableTimeSlots.map((slot) => (
                                <option key={slot.id} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setSchedulingFypId(null)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={submitMeetingSchedule}
                            disabled={schedulingLoading || !selectedTimeSlot}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center gap-2 disabled:bg-purple-800 disabled:opacity-50"
                          >
                            {schedulingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Schedule Meeting
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleScheduleMeeting(request.fypId)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md">
              <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No approved requests yet</h3>
              <p className="text-gray-400 mt-2">
                You donot have any approved FYP requests yet. Once your requests are approved by university admins, they
                will appear here.
              </p>
              <button
                onClick={() => router.push("/industryexpert/fyp-marketplace")}
                className="mt-6 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                Browse FYP Marketplace
              </button>
            </div>
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

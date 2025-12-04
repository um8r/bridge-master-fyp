"use client"
import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { FaCalendarAlt, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { motion } from "framer-motion"

export interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

// Calendar helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]
}

export default function EventsPage() {
  const [eventsData, setEventsData] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("upcoming")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Refs for scrolling to selected event
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Get current year and month
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Get days in current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Day names for display
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  useEffect(() => {
    async function fetchEvents() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      setLoading(true)
      try {
        const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/Events/get-events", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setEventsData(data)
        } else {
          console.error("Failed to fetch events")
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [router])

  // Create a map of dates with events for quick lookup
  const eventDates = useMemo(() => {
    const dateMap: Record<string, Event[]> = {}

    eventsData.forEach((event) => {
      const dateKey = event.eventDate.split("T")[0]
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = []
      }
      dateMap[dateKey].push(event)
    })

    return dateMap
  }, [eventsData])

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Handle date selection
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)

    // If the selected date has events, automatically switch to that tab and select the first event
    const dateKey = formatDate(newDate)
    if (eventDates[dateKey] && eventDates[dateKey].length > 0) {
      const eventDate = new Date(eventDates[dateKey][0].eventDate)
      const today = new Date()

      // Set the appropriate tab
      if (eventDate < today) {
        setActiveTab("past")
      } else {
        setActiveTab("upcoming")
      }

      // Set the selected event ID and scroll to it
      const selectedEvent = eventDates[dateKey][0]
      setSelectedEventId(selectedEvent.id)

      // Scroll to the selected event with a small delay to ensure rendering
      setTimeout(() => {
        if (eventRefs.current[selectedEvent.id]) {
          eventRefs.current[selectedEvent.id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
      }, 100)
    }
  }

  // Filter events based on active tab
  const now = new Date()

  // Categorize events
  const pastEvents = eventsData.filter((event) => new Date(event.eventDate) < now)
  const upcomingEvents = eventsData.filter((event) => new Date(event.eventDate) >= now)

  const getFilteredEvents = () => {
    // Filter by tab
    let filteredList: Event[] = []
    switch (activeTab) {
      case "past":
        filteredList = pastEvents
        break
      case "upcoming":
        filteredList = upcomingEvents
        break
      default:
        filteredList = []
    }

    return filteredList
  }

  const filteredEvents = getFilteredEvents()

  // Check if a specific day has events
  const hasEvents = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const dateKey = formatDate(date)
    return !!eventDates[dateKey]
  }

  // Check if a specific day is selected
  const isSelected = (day: number) => {
    if (!selectedDate) return false

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    )
  }

  // Check if a specific day is today
  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const dateKey = formatDate(date)
    return eventDates[dateKey] || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-center mb-10">
          University Events
        </h1>

        {/* Main content - Side by side on desktop, stacked on mobile */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left side - Event List */}
          <div className="w-full md:w-3/5">
            {/* Tab Switcher */}
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2 text-sm md:text-base rounded-full ${
                  activeTab === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors duration-200`}
              >
                Upcoming Events
              </button>

              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 text-sm md:text-base rounded-full ${
                  activeTab === "past" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors duration-200`}
              >
                Past Events
              </button>
            </div>

            {/* Event Cards */}
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    ref={(el) => {
                      eventRefs.current[event.id] = el
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
                      selectedEventId === event.id ? "border-blue-500" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    {/* Event Title */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>

                    {/* Speaker Name */}
                    <p className="text-gray-600 mb-3">
                      <span className="font-medium">Speaker:</span> {event.speakerName}
                    </p>

                    {/* Event Date and Venue */}
                    <div className="flex flex-col gap-2">
                      {/* Event Date */}
                      <div className="flex items-center text-gray-500">
                        <FaCalendarAlt className="mr-2 text-blue-500 flex-shrink-0" />
                        <p className="text-sm">
                          <span className="font-medium">Date:</span> {new Date(event.eventDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Event Venue */}
                      <div className="flex items-center text-gray-500">
                        <FaMapMarkerAlt className="mr-2 text-red-500 flex-shrink-0" />
                        <p className="text-sm">
                          <span className="font-medium">Venue:</span> {event.venue}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-md">
                  <FaCalendarAlt className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-xl font-semibold text-gray-500">No {activeTab} events available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Calendar */}
          <div className="w-full md:w-2/5 mt-6 md:mt-0">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Previous month"
                >
                  <FaChevronLeft />
                </button>
                <h2 className="text-xl font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Next month"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Day names */}
                <div className="grid grid-cols-7 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the first day of month */}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-12 rounded-md"></div>
                  ))}

                  {/* Actual days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const hasEventOnDay = hasEvents(day)
                    const isSelectedDay = isSelected(day)
                    const isTodayDay = isToday(day)
                    const dayEvents = getEventsForDay(day)
                    const eventCount = dayEvents.length

                    return (
                      <button
                        key={`day-${day}`}
                        onClick={() => handleDateClick(day)}
                        className={`h-12 rounded-md flex flex-col items-center justify-center relative transition-all ${
                          isSelectedDay
                            ? "bg-blue-500 text-white"
                            : isTodayDay
                              ? "bg-blue-100 text-blue-800"
                              : hasEventOnDay
                                ? "hover:bg-blue-50"
                                : "hover:bg-gray-100"
                        }`}
                      >
                        <span className={`text-sm ${isSelectedDay ? "font-bold" : ""}`}>{day}</span>
                        {hasEventOnDay && !isSelectedDay && (
                          <div className="absolute bottom-1 flex space-x-0.5">
                            {eventCount > 3 ? (
                              <div className="text-xs text-blue-500 font-medium">{eventCount}</div>
                            ) : (
                              Array.from({ length: Math.min(eventCount, 3) }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              ))
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Calendar Legend */}
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></div>
                    <span>Has Events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

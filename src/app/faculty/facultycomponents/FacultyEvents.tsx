"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, User, Eye, Edit, ArrowRight } from "lucide-react"

interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

interface UpcomingEventsSectionProps {
  events: Event[]
  onSeeMoreEvents: () => void
  onCreateEvent: () => void
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events, onSeeMoreEvents, onCreateEvent }) => {
  // Format date to get day and month
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
    }
  }

  return (
    <div className="my-6">
      {/* Header with action buttons */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
          <p className="text-sm text-gray-500">Stay updated with the latest academic events</p>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={onSeeMoreEvents}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors flex items-center"
          >
            <Edit className="w-6.5 h-6.5 mr-1" />
            Create
          </button>
          <button
            onClick={onCreateEvent}
            className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center"
          >
            <Eye className="w-6.5 h-6.5 mr-1" />
            View All
          </button>
        </div>
      </div>

      {/* Horizontal scrolling event cards */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-3">
            {events.length > 0 ? (
              events.slice(0, 5).map((event, index) => {
                const { day, month } = formatDate(event.eventDate)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col items-center justify-center w-10 h-10 rounded bg-blue-50 text-blue-600">
                          <span className="text-xs font-semibold">{month}</span>
                          <span className="text-sm font-bold">{day}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                          {new Date(event.eventDate).toLocaleDateString() === new Date().toLocaleDateString()
                            ? "Today"
                            : "Upcoming"}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">{event.title}</h3>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1.5 text-gray-400" />
                          <span className="truncate">{event.speakerName}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1.5 text-gray-400" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex-shrink-0 w-full bg-white rounded-lg border border-gray-100 border-dashed p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No upcoming events</p>
                <button
                  onClick={onSeeMoreEvents}
                  className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors inline-flex items-center"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Create Event
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fade effect for horizontal scroll */}
        {events.length > 2 && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        )}
      </div>
    </div>
  )
}

export default UpcomingEventsSection

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { FaBell, FaCalendarAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import type { Event } from "./EventsComponent"

interface EventNotificationManagerProps {
  events: Event[]
}

const EventNotificationManager: React.FC<EventNotificationManagerProps> = ({ events }) => {
  const [activeNotification, setActiveNotification] = useState<Event | null>(null)
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Check for events that are about to start (within 30 minutes)
    const checkForDueEvents = () => {
      const now = new Date()
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000)

      // Find events that are starting soon and haven't been notified yet
      const dueEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDate)
        return eventDate > now && eventDate <= thirtyMinutesFromNow && !notifiedEvents.has(event.id)
      })

      if (dueEvents.length > 0 && !activeNotification) {
        // Show notification for the first due event
        setActiveNotification(dueEvents[0])

        // Mark this event as notified
        setNotifiedEvents((prev) => {
          const updated = new Set(prev)
          updated.add(dueEvents[0].id)
          return updated
        })
      }
    }

    // Check immediately and then every minute
    checkForDueEvents()
    const interval = setInterval(checkForDueEvents, 60000)

    return () => clearInterval(interval)
  }, [events, activeNotification, notifiedEvents])

  const handleCloseNotification = () => {
    setActiveNotification(null)
  }

  if (!activeNotification) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 border-l-4 border-blue-500"
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaBell className="text-blue-500" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-800">Event Reminder</h3>
            </div>
            <button onClick={handleCloseNotification} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FaTimes />
            </button>
          </div>

          <div className="mt-3">
            <h4 className="font-bold text-gray-800">{activeNotification.title}</h4>
            <p className="text-sm text-gray-600">Speaker: {activeNotification.speakerName}</p>

            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                <span>{new Date(activeNotification.eventDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <span>{activeNotification.venue}</span>
              </div>
            </div>

            <div className="mt-3 bg-blue-50 p-2 rounded flex items-center justify-center">
              <div className="text-blue-800 font-medium">Event starting soon!</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EventNotificationManager

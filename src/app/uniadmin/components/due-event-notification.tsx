"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaBell, FaCalendarAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa"
import type { Event } from "./EventsComponent"

interface DueEventNotificationProps {
  event: Event
  onClose: () => void
}

const DueEventNotification: React.FC<DueEventNotificationProps> = ({ event, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const eventDate = new Date(event.eventDate)
      const difference = eventDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft("Event has started!")
        return
      }

      // Calculate days, hours, minutes
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [event.eventDate])

  return (
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="mt-3">
          <h4 className="font-bold text-gray-800">{event.title}</h4>
          <p className="text-sm text-gray-600">Speaker: {event.speakerName}</p>

          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <span>{new Date(event.eventDate).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="mt-3 bg-blue-50 p-2 rounded flex items-center justify-center">
            <div className="text-blue-800 font-medium">Time remaining: {timeLeft}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
    </motion.div>
  )
}

export default DueEventNotification

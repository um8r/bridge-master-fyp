"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Event } from "./EventsComponent"

interface EventCountdownProps {
  events: Event[]
}

const EventCountdown: React.FC<EventCountdownProps> = ({ events }) => {
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    // Find the next upcoming event
    const now = new Date()
    const upcomingEvents = events
      .filter((event) => new Date(event.eventDate) > now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

    if (upcomingEvents.length > 0) {
      setNextEvent(upcomingEvents[0])
    }
  }, [events])

  useEffect(() => {
    if (!nextEvent) return

    const calculateTimeLeft = () => {
      const now = new Date()
      const eventDate = new Date(nextEvent.eventDate)
      const difference = eventDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft(null)
        return
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [nextEvent])

  if (!nextEvent || !timeLeft)
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <h3 className="font-bold">Event Countdown</h3>
        </div>
        <div className="p-8 flex items-center justify-center">
          <p className="text-gray-500">No upcoming events</p>
        </div>
      </div>
    )

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <h3 className="font-bold">Next Event Countdown</h3>
        <p className="text-sm text-blue-100 truncate">{nextEvent.title}</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <motion.div
              key={timeLeft.days}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-blue-600"
            >
              {timeLeft.days}
            </motion.div>
            <div className="text-xs text-gray-500">Days</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <motion.div
              key={timeLeft.hours}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-blue-600"
            >
              {timeLeft.hours}
            </motion.div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <motion.div
              key={timeLeft.minutes}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-blue-600"
            >
              {timeLeft.minutes}
            </motion.div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <motion.div
              key={timeLeft.seconds}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-blue-600"
            >
              {timeLeft.seconds}
            </motion.div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-center text-gray-500">{new Date(nextEvent.eventDate).toLocaleString()}</div>

        <div className="mt-3 text-xs text-center bg-gray-50 p-2 rounded-lg">
          <span className="font-medium text-gray-700">Venue:</span> {nextEvent.venue}
        </div>
      </div>
    </div>
  )
}

export default EventCountdown

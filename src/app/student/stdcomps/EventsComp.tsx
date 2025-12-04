"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, User, Eye, Clock, ChevronRight, Filter, Search, Bell } from "lucide-react"

interface Event {
  id: string
  title: string
  speakerName: string
  eventDate: string
  venue: string
}

interface Props {
  events: Event[]
  gradientStyles: string[]
}

const EventsSection: React.FC<Props> = ({ events, gradientStyles }) => {
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Toggle the display of all events
  const toggleAllEvents = () => setShowAllEvents(!showAllEvents)

  // Get random gradient for each event
  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-amber-500 to-orange-600",
      "from-red-500 to-pink-600",
      "from-cyan-500 to-blue-600",
    ]
    return gradients[index % gradients.length]
  }

  // Format date nicely
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isPast: date < new Date(),
      isToday: new Date().toDateString() === date.toDateString(),
      isSoon: date > new Date() && date < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Filter events to display
  const displayEvents = showAllEvents ? events : events.slice(0, 3)

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
              Upcoming University Events
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Stay connected with campus life and expand your knowledge through these exciting events and workshops.
            </p>
          </div>

          {/*<div className="mt-4 md:mt-0 flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span>Filter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span>Notifications</span>
            </motion.button>
          </div>*/}
        </div>

        {/* Search and Filter Bar 
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-full ${
                selectedFilter === "all"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setSelectedFilter("upcoming")}
              className={`px-3 py-1.5 rounded-full ${
                selectedFilter === "upcoming"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setSelectedFilter("today")}
              className={`px-3 py-1.5 rounded-full ${
                selectedFilter === "today"
                  ? "bg-green-100 text-green-700 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today
            </button>
          </div>
        </div>*/}

        {/* Event Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayEvents.map((event, index) => {
            const eventDate = formatEventDate(event.eventDate)

            return (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                {/* Event Header with Date */}
                <div className="relative">
                  <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${getRandomGradient(index)}`}>
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,0 L100,0 L100,100 Z" fill="white" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative pt-6 px-6 pb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        <span>{event.speakerName}</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-2 text-center min-w-16">
                      <div
                        className={`text-lg font-bold ${
                          eventDate.isPast ? "text-gray-500" : eventDate.isToday ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {eventDate.day}
                      </div>
                      <div className="text-xs uppercase font-medium text-gray-500">{eventDate.month}</div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 pt-2 flex-grow">
                  <div className="flex items-start mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-800">{eventDate.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-gray-800">{event.venue}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4">
                    {eventDate.isPast ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        Ended
                      </span>
                    ) : eventDate.isToday ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Today
                      </span>
                    ) : eventDate.isSoon ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Footer */}
                <div className="p-4 mt-auto bg-gray-50 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <span>{Math.floor(Math.random() * 50) + 10} people attending</span>
                  </div>

                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Show More/Less Button */}
        {events.length > 3 && (
          <div className="mt-12 flex justify-center">
            <motion.button
              onClick={toggleAllEvents}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              <span>{showAllEvents ? "Show Less Events" : "See More Events"}</span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsSection

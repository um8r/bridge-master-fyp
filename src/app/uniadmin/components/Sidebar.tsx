"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { FaUser, FaProjectDiagram, FaCalendarAlt, FaSignOutAlt, FaBell } from "react-icons/fa"
import { FiShoppingBag } from "react-icons/fi"
import { motion } from "framer-motion"
import type { Event } from "./EventsComponent"

interface SidebarProps {
  handleLogout: () => void
  dueEvents?: Event[]
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout, dueEvents = [] }) => {
  const router = useRouter()
  const hasDueEvents = dueEvents && dueEvents.length > 0

  return (
    <div className="w-64 bg-gray-100 shadow-lg h-screen">
      <div className="p-6 border-b border-gray-200 flex items-center justify-center">
        <img src="/images/university-logo.png" alt="University Logo" className="h-10 w-auto mr-3" />
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Admin Dashboard
        </h2>
      </div>

      <nav className="mt-6">
        <a
          onClick={() => router.push("uniadmin/profile")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-200 hover:text-white cursor-pointer"
        >
          <FaUser className="mr-3" />
          Profile
        </a>

        <a
          onClick={() => router.push("uniadmin/fyprequests")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-200 hover:text-white cursor-pointer"
        >
          <FaProjectDiagram className="mr-3" />
          FYP Requests
        </a>

        <a
          onClick={() => router.push("uniadmin/fyp-requests")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-200 hover:text-white cursor-pointer"
        >
          <FiShoppingBag className="mr-3" />
          FYP Market Place
        </a>

        <a
          onClick={() => router.push("uniadmin/events")}
          className="flex items-center py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-200 hover:text-white cursor-pointer relative"
        >
          <FaCalendarAlt className="mr-3" />
          Events
          {/* Due Events Badge */}
          {hasDueEvents && (
            <div className="absolute right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {dueEvents.length}
            </div>
          )}
        </a>

        <button
          onClick={handleLogout}
          className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-200 hover:text-white"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </nav>

      {/* Due Events Notification Panel */}
      {hasDueEvents && (
        <div className="mx-4 mt-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center text-blue-500 mb-3">
            <FaBell className="mr-2" />
            <span className="font-semibold">Upcoming Events</span>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {dueEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm bg-gray-50 p-3 rounded-md border-l-4 border-blue-400"
              >
                <p className="font-medium text-gray-800">{event.title}</p>
                <p className="text-gray-500 mt-1 text-xs">{new Date(event.eventDate).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar

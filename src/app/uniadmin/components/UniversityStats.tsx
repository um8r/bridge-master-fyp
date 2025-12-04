"use client"

import type React from "react"
import { FaGraduationCap, FaChalkboardTeacher, FaChartLine } from "react-icons/fa"
import { motion } from "framer-motion"

interface UniversityStatsProps {
  studentsCount: number
  facultiesCount: number
}

const UniversityStats: React.FC<UniversityStatsProps> = ({ studentsCount, facultiesCount }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Students Card */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -5 }}
      >
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Students</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaGraduationCap className="text-blue-500 text-xl" />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="relative">
              <span className="text-4xl font-bold text-gray-800">{studentsCount}</span>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaChartLine className="text-blue-500 text-xs" />
              </div>
            </div>
            <span className="text-gray-500 text-sm pb-1">Total Enrolled</span>
          </div>
        </div>
      </motion.div>

      {/* Faculties Card */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -5 }}
      >
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Faculty</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <FaChalkboardTeacher className="text-green-500 text-xl" />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="relative">
              <span className="text-4xl font-bold text-gray-800">{facultiesCount}</span>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaChartLine className="text-green-500 text-xs" />
              </div>
            </div>
            <span className="text-gray-500 text-sm pb-1">Faculty Members</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UniversityStats

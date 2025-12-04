"use client"

import { motion, AnimatePresence } from "framer-motion"
import ToggleSwitch from "./ToggleSwitch"
import LoadingSpinner from "./LoadingSpinner"
import VisualizationsView from "./VisualizationsView"
import UsersView from "./UserView"
import { useRef } from "react"
import { useInView } from "framer-motion"

interface Data {
  universities: number
  students: number
  industryExperts: number
  faculties: number
  companies: number
}

interface ImpactSectionProps {
  impactView: "users" | "visualizations"
  handleToggle: () => void
  data: Data
  loading: boolean
}

export default function ImpactSection({ impactView, handleToggle, data, loading }: ImpactSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const chartData = {
    labels: ["Universities", "Students", "Industry Experts", "Faculties", "Companies"],
    datasets: [
      {
        label: "Count",
        data: [data.universities, data.students, data.industryExperts, data.faculties, data.companies],
        borderColor: "#3B82F6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
    ],
  }

  return (
    <section ref={ref} className="py-20 bg-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full opacity-40 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-100 rounded-full opacity-40 -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-16"
        >
          Our Impact
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <ToggleSwitch
            leftLabel="Users"
            rightLabel="Visualizations"
            isChecked={impactView === "visualizations"}
            onToggle={handleToggle}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner key="loading" />
          ) : impactView === "users" ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <UsersView data={data} />
            </motion.div>
          ) : (
            <motion.div
              key="visualizations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <VisualizationsView data={chartData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}


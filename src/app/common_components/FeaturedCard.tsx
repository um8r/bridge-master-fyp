"use client"

import type React from "react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <motion.div
      variants={item}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
      }}
      className="bg-white rounded-xl p-8 text-center transition-all duration-300 border border-blue-100 shadow-sm hover:shadow-xl"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-blue-50 rounded-full p-5 shadow-inner">{icon}</div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}


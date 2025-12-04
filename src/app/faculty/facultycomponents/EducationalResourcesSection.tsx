"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Briefcase, BookOpen } from "lucide-react"
import Image from "next/image"

const EducationalResourcesSection: React.FC = () => {
  const router = useRouter()

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="relative w-full md:w-2/5 h-64 md:h-auto">
          <Image
            src="https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg"
            alt="Education background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/70 mix-blend-multiply" />
          {/* Overlay icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
              <BookOpen className="h-14 w-14 text-white/80" />
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Educational Resources
          </h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Empower your students with curated notes, slides, articles, and more.
          </p>

          {/* Button container */}
          <div className="flex flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/faculty/educational-resource/add-education-source")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
            >
              <Briefcase className="h-5 w-5" />
              Add New Resource
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/faculty/educational-resource/manage-education-source")}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
            >
              <Briefcase className="h-5 w-5" />
              Manage Resources
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EducationalResourcesSection
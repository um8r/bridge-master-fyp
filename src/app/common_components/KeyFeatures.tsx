"use client"

import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa"
import FeatureCard from "./FeaturedCard"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

export default function KeyFeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-50 -z-10"></div>
      <div className="absolute bottom-20 left-0 w-48 h-48 bg-blue-50 rounded-full opacity-50 -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-16"
        >
          Key Features
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          <FeatureCard
            icon={<FaLinkedin className="w-8 h-8 text-blue-500" />}
            title="Seamless Collaboration"
            description="Connect and collaborate with industry experts and academia to create impactful projects."
          />
          <FeatureCard
            icon={<FaGithub className="w-8 h-8 text-blue-500" />}
            title="Resource Sharing"
            description="Access a wide range of resources to support your academic and professional growth."
          />
          <FeatureCard
            icon={<FaEnvelope className="w-8 h-8 text-blue-500" />}
            title="Expert Mentorship"
            description="Get guidance from industry leaders who are at the forefront of their fields."
          />
        </motion.div>
      </div>
    </section>
  )
}


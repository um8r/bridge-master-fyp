"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function MissionSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  return (
    <section ref={sectionRef} className="py-20 bg-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full opacity-50 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
        <motion.div style={{ opacity, y }}>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-8">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            At BridgeIT, our mission is to connect the dots between academia and industry, enabling the next generation
            of professionals to collaborate and innovate. We strive to create a seamless ecosystem where knowledge meets
            opportunity, fostering growth and advancement for all.
          </p>
        </motion.div>
      </div>
    </section>
  )
}


"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"

export default function HeroSection() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen px-4 sm:px-8 md:px-16 pt-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-bl-full opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/4 bg-blue-50 rounded-tr-full opacity-50 -z-10"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center md:text-left md:w-1/2 z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-6 leading-tight">
          Welcome to BridgeIT!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
          Bridge the gap between academia and industry with our platform, where universities and experts connect
          directly with businesses.
        </p>
        <Link href="/auth/register-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl active:opacity-90 outline-none transition-all duration-300 text-lg"
            aria-label="Create an Account"
          >
            Get Started <FaArrowRight className="inline-block ml-2" />
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-12 md:mt-0 md:w-1/2 flex justify-center z-10"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-30"></div>
          <Image
            src="/heroimage.png"
            alt="Hero Image"
            width={600}
            height={400}
            className="rounded-2xl relative z-10"
          />
        </div>
      </motion.div>
    </section>
  )
}


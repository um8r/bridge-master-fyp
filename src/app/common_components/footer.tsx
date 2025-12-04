"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-600 py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-6 md:mb-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm opacity-50"></div>
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={40} height={40} className="rounded-full relative z-10" />
          </div>
          <span className="ml-3 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            BridgeIT
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          <a href="#" className="hover:text-blue-500 transition-colors duration-300 relative group">
            Privacy Policy
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors duration-300 relative group">
            Terms of Service
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors duration-300 relative group">
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 md:mt-0"
        >
          <p>&copy; {new Date().getFullYear()} BridgeIT. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}


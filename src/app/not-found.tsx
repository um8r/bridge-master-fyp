"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Home, ArrowLeft, BookOpen, HelpCircle, RefreshCw } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-24 relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <span className="mr-2">404</span>
              <span className="h-8 w-0.5 bg-white/30 mx-3"></span>
              <span>Page Not Found</span>
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center mb-8">
            {/* 404 Illustration */}
            <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
              >
                <img src="/4phnn.png" alt="404 Error Illustration" className="w-48 h-48" />
              </motion.div>
            </div>

            {/* Error Message */}
            <div className="w-full md:w-1/2 md:pl-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! We cant find that page</h2>
              <p className="text-gray-600 mb-6">
                The page youre looking for might have been moved, deleted, or never existed in the first place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow transition flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Helpful Suggestions */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              What might have happened?
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>The URL might be misspelled or incorrect</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>The resource might have been moved or deleted</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You might not have permission to access this page</span>
              </li>
            </ul>
          </div>

          {/* Search Box */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for educational resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-800">Browse Resources</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer flex items-center">
              <RefreshCw className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-800">Recent Resources</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer flex items-center">
              <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-800">Help Center</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8">
        If you believe this is an error, please contact{" "}
        <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
          support@example.com
        </a>
      </p>
    </div>
  )
}

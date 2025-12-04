"use client"

import type React from "react"
import { useState } from "react"
import { FaSearch, FaUser, FaGraduationCap, FaEnvelope, FaBuilding } from "react-icons/fa"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

// Define the SearchResult interface here
interface SearchResult {
  userId: string
  firstName: string
  lastName: string
  email: string
  description: string
  department?: string
  imageData: string | null
  universityName?: string
}

interface SearchSectionProps {
  universityName: string | undefined
  onSearch: (query: string, searchType: string) => void
  searchLoading: boolean
  searchError: string
  results: SearchResult[]
}

const SearchSection: React.FC<SearchSectionProps> = ({
  universityName,
  onSearch,
  searchLoading,
  searchError,
  results,
}) => {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState("student")
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, searchType)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleViewProfile = (userId: string) => {
    router.push(`/uniadmin/profile/${searchType}/${userId}`)
  }

  return (
    <motion.div
      className="bg-gray-100 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">
        Search {universityName}
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter name or ID"
          className="p-3 w-full md:w-1/2 border border-gray-600 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-3 w-full md:w-auto border border-gray-600 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="industry">Industry Expert</option>
        </select>
        <button
          onClick={handleSearch}
          className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>

      {/* Search Results */}
      <div className="mt-8">
        {searchLoading && <p className="text-gray-600 text-center">Loading...</p>}
        {searchError && <p className="text-red-500 text-center">{searchError}</p>}
        {!searchLoading && !searchError && results.length === 0 && query.trim() !== "" && (
          <p className="text-gray-600 text-center">No results found. Try a different search term.</p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {results.map((result) => (
              <div
                key={result.userId}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                onClick={() => handleViewProfile(result.userId)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={result.imageData ? `data:image/jpeg;base64,${result.imageData}` : "/placeholder.png"}
                      alt={`${result.firstName} ${result.lastName}`}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
                    />
                    <div className="absolute bottom-3 right-0 bg-blue-500 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center">
                      {searchType === "student" ? <FaGraduationCap /> : <FaUser />}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                    {result.firstName} {result.lastName}
                  </h3>

                  <div className="w-full space-y-2 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaEnvelope className="mr-2 text-gray-500" />
                      <span className="truncate">{result.email}</span>
                    </div>

                    {result.department && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FaBuilding className="mr-2 text-gray-500" />
                        <span>{result.department}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewProfile(result.userId)
                    }}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SearchSection

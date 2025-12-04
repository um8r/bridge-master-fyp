"use client"

import type React from "react"
import { Eye, PlusCircle, FileText, ExternalLink, BookOpen, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface ResearchPaper {
  id: string
  paperName: string
  category: string
  publishChannel: string
  link: string
  otherResearchers: string
  yearOfPublish: number
}

interface ResearchSectionProps {
  researchPapers: ResearchPaper[]
  onSeeMoreResearch: () => void
  onCreateResearchPaper: () => void
}

const ResearchSection: React.FC<ResearchSectionProps> = ({
  researchPapers,
  onSeeMoreResearch,
  onCreateResearchPaper,
}) => {
  return (
    <div className="my-8">
      {/* Research Work Section Header - More compact and sleek */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center p-6 md:p-8 relative z-10">
          <div className="md:w-2/3 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                Research Publications
              </span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl">
              Explore groundbreaking research across various fields. Dive into the innovation that is shaping the future.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onSeeMoreResearch}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
              >
                <Eye className="w-4 h-4 text-blue-500" />
                See All Papers
              </button>
              <button
                onClick={onCreateResearchPaper}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Add Research
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-40 h-40 md:w-48 md:h-48"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
              <img
                src="/Research-Work.png"
                alt="Research Work"
                className="relative z-10 w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Research Papers Display - More modern card design */}
      
    </div>
  )
}

export default ResearchSection;

"use client"

// Clean up imports by organizing them
import { useState, useEffect } from "react"
import type React from "react"
import Image from "next/image"
import { Book, BookOpen, Lightbulb, ArrowRight, Sparkles, Download, Star, ChevronRight, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Improve interface definitions
interface EducationalResource {
  id: string
  title: string
  content: string
  sourceLink: string
  facultyId: string
  facultyName: string
  facultyPost: string
  facultyDepartment: string
  universityId: string
  universityName: string
  universityLocation: string
  imageUrl?: string
  category?: string
  dateAdded?: string
  bookmarked?: boolean
}

// Replace the entire component with this more compact and cleaner version
const EducationalResourcesCard: React.FC<{ goToEducationalResources: () => void }> = ({ goToEducationalResources }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // States for fetched data
  const [resources, setResources] = useState<EducationalResource[]>([])
  const [featuredResources, setFeaturedResources] = useState<EducationalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resourceStats, setResourceStats] = useState({
    total: 0,
    universities: 0,
    faculty: 0,
  })

  // Resource images
  const resourceImages = [
    "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ]

  // Categories for resources
  const categories = [
    { name: "e-books", label: "E-Books", icon: <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" /> },
    { name: "courses", label: "Courses", icon: <Book className="w-5 h-5 text-green-600 mx-auto mb-1" /> },
    { name: "research", label: "Research", icon: <Lightbulb className="w-5 h-5 text-amber-600 mx-auto mb-1" /> },
    { name: "tutorials", label: "Tutorials", icon: <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" /> },
  ]

  // Helper functions
  const assignCategory = (content: string): string => {
    const contentLower = content.toLowerCase()
    if (contentLower.includes("python") || contentLower.includes("java") || contentLower.includes("programming")) {
      return "programming"
    } else if (
      contentLower.includes("data") ||
      contentLower.includes("analytics") ||
      contentLower.includes("statistics")
    ) {
      return "data-science"
    } else if (contentLower.includes("web") || contentLower.includes("html") || contentLower.includes("css")) {
      return "web-development"
    } else if (
      contentLower.includes("ai") ||
      contentLower.includes("machine learning") ||
      contentLower.includes("neural")
    ) {
      return "ai-ml"
    } else if (contentLower.includes("security") || contentLower.includes("cyber") || contentLower.includes("hack")) {
      return "cybersecurity"
    }

    const categories = ["programming", "data-science", "web-development", "ai-ml", "cybersecurity"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  const getImageForCategory = (category: string): string => {
    const placeholderImages = [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
        category: "programming",
      },
      {
        url: "https://images.unsplash.com/photo-1501504901893-7f44a978966d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
        category: "data-science",
      },
      {
        url: "https://images.unsplash.com/photo-1516761497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
        category: "web-development",
      },
      {
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
        category: "ai-ml",
      },
      {
        url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
        category: "cybersecurity",
      },
    ]

    const image = placeholderImages.find((img) => img.category === category)
    return image ? image.url : placeholderImages[0].url
  }

  const getRandomDownloads = () => Math.floor(Math.random() * 2000) + 500
  const getRandomRating = () => (Math.floor(Math.random() * 10) + 40) / 10 // Between 4.0 and 5.0

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("jwtToken")

        if (!token) {
          setResources([])
          setFeaturedResources([])
          setLoading(false)
          return
        }

        const allResourcesResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/get-all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!allResourcesResponse.ok) {
          throw new Error("Failed to fetch educational resources")
        }

        const allResourcesData = await allResourcesResponse.json()

        // Process resources
        const processedResources = allResourcesData.map((resource: EducationalResource) => {
          const category = assignCategory(resource.content)
          return {
            ...resource,
            category,
            imageUrl: getImageForCategory(category),
            dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          }
        })

        setResources(processedResources)
        setFeaturedResources(processedResources.slice(0, 3))

        setResourceStats({
          total: processedResources.length,
          universities: new Set(processedResources.map((r: EducationalResource) => r.universityName)).size,
          faculty: new Set(processedResources.map((r: EducationalResource) => r.facultyName)).size,
        })
      } catch (error) {
        console.error("Error fetching resources:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % resourceImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [resourceImages.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="md:flex">
          {/* Image Section - Made more compact */}
          <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={resourceImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Educational Resources"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-transparent"></div>

            {/* Overlay Content - More compact */}
            <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-1">Educational Resources</h2>
                <p className="text-white/90 mb-3 text-sm">Discover learning materials for your academic journey</p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {loading ? "Loading..." : `${resourceStats.total}+ Resources`}
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">24/7 Access</span>
                </div>
              </motion.div>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-3 flex space-x-1.5">
              {resourceImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Content Section - More compact */}
          <div className="md:w-3/5 p-5">
            {/* Featured Resources */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800 flex items-center">
                  <Sparkles className="h-4 w-4 text-purple-600 mr-1.5" />
                  Featured Resources
                </h3>
                <button className="text-xs text-purple-600 hover:text-purple-800 flex items-center">
                  View all <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {featuredResources.length > 0 ? (
                    featuredResources.map((resource, index) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm">{resource.title}</h4>
                          <div className="flex items-center mt-0.5 text-xs">
                            <span className="text-gray-500 mr-2">{resource.category?.replace("-", " ")}</span>
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-current mr-0.5" />
                              <span>{getRandomRating()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Download className="w-3 h-3 mr-0.5" />
                          <span>{getRandomDownloads()}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-gray-500 text-sm">No featured resources available</div>
                  )}
                </div>
              )}
            </div>

            {/* Resource Categories - More compact */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="p-2 rounded-lg text-center hover:bg-opacity-80 transition-colors cursor-pointer"
                  style={{
                    backgroundColor:
                      category.name === "e-books"
                        ? "rgb(239 246 255)"
                        : category.name === "courses"
                          ? "rgb(240 253 244)"
                          : category.name === "research"
                            ? "rgb(255 251 235)"
                            : "rgb(250 245 255)",
                  }}
                >
                  {category.icon}
                  <span className="text-xs font-medium text-gray-800">{category.label}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Button */}
            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={goToEducationalResources}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg flex items-center justify-center group transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20"
            >
              <span className="text-sm">Explore All Resources</span>
              <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.3 }} className="ml-2">
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EducationalResourcesCard

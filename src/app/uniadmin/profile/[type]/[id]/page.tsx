"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import LoadingSpinner from "../../../components/LoadingSpinner"
import ErrorDisplay from "../../../components/ErrorDisplay"

// User Profile Interface
interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  imageData: string | null
  description: string
  department?: string
  universityName?: string
  universityId?: string
  address?: string
  companyName?: string
  contact?: string
  rollNumber?: string
  skills?: string[]
  post?: string
  uniImage?: string | null
  interest?: string[]
  semester?: string
  course?: string
  enrollmentYear?: string
}

// University Interface
interface UniversityDTO {
  id: string
  name: string
  address: string
  estYear: number
  uniImage: string | null
}

export default function ProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [university, setUniversity] = useState<UniversityDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { type, id } = params as { type: string; id: string }

  useEffect(() => {
    const fetchProfileDetails = async () => {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // Determine the correct API endpoint based on profile type
        let url = ""
        switch (type) {
          case "student":
            url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${id}`
            break
          case "faculty":
            url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${id}`
            break
          case "industry":
            url = `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${id}`
            break
          default:
            throw new Error("Invalid profile type")
        }

        console.log(`Fetching ${type} profile from: ${url}`)

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} profile: ${response.status}`)
        }

        const profileData = await response.json()
        setProfile(profileData)

        // If profile has universityId, fetch university details
        if (profileData.universityId) {
          await fetchUniversityDetails(token, profileData.universityId)
        }
      } catch (err) {
        console.error(`Error fetching ${type} profile:`, err)
        setError(`Failed to load ${type} profile. Please try again.`)
      } finally {
        setLoading(false)
      }
    }

    if (id && type) {
      fetchProfileDetails()
    }
  }, [id, type, router])

  const fetchUniversityDetails = async (token: string, universityId: string) => {
    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-university-by-id/${universityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const universityData = await response.json()
        setUniversity(universityData)
      }
    } catch (err) {
      console.error("Error fetching university details:", err)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith("data:image") ? imageData : `data:image/jpeg;base64,${imageData}`
    }
    return "/placeholder.png"
  }

  const notAvailable = (value: string | undefined) => {
    return value ? value : "Not Available"
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!profile) {
    return <ErrorDisplay error={`No ${type} profile found`} />
  }

  // Use university image as background; if not available, fallback to default
  const backgroundImage = university?.uniImage ? formatImageSrc(university.uniImage) : "/placeholder.png"

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1e1f22] to-[#2a2b30] p-8 text-gray-200 font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-10 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.button
          onClick={handleGoBack}
          className="mb-8 px-4 py-2 bg-purple-700 bg-opacity-30 text-purple-200 rounded-lg flex items-center hover:bg-opacity-50 transition-all"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Search Results
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-purple-300">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-xl text-gray-400 mt-2">{type.charAt(0).toUpperCase() + type.slice(1)} Profile</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Left Panel */}
          <motion.div
            className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={formatImageSrc(profile.imageData) || "/placeholder.svg"}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <AnimatePresence>
              <motion.div
                className="text-center md:text-left space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p className="text-sm text-gray-400">{notAvailable(profile.email)}</p>
                {profile.description && (
                  <p className="text-sm text-gray-400 italic mt-2">{notAvailable(profile.description)}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            className="w-full md:w-2/3 space-y-10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type-specific info */}
              <AnimatePresence>
                {type === "student" && (
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-purple-400 mb-2">Student Details</h2>
                    <p className="text-sm text-gray-300">
                      Roll Number: <span className="font-medium">{notAvailable(profile.rollNumber)}</span>
                    </p>
                    {profile.semester && (
                      <p className="text-sm text-gray-300">
                        Semester: <span className="font-medium">{profile.semester}</span>
                      </p>
                    )}
                    {profile.course && (
                      <p className="text-sm text-gray-300">
                        Course: <span className="font-medium">{profile.course}</span>
                      </p>
                    )}
                    {profile.enrollmentYear && (
                      <p className="text-sm text-gray-300">
                        Enrollment Year: <span className="font-medium">{profile.enrollmentYear}</span>
                      </p>
                    )}
                  </motion.div>
                )}

                {type === "faculty" && (
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-purple-400 mb-2">Faculty Details</h2>
                    <p className="text-sm text-gray-300">
                      Department: <span className="font-medium">{notAvailable(profile.department)}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Post: <span className="font-medium">{notAvailable(profile.post)}</span>
                    </p>

                    {profile.interest && profile.interest.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-300 mb-1">Research Interests:</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interest.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-block bg-purple-700 bg-opacity-30 text-purple-200 py-1 px-2 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {type === "industry" && (
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-purple-400 mb-2">Industry Expert Details</h2>
                    <p className="text-sm text-gray-300">
                      Company: <span className="font-medium">{notAvailable(profile.companyName)}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Contact: <span className="font-medium">{notAvailable(profile.contact)}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* University Info */}
              {university && (
                <AnimatePresence>
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-blue-300 mb-2">University</h2>
                    <p className="text-sm text-gray-300">
                      Name: <span className="font-medium">{university.name}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Address: <span className="font-medium">{university.address || "N/A"}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Established Year: <span className="font-medium">{university.estYear || "N/A"}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}

              {profile.address && (
                <AnimatePresence>
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-pink-300 mb-2">Address</h2>
                    <p className="text-sm text-gray-300">{notAvailable(profile.address)}</p>
                  </motion.div>
                </AnimatePresence>
              )}

              {profile.contact && (
                <AnimatePresence>
                  <motion.div
                    className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-purple-500 transition"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-lg font-bold text-green-300 mb-2">Contact</h2>
                    <p className="text-sm text-gray-300">{notAvailable(profile.contact)}</p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-purple-300 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="inline-block bg-purple-700 bg-opacity-30 text-purple-200 py-1 px-3 rounded-full shadow-sm text-sm font-medium"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.5)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* University Image */}
            {university && university.uniImage && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-green-300 mb-4">University Image</h2>
                <motion.div
                  className="bg-[#2a2b30] rounded-xl p-6 shadow-md border border-gray-700 hover:border-green-500 transition flex flex-col items-center"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(34, 197, 94, 0.4)" }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={formatImageSrc(university.uniImage) || "/placeholder.svg"}
                    alt={`${university.name} Logo`}
                    className="w-32 h-auto object-contain"
                  />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

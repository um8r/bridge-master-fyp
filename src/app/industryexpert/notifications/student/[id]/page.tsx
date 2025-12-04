"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { ArrowLeft, User, Mail, MapPin, FileText, GraduationCap, Building, Calendar, Code, Phone } from "lucide-react"

interface StudentDetails {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  skills: string[]
  description: string
  department: string
  imageData?: Uint8Array
  universityName: string
  universityId?: string
  address: string
  rollNumber: string
  phoneNumber?: string
  semester?: string
  cgpa?: number
}

interface University {
  id: string
  name: string
  address: string
  estYear: number
  uniImage?: Uint8Array
}

interface Project {
  id: string
  title: string
  description: string
  stack: string
  status: string
}

export default function StudentDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [university, setUniversity] = useState<University | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [studentImageUrl, setStudentImageUrl] = useState<string | null>(null)
  const [universityImageUrl, setUniversityImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      try {
        // First try to fetch by userId
        let response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // If that fails, try by studentId
        if (!response.ok) {
          response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-student-id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }

        if (!response.ok) {
          throw new Error("Failed to fetch student details")
        }

        const data = await response.json()

        setStudent({
          id: data.id,
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          skills: data.skills || [],
          description: data.description || "No description available",
          department: data.department || "Not specified",
          imageData: data.imageData,
          universityName: data.universityName || "Not specified",
          universityId: data.universityId,
          address: data.address || "Not specified",
          rollNumber: data.rollNumber || "Not specified",
          phoneNumber: data.phoneNumber || "Not available",
          semester: data.semester || "Not specified",
          cgpa: data.cgpa || null,
        })

        // Convert student image data to URL if available
        if (data.imageData && data.imageData.length > 0) {
          const blob = new Blob([new Uint8Array(data.imageData)], { type: "image/jpeg" })
          const url = URL.createObjectURL(blob)
          setStudentImageUrl(url)
        }

        // Fetch university details if universityId is available
        if (data.universityId) {
          await fetchUniversityDetails(data.universityId)
        }

        // Fetch student projects
        await fetchStudentProjects(data.id)
      } catch (err: any) {
        console.error("Error fetching student details:", err)
        setError(err.message || "Failed to load student details")
        toast.error(err.message || "Failed to load student details")
      } finally {
        setLoading(false)
      }
    }

    const fetchUniversityDetails = async (universityId: string) => {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-university-by-id/${universityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("Failed to fetch university details")
          return
        }

        const data = await response.json()
        setUniversity({
          id: data.id,
          name: data.name,
          address: data.address,
          estYear: data.estYear,
          uniImage: data.uniImage,
        })

        // Convert university image data to URL if available
        if (data.uniImage && data.uniImage.length > 0) {
          const blob = new Blob([new Uint8Array(data.uniImage)], { type: "image/jpeg" })
          const url = URL.createObjectURL(blob)
          setUniversityImageUrl(url)
        }
      } catch (err) {
        console.error("Error fetching university details:", err)
      }
    }

    const fetchStudentProjects = async (studentId: string) => {
      const token = localStorage.getItem("jwtToken")
      if (!token) return

      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/get-student-projects-by-id/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("Failed to fetch student projects")
          return
        }

        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error("Error fetching student projects:", err)
      }
    }

    if (id) {
      fetchStudentDetails()
    }
  }, [id, router])

  // Clean up image URLs when component unmounts
  useEffect(() => {
    return () => {
      if (studentImageUrl) {
        URL.revokeObjectURL(studentImageUrl)
      }
      if (universityImageUrl) {
        URL.revokeObjectURL(universityImageUrl)
      }
    }
  }, [studentImageUrl, universityImageUrl])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading student details...</p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error || "Failed to load student details"}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/industryexpert/notifications"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Notifications
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/industryexpert/notifications"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notifications
          </Link>

          <h1 className="text-3xl font-bold text-gray-800">Student Profile</h1>
          <p className="text-gray-600 mt-2">
            Viewing details for {student.firstName} {student.lastName}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 text-center">
                {studentImageUrl ? (
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={studentImageUrl || "/placeholder.svg"}
                      alt={`${student.firstName} ${student.lastName}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-16 w-16 text-blue-500" />
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-800">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{student.department}</p>
                <p className="text-blue-600 mt-1">{student.universityName}</p>
                {student.cgpa && (
                  <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    CGPA: {student.cgpa.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-800">{student.email}</span>
                  </div>
                  {student.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-gray-800">{student.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-800">Roll #: {student.rollNumber}</span>
                  </div>
                  {student.semester && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-gray-800">Semester: {student.semester}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-800">{student.address}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => toast.info("Contact functionality will be implemented soon!")}
              className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Student
            </motion.button>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
              </div>
              <div className="p-6">
                {student.skills && student.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">About</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-line">{student.description}</p>
              </div>
            </motion.div>

            {/* University Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">University</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {universityImageUrl ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={universityImageUrl || "/placeholder.svg"}
                        alt={university?.name || student.universityName}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Building className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">{university?.name || student.universityName}</h3>
                    <p className="text-gray-600 mt-1">{university?.address || student.address}</p>
                    {university?.estYear && (
                      <p className="text-gray-500 text-sm mt-2">Established: {university.estYear}</p>
                    )}
                    <div className="mt-3">
                      <p className="text-gray-700">
                        <span className="font-medium">Department:</span> {student.department}
                      </p>
                      {student.semester && (
                        <p className="text-gray-700">
                          <span className="font-medium">Semester:</span> {student.semester}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
              </div>
              <div className="p-6">
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div
                        key={project.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                        <div className="flex items-center mt-3">
                          <Code className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600 text-sm">{project.stack}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No projects found for this student.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href={`/industryexpert/notifications`}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Notifications
              </Link>

              <button
                onClick={() => router.push(`/industryexpert/student-projects/${student.id}`)}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                View All Projects
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

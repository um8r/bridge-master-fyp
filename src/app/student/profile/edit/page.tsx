"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { User, Pencil, Save, School } from "lucide-react"

interface StudentData {
  firstName: string
  lastName: string
  rollNumber: string
  description: string
}

const UpdateStudentPage: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    rollNumber: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [studentId, setStudentId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentData() {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("User not authenticated. Redirecting to login.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
        return
      }

      try {
        // Fetch authenticated user info
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId
          setUserId(userId)

          // Fetch student-specific data
          const studentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-id/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (studentResponse.ok) {
            const data = await studentResponse.json()
            setStudentId(data.id)
            setStudentData({
              firstName: data.firstName,
              lastName: data.lastName,
              rollNumber: data.rollNumber,
              description: data.description || "",
            })
          } else {
            toast.error("Failed to load student data.", {
              position: "top-center",
              autoClose: 3000,
            })
          }
        } else {
          toast.error("Failed to fetch user profile.", {
            position: "top-center",
            autoClose: 3000,
          })
        }
      } catch (error) {
        toast.error("An error occurred while fetching profile data.", {
          position: "top-center",
          autoClose: 3000,
        })
      }
    }

    fetchStudentData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStudentData({ ...studentData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!studentId || !userId) {
      toast.error("User ID not found. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      })
      setLoading(false)
      return
    }

    const token = localStorage.getItem("jwtToken")
    try {
      // Update student basic info
      const updateStudentResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/students/update-student/${studentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          rollNumber: studentData.rollNumber,
        }),
      })

      // Update user description
      const updateDescriptionResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/update-user-data/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: studentData.description,
            Firstname: studentData.firstName,
            Lastname: studentData.lastName,
          }),
        },
      )

      if (updateStudentResponse.ok && updateDescriptionResponse.ok) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/student/profile")
      } else {
        toast.error("Failed to update profile.", {
          position: "top-center",
          autoClose: 3000,
        })
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Edit Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Update your personal information and profile details</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-sky-100 to-indigo-100 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Pencil className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={studentData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={studentData.lastName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    value={studentData.rollNumber}
                    onChange={handleInputChange}
                    className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">About Me</label>
                <textarea
                  name="description"
                  value={studentData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Tell us something about yourself..."
                />
                <p className="mt-1 text-xs text-gray-500">Brief description for your profile. URLs are hyperlinked.</p>
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/student/profile")}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default UpdateStudentPage

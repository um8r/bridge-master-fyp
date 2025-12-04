"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import { ArrowLeft, Lightbulb, Code, FileText, User, Mail, Building, ChevronRight } from "lucide-react"

interface IdeaDetails {
  id: string
  title: string
  technology: string
  description: string
  facultyName: string
  email: string
  uniName: string
}

const IdeaDetailsPage = ({ params }: { params: { id: string } }) => {
  const [idea, setIdea] = useState<IdeaDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const ideaId = params.id // Access the `id` from `params`

    if (!ideaId) {
      toast.error("Invalid idea ID provided.", {
        position: "top-center",
        autoClose: 3000,
      })
      router.push("/faculty/idea") // Redirect if `id` is missing
      return
    }

    const fetchIdeaDetails = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("Please log in to access this page.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
        return
      }

      try {
        const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/ideas/get-idea-by-id/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch idea details: ${errorText}`)
        }

        const data: IdeaDetails[] = await response.json()

        // Ensure valid response
        if (data && data.length > 0) {
          setIdea(data[0]) // Only set the first element (idea details)
        } else {
          throw new Error("Idea not found. Please verify the idea ID.")
        }
      } catch (error: unknown) {
        // Handle errors gracefully
        if (error instanceof Error) {
          toast.error(error.message, {
            position: "top-center",
            autoClose: 3000,
          })
        } else {
          toast.error("An unexpected error occurred.", {
            position: "top-center",
            autoClose: 3000,
          })
        }
        router.push("/faculty/idea")
      } finally {
        setLoading(false)
      }
    }

    fetchIdeaDetails()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading idea details...</p>
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Idea Not Found</h2>
          <p className="text-gray-600 mb-6">The idea you re looking for doesnot exist or has been removed.</p>
          <button
            onClick={() => router.push("/faculty/idea")}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Ideas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.push("/faculty/idea")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Ideas</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{idea.title}</h1>
                <div className="flex items-center mt-2">
                  <Code className="h-4 w-4 text-blue-100 mr-1" />
                  <span className="text-blue-100 text-sm">{idea.technology}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                Project Description
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">{idea.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <User className="h-5 w-5 text-blue-500 mr-2" />
                  Faculty Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start mb-3">
                    <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Faculty Name</p>
                      <p className="text-gray-800 font-medium">{idea.facultyName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-blue-600 hover:text-blue-800 transition-colors">
                        <a href={`mailto:${idea.email}`}>{idea.email}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* University Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Building className="h-5 w-5 text-blue-500 mr-2" />
                  University
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Institution</p>
                      <p className="text-gray-800 font-medium">{idea.uniName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Contact Faculty
              </button>
              <button className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow transition flex items-center justify-center">
                <ChevronRight className="mr-2 h-4 w-4" />
                View Similar Ideas
              </button>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">How to Apply</h2>
          <p className="text-gray-700">
            If you are interested in this project idea, you can contact the faculty member directly via email. Be sure to
            mention the project title and your qualifications.
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Tip:</span> Prepare a brief proposal outlining how you would approach this
              project before contacting the faculty member.
            </p>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default IdeaDetailsPage

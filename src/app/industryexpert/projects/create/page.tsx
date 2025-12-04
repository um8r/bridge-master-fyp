"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaRocket, FaUsers, FaCode, FaCalendarAlt } from "react-icons/fa"

const PostProjectForm: React.FC = () => {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [budget, setBudget] = useState<number | null>(null)
  const [indExpertId, setIndExpertId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()

  // Fetch the IndExptId when the user logs in
  useEffect(() => {
    const fetchIndExpertId = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("You must be logged in to post a project.")
        return
      }

      try {
        // Fetch authorized user profile
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          const userId = profileData.userId // Ensure we have the userId from the profile

          // Fetch the IndExptId using the userId
          const expertResponse = await fetch(
            `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          if (expertResponse.ok) {
            const expertData = await expertResponse.json()
            console.log("Fetched Expert Data:", expertData)

            // Ensure the response contains the IndExptId
            if (expertData.indExptId) {
              setIndExpertId(expertData.indExptId) // Store the fetched IndExptId
            } else {
              toast.error("Unable to fetch your expert ID.")
            }
          } else {
            toast.error("Failed to fetch expert data.")
          }
        } else {
          toast.error("Failed to fetch user profile.")
        }
      } catch (error) {
        console.error("Error fetching expert data:", error)
        toast.error("An error occurred while fetching expert data.")
      }
    }

    fetchIndExpertId()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input fields
    if (!title || !description || !endDate || budget === null) {
      toast.error("Please fill in all the required fields")
      return
    }

    if (!indExpertId) {
      toast.error("Unable to fetch your expert ID.")
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        toast.error("You must be logged in to post a project.")
        setIsSubmitting(false)
        return
      }

      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/projects/expert-post-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Authorization header
        },
        body: JSON.stringify({
          Title: title,
          Description: description,
          EndDate: endDate,
          IndExpertId: indExpertId, // Use the fetched IndExptId from state
          Budget: budget, // Include the budget
        }),
      })

      if (response.ok) {
        toast.success("Project posted successfully!")
        setTimeout(() => {
          router.push("/industryexpert/projects") // Redirect after successful project posting
        }, 2000)
      } else {
        const errorText = await response.text()
        toast.error(`Failed to post the project: ${errorText}`)
      }
    } catch (error) {
      console.error("Error posting the project:", error)
      toast.error("Error occurred while posting the project")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl p-8 bg-white rounded-3xl shadow-lg relative z-10"
      >
        <div className="absolute top-6 left-6 z-10 flex items-center space-x-4">
          {/* Logo container */}
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <Image
              src="/logo.jpg"
              alt="BridgeIT Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-full bg-white p-2 border border-gray-200"
            />
          </div>
          {/* Text container */}
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 tracking-wide leading-tight">BridgeIT</h1>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Post a New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
              <input
                type="number"
                value={budget ?? ""}
                onChange={(e) => setBudget(Number.parseFloat(e.target.value))}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter project budget"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Describe the project"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="End Date"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Post Project"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 text-blue-300 opacity-20">
        <FaRocket size={100} />
      </div>
      <div className="absolute bottom-20 left-10 text-purple-300 opacity-20">
        <FaCode size={100} />
      </div>
      <div className="absolute top-1/2 left-5 text-green-300 opacity-20">
        <FaUsers size={80} />
      </div>
      <div className="absolute bottom-10 right-20 text-yellow-300 opacity-20">
        <FaCalendarAlt size={80} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  )
}

export default PostProjectForm

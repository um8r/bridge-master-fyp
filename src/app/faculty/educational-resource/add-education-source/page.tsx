"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const AddEducationalResource = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sourceLink: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/auth/login-user")
        return
      }

      // First get the faculty ID
      const profileResponse = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const profileData = await profileResponse.json()
      const userId = profileData.userId

      // Get faculty details
      const facultyResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-id/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!facultyResponse.ok) {
        throw new Error("Failed to fetch faculty details")
      }

      const facultyData = await facultyResponse.json()
      const facultyId = facultyData.id

      // Add the educational resource
      const response = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/educational-resources/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            sourceLink: formData.sourceLink,
            facultyId: facultyId,
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to add educational resource")
      }

      toast.success("Educational resource added successfully!")

      // Reset form
      setFormData({
        title: "",
        content: "",
        sourceLink: "",
      })

      // Redirect to manage resources page after 2 seconds
      setTimeout(() => {
        router.push("/faculty/manage-educational-resources")
      }, 2000)
    } catch (error) {
      console.error("Error adding educational resource:", error)
      toast.error(`Failed to add resource: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Add Educational Resource</h1>

        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter resource title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter resource content or description"
              />
            </div>

            <div>
              <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-700 mb-1">
                Source Link (Optional)
              </label>
              <input
                type="url"
                id="sourceLink"
                name="sourceLink"
                value={formData.sourceLink}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/resource"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push("/faculty/manage-educational-resources")}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Add Resource"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="light" />
    </div>
  )
}

export default AddEducationalResource

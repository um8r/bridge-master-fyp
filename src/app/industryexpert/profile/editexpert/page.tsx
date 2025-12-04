"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { User, Building, Phone, MapPin, FileText, Save, ArrowLeft } from "lucide-react"

interface IndustryExpertProfile {
  userId: string
  firstName: string
  lastName: string
  email: string
  companyName: string
  address: string
  contact: string
  description: string
}

const EditIndustryExpertProfile: React.FC = () => {
  const [profile, setProfile] = useState<IndustryExpertProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    address: "",
    contact: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken")
      if (!token) {
        router.push("/unauthorized")
        return
      }

      try {
        const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user info")
        }

        const { userId } = await response.json()

        const profileResponse = await fetch(
          `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-id/${userId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await profileResponse.json()

        setProfile({
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          companyName: data.companyName || "",
          address: data.address || "",
          contact: data.contact || "",
          description: data.description || "",
        })
      } catch (error) {
        toast.error("An error occurred while fetching profile.")
        router.push("/unauthorized")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile({ ...profile, [name]: value })
  }

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      toast.error("You must be logged in.")
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/update-user-data/${profile.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Firstname: profile.firstName,
          Lastname: profile.lastName,
          description: profile.description,
        }),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        router.push("/industryexpert/profile")
      } else {
        toast.error("Failed to update profile.")
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/industryexpert/profile")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="mt-2 text-blue-100">Update your professional information and expertise</p>
          </div>

          <div className="p-6 md:p-8">
            <form className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-500" />
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={profile.contact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Description Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Description
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your expertise and professional background
                  </label>
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={5}
                    placeholder="Share your professional experience, expertise, and the types of projects you're interested in..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/industryexpert/profile")}
                  className="py-3 px-6 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition duration-200 flex-1 flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm flex-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default EditIndustryExpertProfile

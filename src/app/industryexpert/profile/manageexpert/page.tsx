"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ArrowLeft, Lock, Upload, Eye, EyeOff, User, Shield } from "lucide-react"

const IndustryExpertProfileManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [imageData, setImageData] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false)
  const [isSubmittingImage, setIsSubmittingImage] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      router.push("/auth/login-user")
      return
    }

    async function fetchUserProfile() {
      try {
        const profileResponse = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setUserId(profileData.userId)
        } else {
          toast.error("Failed to fetch user profile.", {
            position: "top-center",
            autoClose: 3000,
          })
          router.push("/auth/login-user")
        }
      } catch (error) {
        toast.error("An error occurred while fetching the user profile.", {
          position: "top-center",
          autoClose: 3000,
        })
        router.push("/auth/login-user")
      }
    }

    fetchUserProfile()
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setIsSubmittingPassword(true)

    try {
      const confirmResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/confirm-current-password/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentPassword),
        },
      )

      if (!confirmResponse.ok) {
        toast.error("Current password is incorrect.")
        setIsSubmittingPassword(false)
        return
      }

      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/change-password/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPassword),
      })

      if (response.ok) {
        toast.success("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
      } else {
        toast.error("Failed to change password.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageData(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !imageData) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

    setIsSubmittingImage(true)

    try {
      const base64Image = imageData.split(",")[1] // Ensure we send only the base64 part
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/set-profile-image/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(base64Image),
      })

      if (response.ok) {
        toast.success("Profile image updated successfully!")
      } else {
        toast.error("Failed to update profile image.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsSubmittingImage(false)
    }
  }

  const goBack = () => {
    router.push("/industryexpert/profile")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <button onClick={goBack} className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Profile Management</h1>
            <p className="mt-2 text-blue-100">Update your password and profile image</p>
          </div>

          <div className="p-6 md:p-8">
            {/* Password Change Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Use a strong password with at least 8 characters including letters, numbers, and symbols.
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPassword ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Image Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Image
              </h2>

              <form onSubmit={handleImageUpload} className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-2/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                    <div className="mt-1 flex items-center">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="w-8 h-8" />
                        <span className="mt-2 text-base leading-normal">Select a file</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      JPG, PNG or GIF files up to 5MB. A square image works best.
                    </p>
                  </div>

                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                      {imageData ? (
                        <img
                          src={imageData || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!imageData || isSubmittingImage}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmittingImage ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Image
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default IndustryExpertProfileManagement

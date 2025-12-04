"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useUser } from "../../../contexts/UserContext"
import { Lock, Upload, Eye, EyeOff, Camera, User, Shield } from "lucide-react"

const ProfileManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [imageData, setImageData] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("password")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [originalFileSize, setOriginalFileSize] = useState<number | null>(null)
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(null)
  const router = useRouter()
  const { updateProfileImage } = useUser()

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

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.")
      return
    }

    const token = localStorage.getItem("jwtToken")
    if (!token) return

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
        setConfirmPassword("")
      } else {
        toast.error("Failed to change password.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    }
  }

  // Function to compress image
  const compressImage = (imageDataUrl: string, maxSizeKB = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsCompressing(true)
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // If image is very large, scale it down
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width
          width = MAX_WIDTH
        }

        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height
          height = MAX_HEIGHT
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setIsCompressing(false)
          reject("Could not get canvas context")
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Try different quality levels until file size is under maxSizeKB
        const tryCompression = (quality: number) => {
          const dataUrl = canvas.toDataURL("image/jpeg", quality)

          // Calculate size in KB
          const base64 = dataUrl.split(",")[1]
          const sizeKB = Math.round((base64.length * 3) / 4 / 1024)

          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            setIsCompressing(false)
            resolve(dataUrl)
          } else {
            // Try with lower quality
            setTimeout(() => {
              tryCompression(quality - 0.1)
            }, 0)
          }
        }

        // Start with quality 0.7
        tryCompression(0.7)
      }

      img.onerror = () => {
        setIsCompressing(false)
        reject("Error loading image")
      }

      img.src = imageDataUrl
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Read the file as data URL
    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageDataUrl = reader.result as string

      // Calculate original file size in KB
      const originalSize = Math.round(file.size / 1024)
      setOriginalFileSize(originalSize)

      // If file is already small enough, use it directly
      if (originalSize <= 200) {
        setImageData(imageDataUrl)
        setCompressedFileSize(originalSize)
        return
      }

      // Otherwise compress the image
      try {
        toast.info("Compressing image to under 200KB...")
        const compressedImage = await compressImage(imageDataUrl)
        setImageData(compressedImage)

        // Calculate compressed size
        const base64 = compressedImage.split(",")[1]
        const compressedSize = Math.round((base64.length * 3) / 4 / 1024)
        setCompressedFileSize(compressedSize)
        toast.success(`Image compressed from ${originalSize}KB to ${compressedSize}KB`)
      } catch (error) {
        toast.error("Error compressing image. Please try another image.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !imageData) return

    const token = localStorage.getItem("jwtToken")
    if (!token) return

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
        // Update the image in context so it reflects across the app
        updateProfileImage(base64Image)
        // Reset state
        setImageData("")
        setOriginalFileSize(null)
        setCompressedFileSize(null)
      } else {
        toast.error("Failed to update profile image.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-600">Account Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account preferences and security</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2"></div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === "password"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === "image"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b-2"
              }`}
            >
              <Camera className="w-4 h-4 mr-2" />
              Update Profile Image
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {activeTab === "password" && (
              <div className="space-y-6">
                <div className="bg-teal-50 rounded-lg p-4 flex items-start">
                  <Shield className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-teal-800">
                    Strong passwords use a combination of letters, numbers, and special characters. For best security,
                    use a unique password that you donot use elsewhere.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md shadow-sm transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-6">
                <div className="bg-teal-50 rounded-lg p-4 flex items-start">
                  <Camera className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-teal-800">
                    Upload a clear photo of yourself to personalize your profile. Large images will be automatically
                    compressed to optimize loading times.
                  </p>
                </div>

                <form onSubmit={handleImageUpload} className="space-y-6">
                  {!imageData && (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-400 transition-colors">
                      <div className="space-y-2 text-center">
                        <div className="mx-auto h-24 w-24 rounded-full flex items-center justify-center bg-teal-50 text-teal-500">
                          <User className="h-12 w-12" />
                        </div>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none"
                          >
                            <span>Upload a photo</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                              disabled={isCompressing}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB (will be compressed to under 200KB)
                        </p>
                      </div>
                    </div>
                  )}

                  {isCompressing && (
                    <div className="text-center py-6">
                      <div className="inline-block h-12 w-12 relative">
                        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-teal-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-700">Optimizing your image...</p>
                    </div>
                  )}

                  {imageData && !isCompressing && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={imageData || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {originalFileSize && compressedFileSize && (
                        <div className="bg-white rounded-lg shadow-sm p-3 text-sm text-center max-w-xs">
                          {originalFileSize > 200 ? (
                            <>
                              <p className="font-medium text-gray-900">Image Optimized</p>
                              <div className="mt-1 flex items-center justify-center space-x-2">
                                <span className="text-gray-500">{originalFileSize}KB</span>
                                <svg
                                  width="24"
                                  height="8"
                                  viewBox="0 0 24 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z"
                                    fill="#9CA3AF"
                                  />
                                </svg>
                                <span className="text-gray-900 font-medium">{compressedFileSize}KB</span>
                              </div>
                              <p className="mt-1 text-green-600 font-medium">
                                {Math.round((1 - compressedFileSize / originalFileSize) * 100)}% reduction
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900">Image Ready</p>
                              <p className="text-gray-500 mt-1">Size: {compressedFileSize}KB (no compression needed)</p>
                            </>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setImageData("")
                          setOriginalFileSize(null)
                          setCompressedFileSize(null)
                        }}
                        className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                      >
                        Choose a different image
                      </button>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!imageData || isCompressing}
                      className={`w-full flex justify-center items-center py-3 px-4 font-medium rounded-md shadow-sm transition-colors ${
                        !imageData || isCompressing
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-teal-600 hover:bg-teal-700 text-white"
                      }`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isCompressing ? "Processing..." : "Upload Profile Image"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            ← Back to previous page
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProfileManagement

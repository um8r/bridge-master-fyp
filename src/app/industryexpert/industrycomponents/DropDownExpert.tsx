"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { FaChevronDown, FaUserEdit, FaSignOutAlt, FaImage, FaLock } from "react-icons/fa"

interface ProfileDropdownProps {
  userProfile: {
    userId: string
    firstName: string
    lastName: string
    role: string
    imageData: string
  }
  onLogoutClick: () => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile, onLogoutClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  const handleEditProfile = () => {
    if (userProfile.role === "Faculty") {
      router.push("/faculty/profile/editfaculty")
    } else if (userProfile.role === "IndustryExpert") {
      router.push("/industryexpert/profile/editexpert")
    } else {
      router.push("/student/profile/edit")
    }
    setDropdownOpen(false)
  }

  const handleViewProfile = () => {
    if (userProfile.role === "Faculty") {
      router.push("/faculty/profile")
    } else if (userProfile.role === "IndustryExpert") {
      router.push("/industryexpert/profile")
    } else {
      router.push("/student/profile")
    }
    setDropdownOpen(false)
  }

  const updateImage = () => {
    if (userProfile.role === "Faculty") {
      router.push("/faculty/profile/management")
    } else if (userProfile.role === "IndustryExpert") {
      router.push("/industryexpert/profile/manageexpert")
    } else {
      router.push("/student/profile/management")
    }
    setDropdownOpen(false)
  }

  const updatePassword = () => {
    if (userProfile.role === "Faculty") {
      router.push("/faculty/profile/editfaculty")
    } else if (userProfile.role === "IndustryExpert") {
      router.push("/industryexpert/profile/manageexpert")
    } else {
      router.push("/student/profile/edit")
    }
    setDropdownOpen(false)
  }

  const handleLogoutClickLocal = () => {
    setDropdownOpen(false)
    onLogoutClick()
  }

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
        <img
          src={`data:image/jpeg;base64,${userProfile.imageData}`}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />
        
        <FaChevronDown className="ml-2 text-gray-600 hover:text-blue-600 transition duration-300" />
      </button>
      {dropdownOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
              <p className="text-sm font-medium text-gray-800">
                {userProfile.firstName} {userProfile.lastName}
              </p>
            </div>

            <button
              onClick={handleViewProfile}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
            >
              <FaUserEdit className="mr-2" /> View Profile
            </button>

            <button
              onClick={handleEditProfile}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
            >
              <FaUserEdit className="mr-2" /> Edit Profile
            </button>

            <button
              onClick={updateImage}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
            >
              <FaImage className="mr-2" /> Upload Image
            </button>

            <button
              onClick={updatePassword}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-300"
            >
              <FaLock className="mr-2" /> Update Password
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Beautified Logout Button */}
            <button
              onClick={handleLogoutClickLocal}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-gray-100 transition duration-300 rounded-b-md"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown

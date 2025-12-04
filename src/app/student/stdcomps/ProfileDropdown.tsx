"use client"
import type React from "react"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  role: string
  imageData: string
}

interface ProfileDropdownProps {
  userProfile: UserProfile
  onLogoutClick: () => void
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile, onLogoutClick }) => {
  const router = useRouter()

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 hover:text-blue-600 rounded-md transition duration-300">
          <span>Account</span>
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {userProfile.firstName} {userProfile.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{userProfile.role}</p>
          </div>

          {/* Menu Items */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/student/profile")}
                className={`${active ? "bg-gray-100" : ""} flex w-full px-4 py-2 text-sm text-gray-700 text-left`}
              >
                View Profile
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/student/profile/edit")}
                className={`${active ? "bg-gray-100" : ""} flex w-full px-4 py-2 text-sm text-gray-700 text-left`}
              >
                Edit Profile
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/student/profile/management")}
                className={`${active ? "bg-gray-100" : ""} flex w-full px-4 py-2 text-sm text-gray-700 text-left`}
              >
                Account Settings
              </button>
            )}
          </Menu.Item>

          <div className="border-t border-gray-200 my-1"></div>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogoutClick}
                className={`${active ? "bg-gray-100" : ""} flex w-full px-4 py-2 text-sm text-gray-700 text-left`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ProfileDropdown


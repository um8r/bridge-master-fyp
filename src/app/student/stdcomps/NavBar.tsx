"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { Fragment, useEffect, useState } from "react"
import { Transition, Dialog, Menu } from "@headlessui/react"
import {
  User,
  ChevronDown,
  MenuIcon,
  X,
  LogOut,
  Home,
  Briefcase,
  UserCircle,
  Lightbulb,
  BookOpen,
  Bell,
} from "lucide-react"

interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  role: string
  imageData: string
}

interface NavBarProps {
  userProfile: UserProfile
  onLogout: () => void
}

interface NavLink {
  name: string
  href: string
  icon: React.ElementType
  children?: NavLink[]
}

const NavBar: React.FC<NavBarProps> = ({ userProfile, onLogout }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // Define navigation links with icons
  const navigationLinks: NavLink[] = [
    { name: "Home", href: "/student", icon: Home },
    {
      name: "Projects",
      href: "#",
      icon: Briefcase,
      children: [
        { name: "My Projects", href: "/student/projects", icon: Briefcase },
        { name: "Explore Projects", href: "/student/projects/explore-projects", icon: Briefcase },
        { name: "Create", href: "/student/projects/create", icon: Briefcase },
        { name: "History", href: "/student/projects/history", icon: Briefcase },
      ],
    },
    {
      name: "Profile",
      href: "#",
      icon: UserCircle,
      children: [
        { name: "View", href: "/student/profile", icon: UserCircle },
        { name: "Edit", href: "/student/profile/edit", icon: UserCircle },
        { name: "Settings", href: "/student/profile/management", icon: UserCircle },
      ],
    },
   
   
    {
      name: "Notifications",
      href: "/student/std_notifications",
      icon: Bell,
    },
  ]

  // Function to determine if a link is active
  const isActiveLink = (link: NavLink): boolean => {
    if (link.href === "#" && link.children) {
      return link.children.some((child) => pathname.startsWith(child.href))
    }
    return pathname === link.href || pathname.startsWith(link.href)
  }

  // Logout handlers
  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false)
    onLogout()
  }

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand/Title */}
          <div className="flex items-center">
            <Link href="/student" className="text-gray-800 text-lg font-semibold flex items-center">
              <span className="bg-gray-800 text-white p-1.5 rounded-md mr-2"></span>
              Student Portal
            </Link>
          </div>

          {/* Middle Section: Desktop Navigation Links */}
          <div className="hidden md:flex md:space-x-1 md:items-center">
            {navigationLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.children ? (
                  // Dropdown Menu for Links with Children
                  <Menu as="div" className="relative">
                    <Menu.Button
                      className={`flex items-center px-3 py-2 text-sm font-medium transition duration-300 ${
                        isActiveLink(link) ? "text-gray-800 font-semibold" : "text-gray-600 hover:text-gray-800"
                      }`}
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <link.icon className="w-4 h-4 mr-1" />
                      {link.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Menu.Items className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 border border-gray-100">
                        {link.children.map((child) => (
                          <Menu.Item key={child.name}>
                            {() => (
                              <Link
                                href={child.href}
                                className={`block px-4 py-2 text-sm ${
                                  isActiveLink(child)
                                    ? "text-gray-800 font-semibold bg-gray-50"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                              >
                                <div className="flex items-center">
                                  <child.icon className="w-4 h-4 mr-2" />
                                  {child.name}
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  // Single Link
                  <Link
                    href={link.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium transition duration-300 ${
                      isActiveLink(link) ? "text-gray-800 font-semibold" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <link.icon className="w-4 h-4 mr-1" />
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Section: User Name and Avatar */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {userProfile.firstName} {userProfile.lastName}
              </span>
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center">
                  {userProfile.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${userProfile.imageData}`}
                      alt={`${userProfile.firstName} ${userProfile.lastName}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 border border-gray-100">
                    <Menu.Item>
                      {() => (
                        <Link
                          href="/student/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <UserCircle className="w-4 h-4 mr-2" />
                            View Profile
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {() => (
                        <Link
                          href="/student/profile/edit"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <UserCircle className="w-4 h-4 mr-2" />
                            Edit Profile
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {() => (
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              aria-label="Open Menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setMobileMenuOpen(false)}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-75"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* Sliding Panel */}
          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                {/* Close Button */}
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Menu"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="pt-5 pb-4 overflow-y-auto">
                  {/* Brand */}
                  <div className="flex items-center px-4 border-b border-gray-100 pb-4">
                    <Link href="/student" className="text-gray-800 text-lg font-semibold flex items-center">
                      <span className="bg-gray-800 text-white p-1.5 rounded-md mr-2">SP</span>
                      Student Portal
                    </Link>
                  </div>

                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      {userProfile.imageData ? (
                        <img
                          src={`data:image/jpeg;base64,${userProfile.imageData}`}
                          alt={`${userProfile.firstName} ${userProfile.lastName}`}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {userProfile.firstName} {userProfile.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{userProfile.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="mt-4 px-2 space-y-1">
                    {navigationLinks.map((link) => (
                      <div key={link.name}>
                        {link.children ? (
                          // Collapsible Submenu
                          <MobileSubMenu link={link} />
                        ) : (
                          // Single Link
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                              isActiveLink(link)
                                ? "text-gray-800 bg-gray-50"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                          >
                            <link.icon className="w-5 h-5 mr-3 text-gray-500" />
                            {link.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Logout Button */}
                <div className="px-4 py-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogoutClick()
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition duration-300"
                  >
                    <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>

            {/* Clickable Area to Close Menu */}
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={isLogoutDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCancelLogout}>
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg transform transition-all">
                  {/* Header */}
                  <Dialog.Title className="text-xl font-semibold text-gray-800">Confirm Logout</Dialog.Title>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to log out? You will need to log back in to access your account.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-md transition"
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </nav>
  )
}

// Mobile SubMenu Component
const MobileSubMenu: React.FC<{ link: NavLink }> = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActiveLink = (child: NavLink): boolean => {
    return pathname.startsWith(child.href)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
          link.children?.some((child) => isActiveLink(child))
            ? "text-gray-800 bg-gray-50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <link.icon className="w-5 h-5 mr-3 text-gray-500" />
          <span>{link.name}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="pl-10 mt-1 space-y-1 border-l border-gray-100 ml-3">
          {link.children?.map((child) => (
            <Link
              key={child.name}
              href={child.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                isActiveLink(child) ? "text-gray-800 bg-gray-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <child.icon className="w-4 h-4 mr-2 text-gray-500" />
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default NavBar

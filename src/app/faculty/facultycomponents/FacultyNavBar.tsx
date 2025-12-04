"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, Fragment } from "react";
import { FaBars } from "react-icons/fa";
import { Transition, Dialog } from "@headlessui/react";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  imageData: string;
}

interface NavBarProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const FacultyNavBar: React.FC<NavBarProps> = ({ userProfile, onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activePage, setActivePage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  const navigationLinks = [
    { name: "Home", href: "/faculty" },
   
    {
      name: "Update",
      href: "#",
      children: [
        { name: "Image", href: "/faculty/profile/managefaculty" },
        { name: "Password", href: "/faculty/profile/managefaculty" },
      ],
    },
  
    {
      name: "FYPs",
      href: "/faculty/finalyp",
      children: [
        { name: "See All", href: "/faculty/finalyp" },
      ],
    },

    {
      name: "Ideas",
      href: "/faculty/idea",
      children: [
        { name: "Create Idea", href: "/faculty/idea" },
        { name: "Notifications", href: "/faculty/idea/ideanotifications" },
        { name: "My Ideas", href: "/faculty/idea/viewidea" },
      ],
    },




  ];

  const isActiveLink = (link: { href: string; children?: any[] }) => {
    if (link.href === "#" && link.children) {
      return link.children.some((child) => activePage.startsWith(child.href));
    } else {
      return activePage === link.href || activePage.startsWith(link.href);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-100 to-blue-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/faculty" className="text-blue-600 text-2xl font-extrabold tracking-tight hover:text-blue-700 transition">
              Faculty Suite
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:ml-10 space-x-6 items-center">
            {navigationLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className={`px-4 py-2 text-sm font-semibold transition duration-300 ${
                        isActiveLink(link)
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`block px-4 py-2 text-sm font-medium ${
                            activePage.startsWith(child.href)
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          } rounded-md`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-semibold transition duration-300 ${
                      isActiveLink(link)
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                    {isActiveLink(link) && (
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 animate-slideIn" />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Profile Dropdown (Text-based) */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              {userProfile.firstName} {userProfile.lastName}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-md shadow-xl rounded-lg z-50">
                <Link
                  href="/faculty/profile"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-t-md"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  href="/faculty/profile/editfaculty"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    handleLogoutClick();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-b-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={mobileMenuOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-2"
      >
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigationLinks.map((link) => (
              <div key={link.name}>
                {link.children ? (
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-4 py-2 text-base font-semibold ${
                        isActiveLink(link)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600"
                      } rounded-md`}
                    >
                      {link.name}
                    </button>
                    <div className="pl-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-2 text-base font-medium ${
                            activePage.startsWith(child.href)
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                          } rounded-md`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-semibold ${
                      isActiveLink(link)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    } rounded-md`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  router.push("/faculty/profile");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                View Profile
              </button>
              <button
                onClick={() => {
                  router.push("/faculty/profile/editfaculty");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Transition>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={isLogoutDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCancelLogout}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m4-10V7a2 2 0 00-2-2H9a2 2 0 00-2 2v4m12 5v-5m-4 0a2 2 0 01-2 2h-4a2 2 0 01-2-2v5m2 2H7"
                        />
                      </svg>
                    </div>
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      Confirm Logout
                    </Dialog.Title>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      Are you sure you want to log out? You will need to log back in to access your account.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelLogout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
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
  );
};

export default FacultyNavBar;
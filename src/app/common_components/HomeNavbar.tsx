"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiMenu, FiX } from "react-icons/fi"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavLink from "./NavLink"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  // 🔐 Admin password check
  const handleAdminClick = () => {
    const password = prompt("Enter Admin Password")
    if (password === "admin123") {
      router.push("/admin")
    } else {
      alert("❌ Incorrect password")
    }
  }

  return (
    <nav
      className={`flex justify-between items-center px-4 sm:px-8 py-4 fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white bg-opacity-95 shadow-lg backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/logo.jpg"
          alt="BridgeIT Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="ml-3 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          BridgeIT
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/dashboard">Analytics</NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <Link href="/dashboard/searchpage">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 cursor-pointer hidden md:block"
          >
            <FiSearch size={22} />
          </motion.div>
        </Link>

        {/* Sign In */}
        <Link href="/auth/login-user">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full hidden md:block"
          >
            Sign In
          </motion.button>
        </Link>

        {/* 🔐 Admin (Password Protected) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdminClick}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full hidden md:block"
        >
          Admin
        </motion.button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-6 md:hidden"
          >
            <NavLink href="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink href="/about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
            <NavLink href="/dashboard" onClick={() => setMenuOpen(false)}>
              Analytics
            </NavLink>

            <Link href="/dashboard/searchpage" onClick={() => setMenuOpen(false)}>
              <span className="text-blue-600">Search</span>
            </Link>

            <Link href="/auth/login-user" onClick={() => setMenuOpen(false)}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                Sign In
              </button>
            </Link>

            {/* 🔐 Admin Mobile */}
            <button
              onClick={() => {
                setMenuOpen(false)
                handleAdminClick()
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Admin
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

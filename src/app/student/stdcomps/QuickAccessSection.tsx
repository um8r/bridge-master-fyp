"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  FileText,
  Video,
  CreditCard,
  Lightbulb,
  Bell,
  Zap,
  BookOpen,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Globe,
  BarChart,
  Clock,
  Settings,
  HelpCircle,
  Bookmark,
  ChevronRight,
} from "lucide-react"

interface QuickLink {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
  notificationCount?: number
}

interface QuickAccessProps {
  className?: string
  apiLinks?: QuickLink[]
}

const QuickAccessSection: React.FC<QuickAccessProps> = ({ className, apiLinks = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Icon mapping
  const iconMap: Record<string, React.ElementType> = {
    Calendar,
    FileText,
    Video,
    CreditCard,
    Lightbulb,
    Bell,
    Zap,
    BookOpen,
    Award,
    Users,
    Briefcase,
    GraduationCap,
    Globe,
    BarChart,
    Clock,
    Settings,
    HelpCircle,
    Bookmark,
  }

  // Default quick links
  const defaultQuickLinks: QuickLink[] = [
    {
      id: "1",
      title: "Student Events",
      description: "Browse and register for upcoming events",
      icon: "Calendar",
      href: "/student/events",
      color: "blue",
    },
    {
      id: "2",
      title: "Register FYP",
      description: "Submit your final year project proposal",
      icon: "FileText",
      href: "/student/fyp",
      color: "indigo",
    },
    {
      id: "3",
      title: "FYP Meetings",
      description: "Schedule and manage project meetings",
      icon: "Video",
      href: "/student/meetings",
      color: "purple",
    },
    {
      id: "4",
      title: "Payment History",
      description: "View your transaction records",
      icon: "CreditCard",
      href: "/student/payment-history",
      color: "teal",
    },
    {
      id: "5",
      title: "Faculty Ideas",
      description: "Explore project ideas from faculty",
      icon: "Lightbulb",
      href: "/student/seeideas",
      color: "amber",
    },
  ]

  // Use API links if available, otherwise use defaults
  const quickLinks = apiLinks.length > 0 ? apiLinks : defaultQuickLinks

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  // Color mapping function
  const getColorClasses = (color: string): { gradient: string; ring: string; icon: string; text: string } => {
    const colorMap: Record<string, { gradient: string; ring: string; icon: string; text: string }> = {
      blue: {
        gradient: "from-blue-500 to-blue-600",
        ring: "ring-blue-500/20",
        icon: "bg-blue-500/10 text-blue-500",
        text: "text-blue-600",
      },
      indigo: {
        gradient: "from-indigo-500 to-indigo-600",
        ring: "ring-indigo-500/20",
        icon: "bg-indigo-500/10 text-indigo-500",
        text: "text-indigo-600",
      },
      purple: {
        gradient: "from-purple-500 to-purple-600",
        ring: "ring-purple-500/20",
        icon: "bg-purple-500/10 text-purple-500",
        text: "text-purple-600",
      },
      teal: {
        gradient: "from-teal-500 to-teal-600",
        ring: "ring-teal-500/20",
        icon: "bg-teal-500/10 text-teal-500",
        text: "text-teal-600",
      },
      amber: {
        gradient: "from-amber-500 to-amber-600",
        ring: "ring-amber-500/20",
        icon: "bg-amber-500/10 text-amber-500",
        text: "text-amber-600",
      },
      gray: {
        gradient: "from-gray-500 to-gray-600",
        ring: "ring-gray-500/20",
        icon: "bg-gray-500/10 text-gray-500",
        text: "text-gray-600",
      },
      green: {
        gradient: "from-green-500 to-green-600",
        ring: "ring-green-500/20",
        icon: "bg-green-500/10 text-green-500",
        text: "text-green-600",
      },
      red: {
        gradient: "from-red-500 to-red-600",
        ring: "ring-red-500/20",
        icon: "bg-red-500/10 text-red-500",
        text: "text-red-600",
      },
    }

    return colorMap[color] || colorMap.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 ${className}`}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Quick Access</h2>
                <p className="text-gray-300 text-xs">Navigate to important resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        >
          {quickLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon] || Zap
            const colorClasses = getColorClasses(link.color)

            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="group relative"
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="h-full bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ring-1 ring-gray-100 hover:ring-2 hover:ring-offset-1 hover:ring-offset-white hover:ring-gray-200">
                  {/* Top accent bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${colorClasses.gradient}`}></div>

                  {/* Content */}
                  <div className="p-4 flex flex-col items-center text-center h-full">
                    <div className={`p-2 rounded-full ${colorClasses.icon} mb-3`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm">{link.title}</h3>
                    <p className="text-gray-500 text-xs mt-1 hidden md:block line-clamp-1">{link.description}</p>

                    {/* Notification badge */}
                    {link.notificationCount && link.notificationCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {link.notificationCount}
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className={`w-4 h-4 ${colorClasses.text}`} />
                    </div>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default QuickAccessSection

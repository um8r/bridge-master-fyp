'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import FacultyRegistration from './users/FacultyRegistration'
import RegisterIndustryExpert from './users/RegisterExpert'
import StudentRegistration from './users/StudentRegistration'
import UniversityAdminRegistration from './users/UniAdmin'

const roles = [
  {
    key: 'Student',
    icon: 'ph:student-bold',
    label: 'Student',
    description: 'Collaborate and showcase your skills.',
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    key: 'Faculty',
    icon: 'ph:chalkboard-teacher-bold',
    label: 'Faculty',
    description: 'Guide and mentor future leaders.',
    color: 'from-teal-500 to-teal-700',
  },
  {
    key: 'IndustryExpert',
    icon: 'ph:briefcase-bold',
    label: 'Industry Expert',
    description: 'Share insights and industry experience.',
    color: 'from-yellow-500 to-yellow-700',
  },
  {
    key: 'UniversityAdmin',
    icon: 'ph:buildings-bold',
    label: 'University Admin',
    description: 'Manage and oversee university operations.',
    color: 'from-purple-500 to-purple-700',
  },
]

const RegistrationPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('')

  const renderRegistrationForm = () => {
    switch (selectedRole) {
      case 'Student':
        return <StudentRegistration />
      case 'Faculty':
        return <FacultyRegistration />
      case 'IndustryExpert':
        return <RegisterIndustryExpert />
      case 'UniversityAdmin':
        return <UniversityAdminRegistration />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-12 flex flex-col items-center justify-start relative overflow-hidden">
      {/* Background Accent Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at top center, rgba(0,123,255,0.05) 0%, transparent 70%)',
        }}
      />
  
      {/* Logo & Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Image
            src="/logo.jpg"
            alt="BridgeIT Logo"
            width={140}
            height={140}
            className="rounded-full border-4 border-blue-500 shadow-md mx-auto"
          />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
          Join BridgeIT
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
          Choose your role to get started with registration.
        </p>
      </motion.div>
  
      {/* Role Selection / Form */}
      <motion.div
        className="relative z-10 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="roleSelection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {roles.map((role) => (
                <motion.div
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className={`cursor-pointer rounded-2xl p-6 bg-gradient-to-br ${role.color} text-white shadow-md relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white bg-opacity-10 group-hover:bg-opacity-20 transition-all" />
                  <div className="relative flex flex-col items-center text-center">
                    <Icon icon={role.icon} className="text-4xl mb-3" />
                    <h3 className="text-lg font-semibold">{role.label}</h3>
                    <p className="text-sm opacity-90 mt-2">{role.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="registrationForm"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-blue-100 rounded-xl p-6 sm:p-8 shadow-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {roles.find((role) => role.key === selectedRole)?.label} Registration
                </h2>
                <button
                  onClick={() => setSelectedRole('')}
                  className="text-blue-500 hover:text-blue-700 text-sm sm:text-base flex items-center transition"
                >
                  <Icon icon="ph:arrow-left-bold" className="mr-2 text-lg" />
                  Back
                </button>
              </div>
              {renderRegistrationForm()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
  
  
}

export default RegistrationPage

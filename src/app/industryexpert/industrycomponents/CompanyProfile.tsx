{/*"use client"

import type React from "react"
import { Building2, Phone, MapPin, Edit, ExternalLink, Globe } from "lucide-react"
import { motion } from "framer-motion"

interface CompanyProfileProps {
  companyName: string
  address: string
  contact: string
  onEditCompany: () => void
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyName, address, contact, onEditCompany }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-8"
    >
      {/* Top gradient bar 
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Company Info Section 
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 rounded-lg mr-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-start">
                <div className="p-2 bg-gray-100 rounded-md mr-3 mt-1">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Company Address</p>
                  <p className="text-gray-700">{address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-gray-100 rounded-md mr-3 mt-1">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Contact Information</p>
                  <p className="text-gray-700">{contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Actions Section 
          <div className="flex flex-col space-y-4 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEditCompany}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Company Profile
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanyProfile */}

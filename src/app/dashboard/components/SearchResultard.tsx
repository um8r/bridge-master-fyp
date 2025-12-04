"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SearchResultCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string | null;
  type: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  userId,
  firstName,
  lastName,
  email,
  imageData,
  type,
}) => {
  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith('data:image') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    return '/unknown.jpg';
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-8"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Circular Profile Image */}
      <div className="relative flex justify-center">
        <motion.div
          className="relative rounded-full w-28 h-28 overflow-hidden border-4 border-blue-500 shadow-lg"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={formatImageSrc(imageData)}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay View Profile */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            whileHover={{ opacity: 1 }}
          >
            <Link
              href={`/dashboard/profile/${type}/${userId}`}
              className="text-white text-sm font-semibold"
            >
              View Profile
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* User Details */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-gray-900">{firstName} {lastName}</h2>
        <p className="text-gray-600 mt-1">{email}</p>
        <Link
          href={`/dashboard/profile/${type}/${userId}`}
          className="inline-block mt-4 px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-md hover:bg-gradient-to-l hover:from-purple-600 hover:to-indigo-700 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default SearchResultCard;

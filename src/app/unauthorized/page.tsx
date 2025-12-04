'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Unauthorized: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/auth/login-user');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-white relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Large background image */}
        <Image
          src="/errorbg.png"
          alt="Error background"
          width={1000} // Increased width for larger image
          height={1000} 
          className="object-cover opacity-30" // Full-screen image with low opacity
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl z-10">
        {/* Left section: Larger image */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Image
            src="/errorbg.png"
            alt="Error background"
            width={700} // Increased width for larger image
            height={700} // Increased height for larger image
            className="object-contain"
          />
        </motion.div>

        {/* Right section: Unauthorized message */}
        <motion.div
          className="w-full md:w-1/2 text-center p-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-6xl font-extrabold text-red-500 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Access Denied
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            You need to log in to access this page.
          </motion.p>
          <motion.button
            onClick={handleGoBack}
            className="py-3 px-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-yellow-600 transition duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Login
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;

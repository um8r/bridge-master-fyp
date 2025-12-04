'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-white text-gray-400 overflow-hidden">
      
      {/* Organic Gradient 1 */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 rounded-full filter blur-xl opacity-80"
        style={{ top: '3%', left: '3%' }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360, 0],
          borderRadius: ["50%", "60% 40%", "50%"], // Morphing effect
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Organic Gradient 2 */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full filter blur-xl opacity-80"
        style={{ bottom: '3%', right: '3%' }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0],
          borderRadius: ["50%", "60% 40%", "50%"], // Morphing effect
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Loading Text */}
      <motion.h1
        className="text-2xl font-semibold tracking-widest mb-6 text-grey-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        LOADING, PLEASE WAIT!
      </motion.h1>

      {/* Dots Animation */}
      <div className="flex space-x-3">
        {[...Array(5)].map((_, index) => {
          const colors = [
            'bg-gradient-to-r from-green-400 to-blue-500',
            'bg-gradient-to-r from-purple-400 to-pink-500',
            'bg-gradient-to-r from-yellow-400 to-red-500',
            'bg-gradient-to-r from-indigo-400 to-purple-600',
            'bg-gradient-to-r from-orange-400 to-pink-500',
          ];

          return (
            <motion.div
              key={index}
              className={`w-6 h-6 ${colors[index]} rounded-full`}
              animate={{
                y: [0, -15, 0], // Bouncing effect
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2, // Stagger animation
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Loading;

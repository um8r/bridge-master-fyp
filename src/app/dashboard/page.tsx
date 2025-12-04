"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaChartPie, FaSearch, FaChartLine } from 'react-icons/fa'; // Example icons
import { useRouter } from 'next/navigation';

const DashboardHomePage: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-100 to-white-100 text-gray-600 p-10">
      {/* Header */}
      <motion.h1
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-500 text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Impact Dashboard
      </motion.h1>

      {/* Custom Section Design */}
      <div className="flex flex-wrap justify-center gap-10">
        {/* Overview Section */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-white rounded-full w-60 h-60 p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer"
          onClick={() => handleNavigation('/dashboard/overview')}
        >
          <FaChartPie className="text-purple-600 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <p className="text-sm text-gray-500 text-center mt-2">Summary of all statistics</p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-white rounded-full w-60 h-60 p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer"
          onClick={() => handleNavigation('/dashboard/searchpage')}
        >
          <FaSearch className="text-blue-600 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Search</h2>
          <p className="text-sm text-gray-500 text-center mt-2">Find registered users</p>
        </motion.div>

        {/* Data Visualizations Section */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-white rounded-full w-60 h-60 p-8 flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer"
          onClick={() => handleNavigation('/dashboard/visualizations')}
        >
          <FaChartLine className="text-green-600 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Data Visualizations</h2>
          <p className="text-sm text-gray-500 text-center mt-2">Graphs and insights</p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-16 text-center text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        &copy; {new Date().getFullYear()} BridgeIT.
      </motion.footer>
    </div>
  );
};

export default DashboardHomePage;

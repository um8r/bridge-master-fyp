"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaUserGraduate, FaIndustry, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa'; 
import { useRouter } from 'next/navigation';

interface SummaryCardProps {
  title: string;
  count: number;
  description: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, description }) => {
  const router = useRouter();

  // Map title to icons
  const iconMap: { [key: string]: JSX.Element } = {
    Universities: <FaUniversity className="text-6xl text-blue-500" />,
    Students: <FaUserGraduate className="text-6xl text-green-500" />,
    "Industry Experts": <FaIndustry className="text-6xl text-purple-500" />,
    Faculties: <FaChalkboardTeacher className="text-6xl text-pink-500" />,
    Companies: <FaBuilding className="text-6xl text-yellow-500" />,
  };

  // Handle card click
  const handleCardClick = () => {
    const routeMap: { [key: string]: string } = {
      Universities: '/admin/view/universities', // Map titles to routes
      Students: '/admin/view/students',
      "Industry Experts": '/admin/view/industry-experts',
      Faculties: '/admin/view/faculties',
      Companies: '/admin/view/companies',
    };

    router.push(routeMap[title]); // Navigate to the corresponding route
  };

  return (
    <motion.div
      onClick={handleCardClick} // Trigger navigation on click
      className="bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Dynamic Icon based on title */}
        <div className="mb-6">{iconMap[title]}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-4xl font-extrabold text-gray-900 mb-2">{count}</p>
        <p className="text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;

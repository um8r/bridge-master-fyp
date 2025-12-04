"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "delete">("view");
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-gray-800 to-gray-800 shadow-xl p-6">
        {/* Sidebar Header / Logo area */}
        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-wide text-blue-500"
          >
            Admin Menu
          </motion.h2>
          <p className="text-sm text-gray-400">Manage all admin tasks</p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-md bg-gray-700/40 hover:bg-gray-700/70 transition-colors font-semibold"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/all-emails"
            className="block px-4 py-2 rounded-md bg-gray-700/40 hover:bg-gray-700/70 transition-colors font-semibold"
          >
            All Emails
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 relative">
        {/* Animated Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-5xl font-extrabold text-blue-600">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Manage platform entities with ease
          </p>
        </motion.header>

        {/* Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("view")}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200
              ${
                activeTab === "view"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }
            `}
          >
            View
          </button>
      
          {/* Create Button */}
          <Link href="/admin/create">
            <div
              className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg
                        hover:bg-blue-700 transition-colors duration-200 mt-4 md:mt-0 shadow-md cursor-pointer"
              aria-label="create"
            >
              Create
            </div>
          </Link>
        </div>

        {/* Dynamic Content: Grid of Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {activeTab === "view" ? (
            <>
              <Card
                title="Students"
                description="View and manage all student records."
                bgColor="bg-blue-600"
                onClick={() => navigateTo("/admin/view/students")}
              />
              <Card
                title="Universities"
                description="View and manage registered universities."
                bgColor="bg-green-600"
                onClick={() => navigateTo("/admin/view/universities")}
              />
              <Card
                title="Industry Experts"
                description="View and manage industry experts."
                bgColor="bg-yellow-600"
                onClick={() => navigateTo("/admin/view/industry-experts")}
              />
              <Card
                title="Faculties"
                description="View and manage all faculties."
                bgColor="bg-red-600"
                onClick={() => navigateTo("/admin/view/faculties")}
              />
              <Card
                title="Uni Admins"
                description="View and manage university administrators."
                bgColor="bg-purple-600"
                onClick={() => navigateTo("/admin/view/uniadmins")}
              />
              <Card
                title="Companies"
                description="View and manage registered companies."
                bgColor="bg-teal-600"
                onClick={() => navigateTo("/admin/view/companies")}
              />
            </>
          ) : (
            <>
              <Card
                title="Students"
                description="Delete student records."
                bgColor="bg-blue-600"
                onClick={() => navigateTo("/admin/delete/students")}
              />
              <Card
                title="Universities"
                description="Delete universities from the system."
                bgColor="bg-green-600"
                onClick={() => navigateTo("/admin/delete/universities")}
              />
              <Card
                title="Industry Experts"
                description="Delete industry expert records."
                bgColor="bg-yellow-600"
                onClick={() => navigateTo("/admin/delete/industry-experts")}
              />
              <Card
                title="Faculties"
                description="Delete faculty profiles."
                bgColor="bg-red-600"
                onClick={() => navigateTo("/admin/delete/faculties")}
              />
              <Card
                title="Uni Admins"
                description="Delete university administrators."
                bgColor="bg-purple-600"
                onClick={() => navigateTo("/admin/delete/uniadmins")}
              />
              <Card
                title="Companies"
                description="Delete registered companies."
                bgColor="bg-teal-600"
                onClick={() => navigateTo("/admin/delete/companies")}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

/**
 * Reusable Card Component for either "View" or "Delete" items
 */
interface CardProps {
  title: string;
  description: string;
  bgColor: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, bgColor, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${bgColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-left flex flex-col justify-center`}
    >
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-200 text-sm">{description}</p>
    </motion.button>
  );
};

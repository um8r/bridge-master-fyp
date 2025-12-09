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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-blue-950 to-blue-800 text-slate-50 shadow-xl">
        <div className="p-6">
          {/* Sidebar Header / Logo area */}
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-wide text-white"
            >
              Admin
            </motion.h2>
            <p className="text-sm text-blue-100/80">Control center</p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-2 font-semibold text-blue-50 transition-all duration-200 hover:bg-blue-900/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/all-emails"
              className="block rounded-lg px-4 py-2 font-semibold text-blue-50 transition-all duration-200 hover:bg-blue-900/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              All Emails
            </Link>
            <Link
              href="/admin/create"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="create"
            >
              Create
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 p-10 lg:p-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {/* Animated Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Administration
            </p>
            <h1 className="text-4xl font-extrabold text-blue-950 md:text-5xl">
              Control Panel
            </h1>
            <p className="text-base text-slate-600 md:text-lg">
              Review, create, or clean up records in one consistent workspace.
            </p>
          </motion.header>

          {/* Tab Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab("view")}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeTab === "view"
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "border-blue-100 bg-white text-blue-800 hover:border-blue-300 hover:text-blue-900"
              }`}
            >
              View
            </button>
          
          </div>

          {/* Dynamic Content: Grid of Action Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab === "view" ? (
              <>
                <Card
                  title="Students"
                  description="View and manage all student records."
                  onClick={() => navigateTo("/admin/view/students")}
                />
                <Card
                  title="Universities"
                  description="View and manage registered universities."
                  onClick={() => navigateTo("/admin/view/universities")}
                />
                <Card
                  title="Industry Experts"
                  description="View and manage industry experts."
                  onClick={() => navigateTo("/admin/view/industry-experts")}
                />
                <Card
                  title="Faculties"
                  description="View and manage all faculties."
                  onClick={() => navigateTo("/admin/view/faculties")}
                />
                <Card
                  title="Uni Admins"
                  description="View and manage university administrators."
                  onClick={() => navigateTo("/admin/view/uniadmins")}
                />
                <Card
                  title="Companies"
                  description="View and manage registered companies."
                  onClick={() => navigateTo("/admin/view/companies")}
                />
              </>
            ) : (
              <>
                <Card
                  title="Students"
                  description="Delete student records."
                  onClick={() => navigateTo("/admin/delete/students")}
                />
                <Card
                  title="Universities"
                  description="Delete universities from the system."
                  onClick={() => navigateTo("/admin/delete/universities")}
                />
                <Card
                  title="Industry Experts"
                  description="Delete industry expert records."
                  onClick={() => navigateTo("/admin/delete/industry-experts")}
                />
                <Card
                  title="Faculties"
                  description="Delete faculty profiles."
                  onClick={() => navigateTo("/admin/delete/faculties")}
                />
                <Card
                  title="Uni Admins"
                  description="Delete university administrators."
                  onClick={() => navigateTo("/admin/delete/uniadmins")}
                />
                <Card
                  title="Companies"
                  description="Delete registered companies."
                  onClick={() => navigateTo("/admin/delete/companies")}
                />
              </>
            )}
          </div>
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
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
      <h2 className="mb-2 text-2xl font-semibold text-blue-950">{title}</h2>
      <p className="text-sm text-slate-600">{description}</p>
    </motion.button>
  );
};

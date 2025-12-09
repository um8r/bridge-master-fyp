"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const AdminCreatePage: React.FC = () => {
  const router = useRouter();

  const goToCreateCompany = () => {
    router.push('/admin/create/company');
  };

  const goToCreateUniversity = () => {
    router.push('/admin/create/university'); // You will need to create this page as well
  };

  const goToViewCompanies = () => {
    router.push('/admin/view/companies');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-blue-100 bg-white shadow-sm p-8 md:p-10">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950">
            Create Records
          </h1>
          <p className="text-slate-600">
            Add new companies or universities, or review existing companies.
          </p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={goToCreateCompany}
            className="w-full rounded-xl border border-blue-200 bg-blue-600 px-6 py-4 text-white font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Create Company
          </button>
          <button
            onClick={goToCreateUniversity}
            className="w-full rounded-xl border border-blue-200 bg-white px-6 py-4 text-blue-900 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Create University
          </button>
          <button
            onClick={goToViewCompanies}
            className="w-full rounded-xl border border-blue-200 bg-white px-6 py-4 text-blue-900 font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            View All Companies
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePage;

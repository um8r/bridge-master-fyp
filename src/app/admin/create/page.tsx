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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={goToCreateCompany}
          className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Create Company
        </button>
        <button
          onClick={goToCreateUniversity}
          className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
        >
          Create University
        </button>
        <button
          onClick={goToViewCompanies}
          className="w-full py-3 px-6 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition duration-200"
        >
          View All Companies
        </button>
      </div>
    </div>
  );
};

export default AdminCreatePage;

"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Clear the token from localStorage
    toast.success('Logged out successfully.', {
      position: 'top-center',
      autoClose: 2000,
    });
    router.push('/auth/login-user'); // Redirect to the login page
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

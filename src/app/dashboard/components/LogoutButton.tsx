// app/dashboard/components/LogoutButton.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/dashboard/login');
  };

  return (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

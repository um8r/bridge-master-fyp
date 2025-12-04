"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/forgot-password/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      });
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.text();
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        router.push('/auth/login-user');
      }, 2000);
    } catch (err: any) {
      setError('Error: ' + err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/security.png"
              alt="Security Illustration"
              width={150}
              height={150}
              className="mb-6 rounded-full border-4 border-blue-200 shadow-md"
            />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              Reset Password
            </h1>
          </div>
  
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Email Address"
                required
              />
            </div>
  
            {/* New Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
  
            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                placeholder="Confirm New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
  
            {/* Error & Success Messages */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500 text-sm mt-2"
              >
                {success}
              </motion.p>
            )}
  
            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset Password
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
  
};

export default ResetPassword;


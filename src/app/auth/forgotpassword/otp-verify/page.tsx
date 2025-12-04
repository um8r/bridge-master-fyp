"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || !email) {
      setError('Please enter both email and OTP.');
      return;
    }

    try {
      const response = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/forgot-password/verify-forgotpassword-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email , otp: parseInt(otp) }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Invalid OTP. Please try again.');
      }

      const data = await response.text();
      setSuccess(data || 'OTP verified successfully!');

      setTimeout(() => {
        router.push('/auth/forgotpassword/passwordchange');
      }, 2000);
    } catch (err: any) {
      setError('Error: ' + err.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6 relative overflow-hidden">
      {/* Glowing Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>
  
      {/* OTP Verification Card */}
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-blue-100 rounded-2xl p-8 shadow-2xl backdrop-blur-lg"
        >
          {/* Logo + Title */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            <Image
              src="/logo.jpg"
              alt="BridgeIT Logo"
              width={48}
              height={48}
            />
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Verify OTP
            </h1>
          </div>
  
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Email"
                required
              />
            </div>
  
            {/* OTP */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter OTP"
                required
              />
            </div>
  
            {/* Messages */}
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Verify OTP
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
  
};

export default VerifyOtp;


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/forgot-password/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send OTP");
      }

      const data = await response.text();
      setSuccess(data);

      setTimeout(() => {
        router.push("/auth/forgotpassword/otp-verify");
      }, 2000);
    } catch (err: any) {
      setError("Error: " + err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 p-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/forgotpass.png"
              alt="Forgot Password Illustration"
              width={150}
              height={150}
              className="mb-6 rounded-full border-4 border-blue-100 shadow-md"
            />
            <h1 className="text-3xl font-bold text-blue-600">
              Forgot Password
            </h1>
          </div>
  
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                placeholder="Email Address"
                required
              />
            </div>
  
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
                className="text-green-600 text-sm mt-2"
              >
                {success}
              </motion.p>
            )}
  
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:opacity-90 transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send OTP
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
  
};

export default ForgotPassword;

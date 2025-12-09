"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBriefcase,
  FaUniversity,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Image from 'next/image';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("jwtToken", token);

        try {
          const profileResponse = await fetch(
            "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const role = profileData.role;

            switch (role) {
              case "Student":
                router.push("/student");
                break;
              case "Faculty":
                router.push("/faculty");
                break;
              case "IndustryExpert":
                router.push("/industryexpert");
                break;
              case "UniversityAdmin":
                router.push("/uniadmin");
                break;
              default:
                toast.error("Invalid role. Please contact support.");
                break;
            }
          } else {
            toast.error("Failed to fetch user profile.");
          }
        } catch (error) {
          toast.error("An error occurred while fetching user profile.");
        }
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      toast.error("Login Failed. Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 flex flex-col md:flex-row">
      {/* Left Side - Hero Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: -10 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <Image
            src="/heroimage.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="rounded-lg w-full h-auto"
          />
        </motion.div>
      </div>
  
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8">
            <Image src="/logo.jpg" alt="BridgeIT Logo" width={50} height={50} className="mr-3" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              Welcome Back
            </h1>
          </div>
  
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
  
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
              <div
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-blue-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
  
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
  
            <div className="text-center mt-4 text-sm text-gray-600">
              Forgot Password?{" "}
              <span
                onClick={() => router.push("/auth/forgotpassword")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Click Here
              </span>
            </div>
  
            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => router.push("/auth/register-user")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Sign up here
              </span>
            </div>
  
          
          </form>
  
          <ToastContainer />
        </motion.div>
      </div>
    </div>
  )
  
  
  
};

export default LoginPage;
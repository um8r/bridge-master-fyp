"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from 'next/image';
import { motion } from 'framer-motion';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "student";

  const handleInputChange = (value: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(updatedOtp);
    // Move to the next input automatically
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullOtp = otp.join(""); // Combine all OTP digits

    try {
      const otpResponse = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: parseInt(fullOtp) }),
        }
      );

      if (otpResponse.ok) {
        let storageKey = "";
        let registerEndpoint = "";

        switch (role) {
          case "faculty":
            storageKey = "facultyRegistrationData";
            registerEndpoint =
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/faculty";
            break;
          case "industryExpert":
            storageKey = "industryExpertRegistrationData";
            registerEndpoint =
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/industry-expert";
            break;
          case "universityAdmin":
            storageKey = "universityAdminRegistrationData";
            registerEndpoint =
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/university-admin";
            break;
          default:
            storageKey = "registrationData";
            registerEndpoint =
              "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/register-user/student";
        }

        const registrationData = JSON.parse(
          sessionStorage.getItem(storageKey) || "{}"
        );

        const registerResponse = await fetch(registerEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });

        if (registerResponse.ok) {
          toast.success("Registration successful!", {
            position: "top-center",
            autoClose: 3000,
          });
          router.push("/auth/login-user");
        } else {
          const errorText = await registerResponse.text();
          toast.error(`Registration failed: ${errorText}`, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        const errorText = await otpResponse.text();
        toast.error(`OTP verification failed: ${errorText}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("An error occurred during OTP verification.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/otp/regenerate-otp",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );

      if (response.ok) {
        toast.success("A new OTP has been sent to your email.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        const errorText = await response.text();
        toast.error(`Failed to resend OTP: ${errorText}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("An error occurred during OTP resend.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white border border-blue-100 rounded-2xl p-8 shadow-xl w-full max-w-md"
      >
        {/* Logo and Heading */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <Image
            src="/logo.jpg"
            alt="BridgeIT Logo"
            width={48}
            height={48}
          />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
            Verify OTP
          </h1>
        </div>
  
        {/* Info Text */}
        <p className="text-center text-gray-600 mb-6">
          An OTP has been sent to your email:{" "}
          <span className="text-blue-600 font-medium">{email}</span>
        </p>
  
        {/* OTP Input Fields */}
        <form onSubmit={handleVerifyOtp}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="w-12 h-12 text-center text-xl bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            ))}
          </div>
  
          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>
  
        {/* Resend Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none transition duration-300"
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </motion.div>
  
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
  
};

export default VerifyOtp;


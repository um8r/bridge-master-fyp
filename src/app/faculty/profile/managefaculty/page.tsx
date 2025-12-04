"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const FacultyProfileManagement: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // New state
  const [imageData, setImageData] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("password"); // Toggle state
  const [showPassword, setShowPassword] = useState<boolean>(false); // Password visibility toggle
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/auth/login-user");
      return;
    }

    async function fetchUserProfile() {
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
          setUserId(profileData.userId);
        } else {
          toast.error("Failed to fetch user profile.", {
            position: "top-center",
            autoClose: 3000,
          });
          router.push("/auth/login-user");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the user profile.", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/auth/login-user");
      }
    }

    fetchUserProfile();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const confirmResponse = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/confirm-current-password/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentPassword),
        }
      );

      if (!confirmResponse.ok) {
        toast.error("Current password is incorrect.");
        return;
      }

      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPassword),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !imageData) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const base64Image = imageData.split(",")[1]; // Ensure we send only the base64 part
      const response = await fetch(
        `https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/set-profile-image/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(base64Image),
        }
      );

      if (response.ok) {
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Failed to update profile image.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between bg-white text-gray-900 p-8 space-x-8">
      {/* Left Side with Gradient Text, Logo, and Edit Image */}
      <div className="flex flex-col items-center lg:items-start lg:ml-16">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 flex items-center">
          {/* Logo Image */}
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-4"
          />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Manage
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 ml-2">
            Profile
          </span>
        </h1>
        <div className="mt-6">
          <Image
            src="/editpr.png"
            alt="Edit Profile"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
  
      {/* Right Side with Toggle and Forms */}
      <div className="w-full lg:max-w-xl p-6 rounded-lg shadow-lg bg-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
          Profile Management
        </h1>
  
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("password")}
            className={`py-2 px-6 font-semibold rounded-lg ${
              activeTab === "password"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`py-2 px-6 font-semibold rounded-lg ${
              activeTab === "image"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            Upload Profile Image
          </button>
        </div>
  
        {/* Conditional Rendering */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full p-4 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Change Password
              </button>
            </div>
          </form>
        )}
  
        {activeTab === "image" && (
          <form onSubmit={handleImageUpload} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Upload Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full p-4 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {imageData && (
                <img
                  src={imageData}
                  alt="Profile Preview"
                  className="mt-4 w-32 h-32 rounded-full mx-auto border-4 border-gray-300 shadow-lg"
                />
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              >
                Upload Image
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );  
};

export default FacultyProfileManagement;

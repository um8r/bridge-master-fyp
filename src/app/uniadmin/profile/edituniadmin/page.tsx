"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const EditUniAdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    officeAddress: '',
    contact: '',
    description: '',
    profileImage: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/auth/login-user'); // Redirect to login if no token
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          officeAddress: data.officeAddress || '',
          contact: data.contact || '',
          description: data.description || '',
          profileImage: data.profileImage || '',
        });
      } catch (err) {
        setError('Failed to load profile.');
        toast.error('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      // Update description and other details
      await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/update-user-description/${profile.userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.description),
      });

      // Update profile image
      if (form.profileImage) {
        const base64Image = form.profileImage.split(',')[1]; // Remove data:image/png;base64,
        await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/edit-user-profile/set-profile-image/${profile.userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(base64Image),
        });
      }

      toast.success('Profile updated successfully!');
      router.push('/uniadmin/profile'); // Redirect to dashboard
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="max-w-4xl w-full bg-gray-100 p-8 rounded-lg shadow-2xl relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-8">
          {/* Logo Image */}
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={80}
            height={80}
            className="mr-4"
          />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Edit Profile
          </h1>
        </div>

        <div className="space-y-10">
          {/* Profile Image Section */}
          <div className="text-center">
            <div className="relative inline-block">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-blue-500 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 w-32 h-32 cursor-pointer"
                title="Upload Image"
              />
            </div>
            <p className="text-sm text-gray-700 mt-3">
              Click to upload a new profile image
            </p>
          </div>

          {/* Personal Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleInputChange}
                className="peer w-full bg-gray-100 p-4 text-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
              />
              <label
                className="absolute left-4 top-2 text-gray-700 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all"
              >
                First Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleInputChange}
                className="peer w-full bg-gray-100 p-4 text-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
              />
              <label
                className="absolute left-4 top-2 text-gray-700 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all"
              >
                Last Name
              </label>
            </div>
            <div className="relative col-span-1 sm:col-span-2">
              <input
                type="text"
                name="officeAddress"
                value={form.officeAddress}
                onChange={handleInputChange}
                className="peer w-full bg-gray-100 p-4 text-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
              />
              <label
                className="absolute left-4 top-2 text-gray-700 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all"
              >
                Office Address
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleInputChange}
                className="peer w-full bg-gray-100 p-4 text-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
              />
              <label
                className="absolute left-4 top-2 text-gray-700 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-700 peer-focus:top-2 peer-focus:text-blue-400 transition-all"
              >
                Contact
              </label>
            </div>
            <div className="relative col-span-1 sm:col-span-2">
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={4}
                className="peer w-full bg-gray-100 p-4 text-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" "
              />
              <label
                className="absolute left-4 top-2 text-gray-700 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-blue-400 transition-all"
              >
                Description
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Save Changes
            </motion.button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditUniAdminProfile;

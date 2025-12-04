"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  profileImage: string;
  university: string;
  officeAddress: string;
  contact: string;
}

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      router.push('/auth/login-user'); // Redirect to login if no token
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const userData = await response.json();
        const userId = userData.userId;

        const adminResponse = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-uni-admins/admins-by-id/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!adminResponse.ok) throw new Error('Failed to fetch University Admin profile');

        const adminData = await adminResponse.json();

        setProfile({
          id: adminData.userId,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          description: adminData.description || 'No description provided.',
          profileImage: adminData.profileImage || '',
          university: adminData.university || 'No university specified.',
          officeAddress: adminData.officeAddress || 'No office address provided.',
          contact: adminData.contact || 'No contact provided.',
        });
      } catch (err) {
        setError('Failed to load profile.');
        toast.error('An error occurred while fetching your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-5xl w-full bg-gray-100 rounded-lg shadow-2xl p-6 sm:p-8 md:p-10 relative z-10 transform hover:scale-105 transition-transform duration-500">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6">
            <img
              src={`data:image/png;base64,${profile?.profileImage}`}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-500 shadow-lg transform hover:scale-110 transition-transform duration-300"
            />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-sm sm:text-lg text-gray-500 mt-2 flex items-center justify-center sm:justify-start">
                <FaEnvelope className="mr-2 text-blue-400" />
                {profile?.email || "---"}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("profile/edituniadmin")}
            className="mt-6 sm:mt-0 bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-700 transition-transform duration-300 flex items-center text-white font-semibold"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <InfoCard
            icon={<FaBuilding className="text-blue-400 text-3xl" />}
            title="University"
            content={profile?.university || "---"}
          />
          <InfoCard
            icon={<FaMapMarkerAlt className="text-green-400 text-3xl" />}
            title="Office Address"
            content={profile?.officeAddress || "---"}
          />
          <InfoCard
            icon={<FaPhone className="text-purple-400 text-3xl" />}
            title="Contact"
            content={profile?.contact || "---"}
          />
          <InfoCard
            icon={<FaUser className="text-pink-400 text-3xl" />}
            title="About Me"
            content={profile?.description || "---"}
          />
        </div>

        {/* Toast Notification */}
        <ToastContainer />
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: JSX.Element; title: string; content: string }> = ({ icon, title, content }) => {
  return (
    <div className="flex items-start space-x-4 bg-gray-100 p-4 sm:p-6 rounded-lg shadow hover:shadow-lg hover:bg-gray-200 transition-transform duration-300">
      {icon}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm sm:text-base text-gray-500">{content}</p>
      </div>
    </div>
  );
};

export default UserProfilePage;

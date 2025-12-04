import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic, e.g., clear token and redirect
    localStorage.removeItem("jwtToken");
    router.push("/auth/login-user");
  };

  return (
    <nav className="bg-gray-800 text-gray-300 w-full p-4 flex items-center justify-between">
      {/* Left Logo */}
      <div className="flex items-center">
        <img
          src="/logo.jpg" // Replace with the actual path to your logo
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="font-semibold text-xl"> BridgeIT</span>
      </div>

      {/* Right Section with Logo and Logout */}
      <div className="flex items-center space-x-4">
     
<ul className="flex space-x-4">
        <li>
          <Link href="/student/projects/history" className="text-white hover:text-green-500">
            Proposal History
          </Link>
        </li>
        {/* Other navigation links */}
      </ul>


        <button
          onClick={handleLogout}
          className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

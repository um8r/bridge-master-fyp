"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCompanyPage: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/companies/add-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: companyName,
          address: address,
          business: business,
          description: description,
        }),
      });

      if (response.ok) {
        toast.success("Company created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/admin/view/companies");
      } else {
        toast.error("Failed to create company.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100p-6">
      {/* Page Container */}
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-green-400">
          Create Company
        </h1>
        <form onSubmit={handleCreateCompany} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border 
                         border-gray-700 rounded-lg shadow-sm focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-300">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border 
                         border-gray-700 rounded-lg shadow-sm focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1234 Main St, City"
              required
            />
          </div>

          {/* Business */}
          <div>
            <label className="block text-sm font-semibold text-gray-300">Business</label>
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border 
                         border-gray-700 rounded-lg shadow-sm focus:outline-none 
                         focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Tech Consulting"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full p-4 bg-gray-900 text-white border 
                         border-gray-700 rounded-lg shadow-sm focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Tell us a bit about the company's services and specialties"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full py-3 px-6 bg-blue-600 text-white font-semibold 
                         rounded-lg shadow-md hover:bg-blue-500 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 transition duration-200`}
            >
              Create Company
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateCompanyPage;

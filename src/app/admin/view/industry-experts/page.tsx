"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const ManageIndustryExpertsPage: React.FC = () => {
  const [industryExperts, setIndustryExperts] = useState<any[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchIndustryExperts() {
      try {
        const response = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-experts"
        );
        if (response.ok) {
          const data = await response.json();
          setIndustryExperts(data);
          setFilteredExperts(data);
        } else {
          console.error("Failed to fetch industry experts:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred while fetching industry experts:", error);
      }
    }

    fetchIndustryExperts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredExperts(industryExperts);
    } else {
      const filtered = industryExperts.filter((expert) =>
        `${expert.firstName} ${expert.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredExperts(filtered);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-12">
      <header className="flex flex-col justify-center items-center mb-8 space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-100">
          Industry Experts Overview
        </h1>
        <p className="text-lg text-gray-400">
          View and manage industry expert details
        </p>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search experts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-2 border-gray-300 rounded-full px-6 py-3 w-72 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200">
            <FaSearch />
          </button>
        </div>
      </header>

      {/* Industry Experts List */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Decorated Element */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-full h-2 rounded-full mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {expert.firstName} {expert.lastName}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> {expert.email}
                </p>
                <p className="text-gray-600">
                  <strong>Company:</strong> {expert.companyName}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong> {expert.contact}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">
            No industry experts available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default ManageIndustryExpertsPage;

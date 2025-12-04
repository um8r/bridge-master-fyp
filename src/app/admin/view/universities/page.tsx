"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const ManageUniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<any[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const response = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-all-universities"
        );
        if (response.ok) {
          const data = await response.json();
          setUniversities(data);
          setFilteredUniversities(data);
        } else {
          console.error("Failed to fetch universities:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred while fetching universities:", error);
      }
    }

    fetchUniversities();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((university) =>
        university.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-12">
      <header className="flex flex-col justify-center items-center mb-8 space-y-6">
        <h1 className="text-5xl font-extrabold text-gray-100">
          Universities Overview
        </h1>
        <p className="text-lg text-gray-400">
          View and manage university details
        </p>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-2 border-gray-300 rounded-full px-6 py-3 w-72 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200">
            <FaSearch />
          </button>
        </div>
      </header>

      {/* Universities List */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Decorated Element */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-full h-2 rounded-full mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {university.name}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Location:</strong> {university.address}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong> {university.contact || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Established Year:</strong> {university.estYear}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">
            No universities available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default ManageUniversitiesPage;

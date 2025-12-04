"use client";
import React, { useEffect, useState } from "react";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

interface Company {
  id: string;
  name: string;
  address: string;
  business: string;
  description: string;
}

const ViewCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/companies/get-all-companies",
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
          setFilteredCompanies(data);
        } else {
          console.error("Failed to fetch companies:", response.statusText);
          setError("Failed to fetch companies.");
        }
      } catch (error) {
        console.error("An error occurred while fetching companies:", error);
        setError("An error occurred while fetching companies.");
      }
    };

    fetchCompanies();
  }, []);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  };

  // Handle sorting
  const handleSort = () => {
    const sortedCompanies = [...filteredCompanies].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredCompanies(sortedCompanies);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 py-12">
      <div className="flex flex-col justify-center items-center mb-8 space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-500">Companies Directory</h1>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-2 border-gray-300 rounded-full px-6 py-3 w-72 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-200">
            <FaSearch />
          </button>
        </div>

        {/* Sort Button */}
        <button
          onClick={handleSort}
          className="flex items-center bg-white shadow-lg p-3 rounded-full text-gray-600 hover:bg-gray-100 transition duration-200"
        >
          {sortOrder === "asc" ? (
            <>
              <FaSortAlphaDown className="mr-2" /> Sort A-Z
            </>
          ) : (
            <>
              <FaSortAlphaUp className="mr-2" /> Sort Z-A
            </>
          )}
        </button>
      </div>

      {/* Companies List */}
      <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
            >
              {/* Decorated Element */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-full h-2 rounded-full mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{company.name}</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Address:</strong> {company.address}
                </p>
                <p className="text-gray-600">
                  <strong>Business:</strong> {company.business}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> {company.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">
            No companies available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewCompaniesPage;

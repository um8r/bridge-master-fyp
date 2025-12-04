"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchResultCard from '../components/SearchResultard';

interface SearchResult {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  imageData: string | null;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('student');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setResults([]);
    setError('');
  }, [searchType]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      switch (searchType) {
        case 'student':
          response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/student-by-name/${query}`);
          break;
        case 'faculty':
          response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculty-by-name/${query}`);
          break;
        case 'industry':
          response = await fetch(`https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-expert-by-name/${query}`);
          break;
        default:
          throw new Error('Invalid search type');
      }

      if (!response.ok) {
        throw new Error('Not Found! Try Creating One');
      }

      const data = await response.json();
      if (data.length === 0) {
        setResults([]);
        setError('No results found');
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white to-white flex flex-col items-center">
      <motion.h1
        className="text-5xl font-extrabold mb-10 text-center text-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Advanced Search
      </motion.h1>

      <div className="flex flex-col items-center justify-center w-full max-w-2xl space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter name"
          className="p-4 w-full bg-gray-100 text-gray-500 placeholder-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between w-full">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-3 bg-gray-100 text-gray-500 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="industry">Industry Expert</option>
          </select>
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-8 w-full max-w-5xl">
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && results.length === 0 && (
          <p className="text-gray-400 text-center">No results found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {results.map((result) => (
            <SearchResultCard
              key={result.userId}
              userId={result.userId}
              firstName={result.firstName}
              lastName={result.lastName}
              email={result.email}
              imageData={result.imageData}
              type={searchType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;

"use client";
import React, { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCards';

const OverviewPage: React.FC = () => {
  const [universitiesCount, setUniversitiesCount] = useState<number>(0);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [industryExpertsCount, setIndustryExpertsCount] = useState<number>(0);
  const [facultiesCount, setFacultiesCount] = useState<number>(0);
  const [companiesCount, setCompaniesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [universitiesRes, studentsRes, industryExpertsRes, facultiesRes, companiesRes] = await Promise.all([
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/universities/get-all-universities'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-student/students'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-industry-expert/industry-experts'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/get-faculty/faculties'),
          fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/companies/get-all-companies'),
        ]);

        const [universitiesData, studentsData, industryExpertsData, facultiesData, companiesData] = await Promise.all([
          universitiesRes.json(),
          studentsRes.json(),
          industryExpertsRes.json(),
          facultiesRes.json(),
          companiesRes.json(),
        ]);

        setUniversitiesCount(universitiesData.length);
        setStudentsCount(studentsData.length);
        setIndustryExpertsCount(industryExpertsData.length);
        setFacultiesCount(facultiesData.length);
        setCompaniesCount(companiesData.length);
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-400 text-center mb-12">Impact Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
                <span className="block text-lg text-gray-500 mt-4">Fetching data...</span>
              </div>
            </div>
          ) : (
            <>
              <SummaryCard title="Universities" count={universitiesCount} description="Total number of universities" />
              <SummaryCard title="Students" count={studentsCount} description="Total number of students" />
              <SummaryCard title="Industry Experts" count={industryExpertsCount} description="Total number of industry experts" />
              <SummaryCard title="Faculties" count={facultiesCount} description="Total number of faculties" />
              <SummaryCard title="Companies" count={companiesCount} description="Total number of companies" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

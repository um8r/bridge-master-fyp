"use client";
import React, { useEffect, useState } from 'react';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DoughnutChart from '../components/DoughnutChart';
import { motion } from 'framer-motion';

const VisualizationsPage: React.FC = () => {
  const [universitiesCount, setUniversitiesCount] = useState<number>(0);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [industryExpertsCount, setIndustryExpertsCount] = useState<number>(0);
  const [facultiesCount, setFacultiesCount] = useState<number>(0);
  const [companiesCount, setCompaniesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChart, setSelectedChart] = useState<string>('bar');

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

  const data = {
    labels: ['Universities', 'Students', 'Industry Experts', 'Faculties', 'Companies'],
    datasets: [
      {
        label: 'Count',
        data: [universitiesCount, studentsCount, industryExpertsCount, facultiesCount, companiesCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: '#000',
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <span className="text-lg text-gray-500 ml-4">Loading...</span>
        </div>
      );
    }

    switch (selectedChart) {
      case 'bar':
        return <BarChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'pie':
        return <PieChart data={data} />;
      case 'doughnut':
        return <DoughnutChart data={data} />;
      default:
        return <p>Unknown chart type</p>;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-10 drop-shadow-lg">Data Visualizations</h1>
      <div className="mb-6 flex justify-center space-x-4">
        {['bar', 'line', 'pie', 'doughnut'].map((chartType) => (
          <motion.button
            key={chartType}
            onClick={() => setSelectedChart(chartType)}
            className={`px-6 py-3 rounded-lg shadow-lg text-white font-bold transition-transform duration-200 ${
              selectedChart === chartType ? 'bg-blue-500 scale-105' : 'bg-gray-700'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </motion.button>
        ))}
      </div>

      <motion.div
        className="w-full max-w-4xl h-96 bg-white rounded-xl shadow-2xl p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {renderChart()}
      </motion.div>
    </div>
  );
};

export default VisualizationsPage;

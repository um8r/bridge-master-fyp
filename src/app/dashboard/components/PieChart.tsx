"use client";
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<{ data: any }> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFF',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Counts by Category (3D Pie Chart)',
        color: '#FFF',
        font: {
          size: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#FFF',
        bodyColor: '#FFF',
      },
    },
    animation: {
      animateScale: true, // Adds the 3D effect when loading
    },
    elements: {
      arc: {
        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'],
        borderColor: '#000',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#FFF',
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.9)',
          'rgba(54, 162, 235, 0.9)',
          'rgba(255, 206, 86, 0.9)',
          'rgba(75, 192, 192, 0.9)',
          'rgba(153, 102, 255, 0.9)',
        ],
      },
    },
  };

  return (
    <div className="w-full h-full p-6 shadow-2xl rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900">
      <Pie data={data} options={options} className="w-full h-full" />
    </div>
  );
};

export default PieChart;

"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC<{ data: any }> = ({ data }) => {
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
        text: 'Counts by Category (3D Bar Chart)',
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
      easing: 'easeInOutQuad' as const,
      duration: 1500,
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#FFF',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#FFF',
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: '#000',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
        hoverBorderColor: '#FFF',
        borderRadius: 5, // Rounded bars for a modern look
      },
    },
  };

  return (
    <div className="w-full h-full p-6 shadow-2xl rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

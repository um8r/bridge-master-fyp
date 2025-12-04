"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart: React.FC<{ data: any }> = ({ data }) => {
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
        text: 'Counts by Category (3D Line Chart)',
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
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
        backgroundColor: '#FFF',
        borderColor: '#FF5733',
        borderWidth: 3,
        hoverBorderColor: '#FFF',
      },
      line: {
        borderColor: '#FF5733',
        borderWidth: 3,
        fill: true,
        backgroundColor: 'rgba(255, 87, 51, 0.3)', // For 3D gradient effect
      },
    },
  };

  return (
    <div className="w-full h-full p-6 shadow-2xl rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900">
      <Line data={data} options={options} className="w-full h-full" />
    </div>
  );
};

export default LineChart;

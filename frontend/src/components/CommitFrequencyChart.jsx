import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CommitFrequencyChart = ({ repos }) => {
  // Generate monthly commit frequency data
  const monthlyData = {};
  
  repos.forEach(repo => {
    const date = new Date(repo.updated_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  // Sort by date and take last 12 months
  const sortedData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a + " 1") - new Date(b + " 1"))
    .slice(-12);

  const data = {
    labels: sortedData.map(([month]) => month),
    datasets: [
      {
        label: 'Repository Updates',
        data: sortedData.map(([, count]) => count),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#ffffff',
        bodyColor: '#D1D5DB',
        borderColor: '#10B981',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `📈 ${context.parsed.y} repository updates`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#D1D5DB',
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Development Activity Trend</h3>
      <div className="h-80">
        {sortedData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>No activity data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitFrequencyChart;
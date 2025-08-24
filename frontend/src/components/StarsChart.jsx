import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StarsChart = ({ repos }) => {
  // Get repositories with stars and sort by star count
  const starredRepos = repos
    .filter(repo => repo.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10); // Top 10 starred repos

  const data = {
    labels: starredRepos.map(repo => repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name),
    datasets: [
      {
        label: 'Stars',
        data: starredRepos.map(repo => repo.stars),
        backgroundColor: 'rgba(251, 191, 36, 0.6)',
        borderColor: '#F59E0B',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
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
        borderColor: '#F59E0B',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `⭐ ${context.parsed.y} stars`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB',
          maxRotation: 45
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
      <h3 className="text-xl font-semibold text-white mb-6">Repository Stars</h3>
      <div className="h-80">
        {starredRepos.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">⭐</div>
              <p>No starred repositories</p>
              <p className="text-sm mt-1">Repositories with stars will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StarsChart;
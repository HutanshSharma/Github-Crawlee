import React, { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, 
  LineElement, ArcElement, Title, Tooltip, Legend
);

const RepoDetail = ({ repo, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'languages', label: 'Languages', icon: '💻' },
    { id: 'activity', label: 'Activity', icon: '📈' },
    { id: 'issues', label: 'Issues & PRs', icon: '🐛' },
    { id: 'pulse', label: 'Pulse', icon: '💓' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{repo.repoData.stars}</div>
          <div className="text-sm text-gray-400">Stars</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{repo.repoData.forks}</div>
          <div className="text-sm text-gray-400">Forks</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent">{repo.repoData.watchers}</div>
          <div className="text-sm text-gray-400">Watchers</div>
        </div>
        <div className="glass-morphism rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{repo.repoData.branches}</div>
          <div className="text-sm text-gray-400">Branches</div>
        </div>
      </div>

      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Repository Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Name:</span>
            <span className="text-white">{repo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Description:</span>
            <span className="text-white text-right max-w-xs">{repo.description || 'No description'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Updated:</span>
            <span className="text-white">{repo.updated_at}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguages = () => {
    const languageData = {
      labels: repo.repoData.languages.map(lang => lang.name),
      datasets: [{
        data: repo.repoData.languages.map(lang => parseFloat(lang.percentage.replace('%', ''))),
        backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#1F2937'
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#D1D5DB', padding: 20 }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
          <div className="h-80">
            {repo.repoData.languages.length > 0 ? (
              <Doughnut data={languageData} options={options} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No language data available
              </div>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Language Breakdown</h3>
          <div className="space-y-3">
            {repo.repoData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index] }}
                  ></div>
                  <span className="text-white">{lang.name}</span>
                </div>
                <span className="text-gray-400">{lang.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => {
    const commitData = Object.entries(repo.commits).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = {
      labels: commitData.map(item => item.date),
      datasets: [{
        label: 'Commits',
        data: commitData.map(item => item.count),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#ffffff',
          bodyColor: '#D1D5DB'
        }
      },
      scales: {
        x: { ticks: { color: '#D1D5DB' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        y: { 
          beginAtZero: true,
          ticks: { color: '#D1D5DB', stepSize: 1 }, 
          grid: { color: 'rgba(255, 255, 255, 0.1)' } 
        }
      }
    };

    return (
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Commit Activity</h3>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>
    );
  };

  const renderIssuesAndPRs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Issues</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Open Issues</span>
              <span className="text-red-400 font-semibold">{repo.issues.open}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Closed Issues</span>
              <span className="text-green-400 font-semibold">{repo.issues.closed}</span>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pull Requests</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Open PRs</span>
              <span className="text-blue-400 font-semibold">{repo.pulls.open}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Closed PRs</span>
              <span className="text-purple-400 font-semibold">{repo.pulls.closed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Milestones</span>
              <span className="text-yellow-400 font-semibold">{repo.pulls.milestones}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Labels</span>
              <span className="text-gray-300 font-semibold">{repo.pulls.labels}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPulse = () => (
    <div className="space-y-6">
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Repository Pulse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-300">Activity Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Discussions</span>
                <span className="text-primary">{repo.pulse.active_discussions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Commits to Main</span>
                <span className="text-accent">{repo.pulse.merges_data.commits_pushed_to_main}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Commits</span>
                <span className="text-secondary">{repo.pulse.merges_data.commits_pushed_to_all_branches}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-300">Code Changes</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Files Changed</span>
                <span className="text-yellow-400">{repo.pulse.merges_data.files_changed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Additions</span>
                <span className="text-green-400">{repo.pulse.merges_data.additions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deletions</span>
                <span className="text-red-400">{repo.pulse.merges_data.deletions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'languages': return renderLanguages();
      case 'activity': return renderActivity();
      case 'issues': return renderIssuesAndPRs();
      case 'pulse': return renderPulse();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">{repo.name}</h1>
            <p className="text-gray-400">{repo.description || 'No description available'}</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'glass-morphism text-gray-300 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import RepoDetail from './components/RepoDetail';
import { mockData } from './data/mockData';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleUserSubmit = (formData) => {
    // In a real app, this would fetch data from your GitHub crawler API
    setUserData({
      ...mockData,
      searchData: formData
    });
    setCurrentPage('dashboard');
  };

  const handleRepoSelect = (repoName) => {
    const repo = mockData.repos.find(r => r.name === repoName);
    setSelectedRepo(repo);
    setCurrentPage('repo-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setSelectedRepo(null);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setUserData(null);
    setSelectedRepo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-300">
      {currentPage === 'home' && (
        <HomePage onSubmit={handleUserSubmit} />
      )}
      
      {currentPage === 'dashboard' && userData && (
        <Dashboard 
          userData={userData} 
          onRepoSelect={handleRepoSelect}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === 'repo-detail' && selectedRepo && (
        <RepoDetail 
          repo={selectedRepo} 
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
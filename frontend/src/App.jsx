import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import RepoDetail from './components/RepoDetail';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const handleUserSubmit = (formData) => {
    // In a real app, this would fetch data from your GitHub crawler API
    setUserData({
      profile: formData
    });
    setCurrentPage('dashboard');
  };

  const handleRepoSelect = (repoName) => {
    (async function handler(){
      const urls = [
        `http://localhost:5000/repo/${userData.profile.nickname}/${repoName}`,
        `http://localhost:5000/pulls/${userData.profile.nickname}/${repoName}`,
        `http://localhost:5000/issues/${userData.profile.nickname}/${repoName}`,
        `http://localhost:5000/pulse/${userData.profile.nickname}/${repoName}`,
        `http://localhost:5000/commits/${userData.profile.nickname}/${repoName}`
      ];

      const responses = await Promise.all(urls.map(url => fetch(url)));
      const results = await Promise.all(responses.map(res => res.json()));
      const data = {"repos":{...results[0]},
                    "pulls":{...results[1]},
                    "issues":{...results[2]},
                    "pulse":{...results[3]},
                    "commits":{...results[4]}}

      console.log(data);
      // setSelectedRepo()
      // setCurrentPage('repo-detail')
    })()
    // const repo = mockData.repos.find(r => r.name === repoName);
    // setSelectedRepo(repo);
    // setCurrentPage('repo-detail');
    console.log('something')
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
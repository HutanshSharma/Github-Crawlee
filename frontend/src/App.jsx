import { useState } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import RepoDetail from './components/RepoDetail';
import Loading from './components/Loading';
import './index.css';
import Search from './components/SearchComponent';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [allrepos, setallrepos] = useState(null);

  const handleUserSubmit = (formData) => {
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
      const data = {"repoData":{...results[0],'repoName':repoName},
                    "pulls":{...results[1]},
                    "issues":{...results[2]},
                    "pulse":{...results[3]},
                    "commits":{...results[4]}}
      setSelectedRepo(data)
      setCurrentPage('repo-detail')
    })()
  };

  const handlereposearch = () => {
    (async function handler(){
      const response = await fetch(`http://localhost:5000/home/${userData.profile.nickname}`)
      const resData = await response.json()
      setallrepos(resData)
      setCurrentPage('repos')
      console.log(resData)
    })()
  }

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
        <HomePage onSubmit={handleUserSubmit} onLoad = {setCurrentPage}/>
      )}

      {currentPage === 'loading' && 
        <Loading />}
      
      {currentPage === 'dashboard' && userData && (
        <Dashboard 
          userData={userData} 
          onRepoSelect={handleRepoSelect}
          onBackToHome={handleBackToHome}
          onLoad = {setCurrentPage}
          loadall = {handlereposearch}
        />
      )}

      {currentPage === 'repos' && <Search repos = {allrepos} onRepoSelect={handleRepoSelect} onLoad = {setCurrentPage}/>}
      
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
import { useMemo } from 'react';
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import RepoCard from './RepoCard';
import ProfileStats from './ProfileStats';
import LanguageChart from './LanguageChart';
import ActivityChart from './ActivityChart';
import StarsChart from './StarsChart';
import RepoSizeChart from './RepoSizeChart';
import CommitFrequencyChart from './CommitFrequencyChart';
import LanguageEvolutionChart from './LanguageEvolutionChart';

const Dashboard = ({ userData, onRepoSelect, onBackToHome, loadall, isloaded, setPrevPage}) => {
  const navigate = useNavigate()

  const filteredRepos = userData.profile.repos_list

  const allLanguages = useMemo(() => {
    const languages = new Set();
    userData.profile.repos_list.forEach(repo => {
      if (repo.most_used_language && repo.most_used_language !== 'N/A') {
        languages.add(repo.most_used_language);
      }
    });
    return Array.from(languages).sort();
  }, [userData.profile.repos_list]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {userData.profile.username}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">@{userData.profile.nickname}</span>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-md flex gap-2">
                <User></User>
                <div>Personal</div>
              </span>
            </div>
          </div>
          <button
            onClick={onBackToHome}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>

        <ProfileStats profile={userData.profile} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LanguageChart repos={userData.profile.repos_list} />
          <ActivityChart repos={userData.profile.repos_list} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StarsChart repos={userData.profile.repos_list} />
          <RepoSizeChart repos={userData.profile.repos_list} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CommitFrequencyChart repos={userData.profile.repos_list} />
          <LanguageEvolutionChart repos={userData.profile.repos_list} />
        </div>

        <div className="glass-morphism rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Repository Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {userData.profile.repos_list.reduce((acc, repo) => acc + (repo.stars || 0), 0)}
              </div>
              <div className="text-gray-400">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {allLanguages.length}
              </div>
              <div className="text-gray-400">Languages Used</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {userData.profile.repos_list.filter(repo => repo.description && repo.description.trim()).length}
              </div>
              <div className="text-gray-400">Documented Repos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {userData.profile.repos_list.filter(repo => new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-gray-400">Recent Updates</div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-5 glass-morphism rounded-xl p-12'>
          <h2 className="text-2xl font-bold text-white">Search Through Repositories</h2>
          {!isloaded && <p>The search process may take some time, depending on the number of repositories being scanned. Larger sets of repositories will naturally require more processing time.</p>}
          {isloaded && <p>Repos data is available search through them</p>}
          <button onClick={()=>{
                              if(!isloaded){
                                loadall()
                                navigate('/loading')
                              }
                              else{
                                navigate('/repos')
                              }
                            }}
            className='w-full bg-gradient-to-r from-primary to-secondary py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100'>
            {!isloaded ? 'Start Searching':'Search'}
          </button>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Latest Repositories ({filteredRepos.length})
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Recently Updated
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Has Stars
              </span>
            </div>
          </div>
          
          {filteredRepos.length === 0 ? (
            <div className="glass-morphism rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No repositories found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <RepoCard
                  key={index}
                  repo={repo}
                  onClick={() =>{
                    onRepoSelect(repo.name)
                    navigate('/loading')
                    setPrevPage('dashboard')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
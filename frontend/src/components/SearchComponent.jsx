import { useState } from "react";
import RepoCard from "./RepoCard";
import { useNavigate } from "react-router-dom"

export default function Search({ repos, onRepoSelect, onBack, setPrevPage }) {
  const navigate = useNavigate()

  const [searchby, setsearchby] = useState("language");
  const [keyword, setKeyword] = useState("");
  const [currentrepos, setcurrentrepos] = useState(repos)

  const handleSearch = () => {
    (async function handler(){
        const response = await fetch(`http://localhost:5000/${searchby}/${keyword}`)
        const resData = await response.json()
        setcurrentrepos(resData)
    })() 
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 md:px-12 py-8">
        <div className="flex justify-between pb-10">
            <h2 className="text-3xl font-bold text-white mb-6 gradient-text">
                Search through Repositories
            </h2>
            <button
                onClick={onBack}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300"
                >
                ← Back to Dashboard
                </button>
        </div>

      <div className="p-6 rounded-2xl mb-10 bg-gray-800 flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <select
          value={searchby}
          onChange={(e) => setsearchby(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 w-full md:w-48"
        >
          <option value="language">Languages</option>
          <option value="search">Keyword</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            if(e.target.value==='') setcurrentrepos(repos)
            setKeyword(e.target.value)}}
          placeholder="Type here..."
          className="w-full md:flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full md:w-auto"
        >
          Search
        </button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Total Repositories ({currentrepos.length})
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

      {currentrepos.length === 0 ? (
        <div className="rounded-xl p-12 text-center bg-gray-800">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No repositories found
          </h3>
          <p className="text-gray-500">
            Either your GitHub is empty or there is some problem with the server
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentrepos.map((repo, index) => (
            <RepoCard
              key={index}
              repo={repo}
              onClick={() => {
                onRepoSelect(repo.name);
                navigate("/loading");
                setPrevPage('search')
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

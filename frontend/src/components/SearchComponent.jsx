import SearchBar from "./SearchBar"
import RepoCard from "./RepoCard"

export default function Search( {repos, onRepoSelect, onLoad} ){
    return (
        <>
            <div className="mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                    Total Repositories ({repos.length})
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
                
                {repos.length === 0 ? (
                    <div className="glass-morphism rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No repositories found</h3>
                    <p className="text-gray-500">Either your github is empty or there is some problem with the server</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo, index) => (
                        <RepoCard
                        key={index}
                        repo={repo}
                        onClick={() =>{
                            onRepoSelect(repo.name)
                            onLoad('loading')
                        }}
                        />
                    ))}
                    </div>
                )}
                </div>
        
        </>
    )
}
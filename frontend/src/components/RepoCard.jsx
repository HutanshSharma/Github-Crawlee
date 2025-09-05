import {Star} from 'lucide-react'

const RepoCard = ({ repo, onClick }) => {
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'TypeScript': '#2b7489',
      'Jupyter Notebook': '#DA5B0B',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95'
    };
    return colors[language] || '#858585';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="glass-morphism rounded-xl p-6 cursor-pointer card-hover transition-all duration-300 hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white truncate flex-1">
          {repo.name}
        </h3>
        <div className="flex items-center text-yellow-400 ml-4">
          <span className="text-sm"><Star size={'15px'}/></span>
          <span className="ml-1 text-sm">{repo.stars}</span>
        </div>
      </div>
      
      {repo.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {repo.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {repo.most_used_language && repo.most_used_language !== 'N/A' && (
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getLanguageColor(repo.most_used_language) }}
              ></div>
              <span className="text-sm text-gray-300">{repo.most_used_language}</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          {formatDate(repo.updated_at)}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
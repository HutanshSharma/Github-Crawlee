import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { GitGraphIcon, Computer, Search, Star,Rocket, EyeClosedIcon, User} from "lucide-react"

const HomePage = ({ onSubmit }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nickname: '',
    accountType: 'personal'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nickname.trim()) return;
    navigate('loading')

    if(formData.accountType === 'personal'){
      (async function handler(){
        const response = await fetch(`http://localhost:5000/profile/${formData.nickname}`)
        const resData = await response.json()
        const data = {...resData,'accountType':formData.accountType}
        onSubmit(data)
      })()
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: Computer,
      title: 'Repository Analytics',
      description: 'Comprehensive analysis of all repositories with detailed statistics and trends'
    },
    {
      icon: EyeClosedIcon,
      title: 'Language Insights',
      description: 'Visual breakdown of programming languages used across all projects'
    },
    {
      icon: GitGraphIcon,
      title: 'Activity Tracking',
      description: 'Monitor commit patterns, contribution frequency, and development activity'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Filter repositories by language, keywords, and various criteria'
    },
    {
      icon: Star,
      title: 'Performance Metrics',
      description: 'Track stars, forks, watchers, and repository engagement metrics'
    },
    {
      icon: Rocket,
      title: 'Project Insights',
      description: 'Deep dive into individual repositories with detailed analytics tabs'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bgbody"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 animate-fade-in">
              GitCrawlee
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              Unlock powerful insights from any GitHub profile with beautiful visualizations, 
              comprehensive analytics, and detailed repository breakdowns
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Real-time Analysis
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                Interactive Charts
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Detailed Metrics
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-20">
            <div className="glass-morphism rounded-3xl p-8 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="e.g. HutanshSharma"
                    className="w-full px-4 py-3 bg-dark-100 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className='flex gap-5 px-4'>
                  <div className="mb-2"><User size={'25px'} className=' text-red-300'/></div>
                  <label className="block text-sm font-medium text-red-300 mb-3">
                    Only Personal Accounts are supported.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  Start Analysis
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Analytics Features</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover comprehensive insights about GitHub profiles with our advanced analysis tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-morphism rounded-xl p-6 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4"><feature.icon className="w-8 h-8 text-white"/></div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-morphism rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">What You'll Discover</h2>
            <p className="text-xl text-gray-400">
              Get detailed insights across multiple dimensions of GitHub activity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center">
              <GitGraphIcon size={'40px'} className="font-bold text-primary mb-2"/>
              <div className="text-2xl font-bold text-white mb-1">Repository</div>
              <div className="text-gray-400">Statistics</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <Computer size={'40px'} className="text-3xl font-bold text-secondary mb-2"/>
              <div className="text-2xl font-bold text-white mb-1">Language</div>
              <div className="text-gray-400">Distribution</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <Rocket size={'40px'} className="text-3xl font-bold text-accent mb-2"/>
              <div className="text-2xl font-bold text-white mb-1">Activity</div>
              <div className="text-gray-400">Patterns</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <Star size={'40px'} className="text-3xl font-bold text-yellow-400 mb-2"/>
              <div className="text-2xl font-bold text-white mb-1">Engagement</div>
              <div className="text-gray-400">Metrics</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-12 text-gray-500">
        <p>Enter a GitHub username above to start exploring comprehensive profile analytics</p>
      </div>
    </div>
  );
};

export default HomePage;
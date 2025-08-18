import React, { useState } from 'react';

const HomePage = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    accountType: 'personal'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nickname.trim()) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: '📊',
      title: 'Repository Analytics',
      description: 'Comprehensive analysis of all repositories with detailed statistics and trends'
    },
    {
      icon: '💻',
      title: 'Language Insights',
      description: 'Visual breakdown of programming languages used across all projects'
    },
    {
      icon: '📈',
      title: 'Activity Tracking',
      description: 'Monitor commit patterns, contribution frequency, and development activity'
    },
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Filter repositories by language, keywords, and various criteria'
    },
    {
      icon: '⭐',
      title: 'Performance Metrics',
      description: 'Track stars, forks, watchers, and repository engagement metrics'
    },
    {
      icon: '🚀',
      title: 'Project Insights',
      description: 'Deep dive into individual repositories with detailed analytics tabs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6 animate-fade-in">
              GitHub Crawler
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

          {/* Form Section */}
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
                    placeholder="e.g. johnnylasagna"
                    className="w-full px-4 py-3 bg-dark-100 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input
                        type="radio"
                        name="accountType"
                        value="personal"
                        checked={formData.accountType === 'personal'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                        formData.accountType === 'personal'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}>
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-medium">Personal</div>
                      </div>
                    </label>
                    
                    <label className="relative">
                      <input
                        type="radio"
                        name="accountType"
                        value="organization"
                        checked={formData.accountType === 'organization'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                        formData.accountType === 'organization'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}>
                        <div className="text-2xl mb-2">🏢</div>
                        <div className="font-medium">Organization</div>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !formData.nickname.trim()}
                  className="w-full bg-gradient-to-r from-primary to-secondary py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Analyzing Profile...
                    </div>
                  ) : (
                    'Start Analysis'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
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
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Preview Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-morphism rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">What You'll Discover</h2>
            <p className="text-xl text-gray-400">
              Get detailed insights across multiple dimensions of GitHub activity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">📊</div>
              <div className="text-2xl font-bold text-white mb-1">Repository</div>
              <div className="text-gray-400">Statistics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">💻</div>
              <div className="text-2xl font-bold text-white mb-1">Language</div>
              <div className="text-gray-400">Distribution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">📈</div>
              <div className="text-2xl font-bold text-white mb-1">Activity</div>
              <div className="text-gray-400">Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">⭐</div>
              <div className="text-2xl font-bold text-white mb-1">Engagement</div>
              <div className="text-gray-400">Metrics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-12 text-gray-500">
        <p>Enter a GitHub username above to start exploring comprehensive profile analytics</p>
      </div>
    </div>
  );
};

export default HomePage;
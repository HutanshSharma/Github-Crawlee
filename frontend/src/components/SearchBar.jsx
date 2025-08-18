import React from 'react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  languageFilter, 
  onLanguageChange, 
  languages 
}) => {
  return (
    <div className="glass-morphism rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
            Search Repositories
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full px-4 py-3 bg-dark-100 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>
        
        <div className="md:w-64">
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Language
          </label>
          <select
            id="language"
            value={languageFilter}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-4 py-3 bg-dark-100 border border-gray-600 rounded-xl text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          >
            <option value="">All Languages</option>
            {languages.map(language => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
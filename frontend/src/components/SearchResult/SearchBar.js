import React, { useState } from 'react';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(query);
  };

  return (
    <div className="search-bar bg-white shadow-sm border-bottom mb-4">
      <div className="container-fluid px-3 py-3">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search hostels, cities, or destinations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

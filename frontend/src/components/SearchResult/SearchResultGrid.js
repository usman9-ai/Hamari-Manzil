import React, { useState, useEffect } from 'react';
import HostelCard from '../HostelListing/HostelCard';

const SearchResultGrid = ({ searchQuery, filters, hostels }) => {
  const [searchResults, setSearchResults] = useState(hostels || []);
  const [loading, setLoading] = useState(!hostels);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hostels) {
      performSearch();
    }
  }, [searchQuery, filters, hostels]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        ...filters
      });

      const response = await fetch(`/api/hostels/search/?${queryParams}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || data);
    } catch (error) {
      setError(error.message);
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="search-result-grid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-semibold">Search Results</h4>
          <div className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </div>
        </div>
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="placeholder-glow">
                  <div className="placeholder" style={{ height: '200px' }}></div>
                </div>
                <div className="card-body">
                  <div className="placeholder-glow">
                    <h5 className="placeholder col-8"></h5>
                    <p className="placeholder col-6"></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-result-grid">
        <div className="alert alert-danger text-center" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            className="btn btn-outline-danger ms-3"
            onClick={performSearch}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="search-result-grid">
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No hostels found</h4>
          <p className="text-muted">
            Try adjusting your search criteria or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-result-grid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold">
          {searchResults.length} hostel{searchResults.length !== 1 ? 's' : ''} found
        </h4>
        <div className="view-toggle">
          <div className="btn-group" role="group">
            <button type="button" className="btn btn-outline-secondary active">
              <i className="fas fa-th"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary">
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {searchResults.map((hostel) => (
          <HostelCard
            key={hostel.id}
            hostel={hostel}
            showFavoriteIcon={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultGrid;

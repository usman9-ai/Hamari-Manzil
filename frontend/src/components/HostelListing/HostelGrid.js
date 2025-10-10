import React, { useState, useEffect } from 'react';
import HostelCard from './HostelCard';

const HostelGrid = ({ filters, hostels }) => {
  const [hostelData, setHostelData] = useState(hostels || []);
  const [loading, setLoading] = useState(!hostels);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!hostels) {
      fetchHostels();
    }
  }, [filters, hostels]);

  const fetchHostels = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: pageNum,
        ...filters
      });

      const response = await fetch(`/api/hostels/?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hostels');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setHostelData(data.results || data);
      } else {
        setHostelData(prev => [...prev, ...(data.results || data)]);
      }
      
      setHasMore(data.next ? true : false);
      setPage(pageNum);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchHostels(page + 1);
    }
  };

  const handleFavoriteToggle = (hostelId, isFavorited) => {
    setHostelData(prev =>
      prev.map(hostel =>
        hostel.id === hostelId
          ? { ...hostel, isFavorited }
          : hostel
      )
    );
  };

  if (loading && hostelData.length === 0) {
    return (
      <div className="container">
        <div className="row">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="placeholder-glow">
                  <div className="placeholder" style={{ height: '200px' }}></div>
                </div>
                <div className="card-body">
                  <div className="placeholder-glow">
                    <h5 className="placeholder col-8"></h5>
                    <p className="placeholder col-6"></p>
                    <p className="placeholder col-4"></p>
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
      <div className="container">
        <div className="alert alert-danger text-center" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            className="btn btn-outline-danger ms-3"
            onClick={() => fetchHostels(1)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (hostelData.length === 0) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No hostels found</h4>
          <p className="text-muted">
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-semibold">
          {hostelData.length} hostel{hostelData.length !== 1 ? 's' : ''} found
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
        {hostelData.map((hostel) => (
          <HostelCard
            key={hostel.id}
            hostel={hostel}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HostelGrid;

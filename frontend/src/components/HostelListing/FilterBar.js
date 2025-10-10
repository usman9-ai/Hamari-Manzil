import React, { useState } from 'react';

const FilterBar = ({ onFilterChange, filters = {} }) => {
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    priceRange: [0, 100],
    rating: 0,
    amenities: [],
    roomType: '',
    ...filters
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = activeFilters.amenities.includes(amenity)
      ? activeFilters.amenities.filter(a => a !== amenity)
      : [...activeFilters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      priceRange: [0, 100],
      rating: 0,
      amenities: [],
      roomType: ''
    };
    setActiveFilters(clearedFilters);
    onFilterChange && onFilterChange(clearedFilters);
  };

  const amenitiesList = ['WiFi', 'Breakfast', 'Parking', 'Laundry', 'Kitchen', 'AC', 'Pool', 'Gym'];
  const roomTypes = ['Dorm', 'Private', 'Female Only', 'Mixed'];

  return (
    <div className="filter-bar bg-white shadow-sm mb-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center flex-grow-1">
            <div className="search-input me-3 flex-grow-1">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by city, hostel name..."
                  value={activeFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter me-1"></i>
              Filters
              {Object.values(activeFilters).some(v => v && v.length > 0) && (
                <span className="badge bg-primary ms-1">!</span>
              )}
            </button>
          </div>
          <div className="sort-dropdown">
            <select 
              className="form-select"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="rating">Sort by Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel border-top py-3">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-medium">Price Range</label>
                <div className="d-flex align-items-center">
                  <input
                    type="range"
                    className="form-range me-2"
                    min="0"
                    max="200"
                    value={activeFilters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  />
                  <span className="text-muted small">${activeFilters.priceRange[1]}</span>
                </div>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-medium">Min Rating</label>
                <select
                  className="form-select"
                  value={activeFilters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-medium">Room Type</label>
                <select
                  className="form-select"
                  value={activeFilters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                >
                  <option value="">Any Type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-5">
                <label className="form-label fw-medium">Amenities</label>
                <div className="d-flex flex-wrap gap-2">
                  {amenitiesList.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      className={`btn btn-sm ${
                        activeFilters.amenities.includes(amenity)
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

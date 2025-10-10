import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange, filters = {} }) => {
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 200],
    rating: 0,
    amenities: [],
    roomType: '',
    ...filters
  });

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
      priceRange: [0, 200],
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
    <div className="filter-sidebar bg-white shadow-sm rounded p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-semibold mb-0">Filters</h5>
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>

      <div className="filter-section mb-4">
        <h6 className="fw-medium mb-3">Price Range</h6>
        <div className="d-flex align-items-center">
          <input
            type="range"
            className="form-range me-3"
            min="0"
            max="200"
            value={activeFilters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
          />
          <span className="text-muted">${activeFilters.priceRange[1]}</span>
        </div>
      </div>

      <div className="filter-section mb-4">
        <h6 className="fw-medium mb-3">Rating</h6>
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

      <div className="filter-section mb-4">
        <h6 className="fw-medium mb-3">Room Type</h6>
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

      <div className="filter-section">
        <h6 className="fw-medium mb-3">Amenities</h6>
        <div className="d-flex flex-column gap-2">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={amenity}
                checked={activeFilters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <label className="form-check-label" htmlFor={amenity}>
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

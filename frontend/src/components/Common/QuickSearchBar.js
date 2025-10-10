import React, { useState } from 'react';

const QuickSearchBar = ({ onSearch }) => {

  //Manage form input values
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  // ----- HANDLE INPUT CHANGE -----
  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  // ----- HANDLE SUBMIT -----
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(searchData);
  };

  return (
    <div className="quick-search-bar bg-white rounded shadow-lg p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* Destination input */}
          <div className="col-12">
            <label className="form-label fw-medium">Where to?</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                name="destination"
                value={searchData.destination}
                onChange={handleChange}
                placeholder="Enter destination"
              />
            </div>
          </div>
          
          {/* Check-in date picker */}
          <div className="col-12">
            <label className="form-label fw-medium">Check in</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              <span className="input-group-text bg-transparent border-start-0">
                <i className="fas fa-calendar text-muted"></i>
              </span>
            </div>
          </div>
          
          {/* Check-out date picker */}
          <div className="col-12">
            <label className="form-label fw-medium">Check out</label>
            <div className="input-group">
              <input
                type="date"
                className="form-control"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleChange}
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              />
              <span className="input-group-text bg-transparent border-start-0">
                <i className="fas fa-calendar text-muted"></i>
              </span>
            </div>
          </div>
          
          {/* Guests dropdown */}
          <div className="col-12">
            <label className="form-label fw-medium">Guests</label>
            <select
              className="form-select"
              name="guests"
              value={searchData.guests}
              onChange={handleChange}
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>
                  {num} guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
           
           {/* Search Button*/}
          <div className="col-12 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              <i className="fas fa-search me-2"></i>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickSearchBar;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopHeader from "../../components/TopHeader";
import HostelCard from "../../components/HostelCard";
import { hostels, notifications, userProfile } from "../../data/hostels";

const HostelSearch = () => {
  const [user] = useState(userProfile);
  const [searchParams] = useSearchParams();
  const [wishlist, setWishlist] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState(hostels);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    roomType: "",
    amenities: [],
    minRating: 0,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ===== Notification Counter =====
  const getUnreadNotifications = () =>
    notifications.filter((n) => !n.read).length;

  const userWithStats = {
    ...user,
    unreadNotifications: getUnreadNotifications(),
  };

  // ===== Dropdown lists =====
  const allAmenities = [
    "Wi-Fi",
    "Parking",
    "Laundry",
    "Mess",
    "Security",
    "Air Conditioning",
    "Attached Bathroom",
  ];

  const allRoomTypes = ["Single", "Double", "Triple", "Shared"];

  // ===== Load city from search params =====
  useEffect(() => {
    const location = searchParams.get("location") || "";
    setFilters((prev) => ({ ...prev, location }));
  }, [searchParams]);

  // ===== Handlers =====
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const applyFilters = () => {
    const results = hostels.filter((hostel) => {
      const matchesLocation = filters.location
        ? hostel.city.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const matchesPrice =
        (!filters.minPrice || hostel.price >= filters.minPrice) &&
        (!filters.maxPrice || hostel.price <= filters.maxPrice);
      const matchesRoomType = filters.roomType
        ? hostel.roomType === filters.roomType
        : true;
      const matchesAmenities = filters.amenities.every((a) =>
        hostel.amenities.includes(a)
      );
      const matchesRating = hostel.rating >= filters.minRating;

      return (
        matchesLocation &&
        matchesPrice &&
        matchesRoomType &&
        matchesAmenities &&
        matchesRating
      );
    });

    setFilteredHostels(results);
    setMobileFiltersOpen(false); // auto-close on mobile
  };

  const handleAddToWishlist = (hostelId) => {
    setWishlist((prev) => [...prev, hostelId]);
  };

  const handleRemoveFromWishlist = (hostelId) => {
    setWishlist((prev) => prev.filter((id) => id !== hostelId));
  };

  return (
    <div className="d-flex flex-column flex-lg-row bg-light min-vh-100">
      {/* ===== Sidebar (Desktop) ===== */}
      
        <Sidebar user={userWithStats} />

      {/* ===== Main Section ===== */}
      <div className="flex-grow-1">
        {/* ===== Header (same as Dashboard) ===== */}
        <TopHeader user={userWithStats} />

        <div className="container my-4">
          {/* ===== Mobile Filter Button ===== */}
          <div className="d-lg-none mb-3">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <i className="fas fa-filter me-2"></i>
              {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* ===== Mobile Filters ===== */}
          {mobileFiltersOpen && (
            <div className="d-lg-none mb-4">
              <div className="card border-0 shadow-sm p-3">
                <div className="row g-3">
                  {/* City */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city name"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                    />
                  </div>

                  {/* Price */}
                  <div className="col-6">
                    <label className="form-label fw-semibold">Min Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Max Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                    />
                  </div>

                  {/* Room Type */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Room Type</label>
                    <select
                      className="form-select"
                      value={filters.roomType}
                      onChange={(e) =>
                        handleFilterChange("roomType", e.target.value)
                      }
                    >
                      <option value="">All Types</option>
                      {allRoomTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Minimum Rating
                    </label>
                    <select
                      className="form-select"
                      value={filters.minRating}
                      onChange={(e) =>
                        handleFilterChange("minRating", +e.target.value)
                      }
                    >
                      <option value={0}>Any</option>
                      <option value={3}>3+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>

                  {/* Amenities */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Amenities</label>
                    <div
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {allAmenities.map((amenity) => (
                        <div key={amenity} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                          />
                          <label className="form-check-label">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12 text-end">
                    <button
                      className="btn btn-primary mt-2 px-4"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Main Grid ===== */}
          <div className="row">
            {/* Sidebar Filters (Desktop) */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="card border-0 shadow-sm p-3">
                <h5 className="fw-bold mb-3">Filters</h5>

                <label className="form-label fw-semibold">City</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter city name"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />

                <label className="form-label fw-semibold">Price Range</label>
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>

                <label className="form-label fw-semibold">Room Type</label>
                <select
                  className="form-select mb-3"
                  value={filters.roomType}
                  onChange={(e) =>
                    handleFilterChange("roomType", e.target.value)
                  }
                >
                  <option value="">All Types</option>
                  {allRoomTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>

                <label className="form-label fw-semibold">Rating</label>
                <select
                  className="form-select mb-3"
                  value={filters.minRating}
                  onChange={(e) =>
                    handleFilterChange("minRating", +e.target.value)
                  }
                >
                  <option value={0}>Any</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>

                <label className="form-label fw-semibold">Amenities</label>
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {allAmenities.map((amenity) => (
                    <div key={amenity} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <label className="form-check-label">{amenity}</label>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary w-100 mt-3" onClick={applyFilters}>
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Hostel Results */}
            <div className="col-lg-9">
              {filteredHostels.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
                  {filteredHostels.map((hostel) => (
                    <div key={hostel.id} className="d-flex align-items-stretch">
                      <HostelCard
                        hostel={hostel}
                        isInWishlist={wishlist.includes(hostel.id)}
                        onAddToWishlist={handleAddToWishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">No hostels found</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelSearch;

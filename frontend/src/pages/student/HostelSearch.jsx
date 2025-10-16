import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopHeader from "../../components/TopHeader";
import HostelCard from "../../components/HostelCard";
import { dummyHostels, hostelFacilitiesOptions } from "../../services/hostelDummyData";
import { userProfile, notifications } from "../../data/hostels";

const HostelSearch = () => {
  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    facilities: [],
    minPrice: "",
    maxPrice: "",
    minRating: 0,
  });

  const [filteredHostels, setFilteredHostels] = useState(dummyHostels);
  const [wishlist, setWishlist] = useState([]);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const userWithNotifications = { ...userProfile, unreadNotifications };

  // Mobile sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false); 

  const applyFilters = () => {
    const results = dummyHostels.filter((hostel) => {
      const matchesLocation = filters.location
        ? hostel.city.toLowerCase().includes(filters.location.toLowerCase())
        : true;
      const matchesGender = filters.gender
        ? hostel.gender === filters.gender
        : true;

      let minPrice = 0;
      let maxPrice = Infinity;
      if (filters.minPrice) minPrice = Number(filters.minPrice);
      if (filters.maxPrice) maxPrice = Number(filters.maxPrice) || Infinity;

      const matchesPrice = hostel.price >= minPrice && hostel.price <= maxPrice;
      const matchesFacilities =
        filters.facilities.length > 0
          ? filters.facilities.every((f) => hostel.facilities.includes(f))
          : true;

      const minRating = Number(filters.minRating) || 0;
      const matchesRating = hostel.rating >= minRating;

      return (
        matchesLocation &&
        matchesGender &&
        matchesPrice &&
        matchesFacilities &&
        matchesRating
      );
    });

    setFilteredHostels(results);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFacilityChange = (facility) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleAddToWishlist = (hostelId) => {
    if (!wishlist.includes(hostelId)) {
      setWishlist([...wishlist, hostelId]);
    }
  };

  const handleRemoveFromWishlist = (hostelId) => {
    setWishlist(wishlist.filter((id) => id !== hostelId));
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      <Sidebar
        user={userWithNotifications}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <main className="flex-grow-1">
        <TopHeader
          user={userWithNotifications}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title="Hostel Search"
        />

        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3 d-lg-none">
            {/* Mobile Filter Toggle Button */}
            <button
              className="btn btn-outline-primary"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              {mobileFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="row">
            {/* Filters Section */}
            <div
              className={`col-12 mb-4 mb-md-0 col-md-3 ${
                mobileFilterOpen ? "d-block" : "d-none d-md-block"
              }`}
            >
              <div className="card p-3 shadow-sm">
                <h5>Filters</h5>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter city name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Price Range (PKR)</label>
                  <select
                    name="priceRange"
                    value={`${filters.minPrice}-${filters.maxPrice}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split("-");
                      setFilters({
                        ...filters,
                        minPrice: min,
                        maxPrice: max || Infinity,
                      });
                    }}
                    className="form-select"
                  >
                    <option value="-">All</option>
                    <option value="0-10000">Below 10,000</option>
                    <option value="10000-20000">10,000 - 20,000</option>
                    <option value="20000-30000">20,000 - 30,000</option>
                    <option value="30000-50000">30,000 - 50,000</option>
                    <option value="50000-">Above 50,000</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Minimum Rating</label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">All</option>
                    <option value="1">1 and above</option>
                    <option value="2">2 and above</option>
                    <option value="3">3 and above</option>
                    <option value="4">4 and above</option>
                    <option value="4.5">4.5 and above</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Facilities</label>
                  <div className="d-flex flex-wrap gap-2">
                    {hostelFacilitiesOptions.map((facility) => (
                      <button
                        key={facility}
                        className={`btn btn-sm ${
                          filters.facilities.includes(facility)
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleFacilityChange(facility)}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hostels List */}
            <div className="col-12 col-md-9">
              <div className="row g-3">
                {filteredHostels.length > 0 ? (
                  filteredHostels.map((hostel) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={hostel.id}>
                      <HostelCard
                        hostel={hostel}
                        isInWishlist={wishlist.includes(hostel.id)}
                        onAddToWishlist={handleAddToWishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted mt-4">
                    No hostels found with the selected filters.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostelSearch;

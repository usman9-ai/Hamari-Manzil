import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostels } from '../../actions/hostelActions';
import LocationPrompt from '../../components/student/LocationPrompt';
import { Badge } from '../../components/ui/Badge';

const BrowseHostels = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [filteredHostels, setFilteredHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLocationPrompt, setShowLocationPrompt] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('distance'); // distance, price-low, price-high, rating, newest
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const facilities = [
        'WiFi',
        'AC',
        'Laundry',
        'Kitchen',
        'Parking',
        'Security',
        'Gym',
        'Study Room',
    ];

    useEffect(() => {
        // Check if location is set in localStorage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            setUserLocation(JSON.parse(savedLocation));
        } else {
            setShowLocationPrompt(true);
        }
        
        loadHostels();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [hostels, searchQuery, selectedCity, selectedGender, priceRange, sortBy, selectedFacilities, userLocation]);

    const loadHostels = async () => {
        setLoading(true);
        const result = await getHostels();
        if (result.success) {
            // Show all enabled hostels (verified and unverified)
            const availableHostels = result.data.filter(h => !h.disabled);
            setHostels(availableHostels);
        }
        setLoading(false);
    };

    const handleLocationSelect = (location) => {
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
        setShowLocationPrompt(false);
    };

    const calculateDistance = (hostelLat, hostelLng) => {
        if (!userLocation || !userLocation.latitude || !hostelLat || !hostelLng) {
            return null;
        }

        const R = 6371; // Earth's radius in km
        const dLat = (hostelLat - userLocation.latitude) * Math.PI / 180;
        const dLon = (hostelLng - userLocation.longitude) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLocation.latitude * Math.PI / 180) *
            Math.cos(hostelLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const applyFilters = () => {
        let filtered = [...hostels];

        // Search query
        if (searchQuery) {
            filtered = filtered.filter(h =>
                h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // City filter
        if (selectedCity) {
            filtered = filtered.filter(h => h.city === selectedCity);
        }

        // Gender filter
        if (selectedGender) {
            filtered = filtered.filter(h => h.genderType === selectedGender || h.genderType === 'coed');
        }

        // Price range filter (we'll need to get min price from rooms)
        // For now, skip price filter as it requires room data

        // Facilities filter
        if (selectedFacilities.length > 0) {
            filtered = filtered.filter(h =>
                selectedFacilities.every(f => h.facilities?.includes(f))
            );
        }

        // Calculate distances
        filtered = filtered.map(h => ({
            ...h,
            distance: calculateDistance(h.latitude, h.longitude)
        }));

        // Sorting
        switch (sortBy) {
            case 'distance':
                filtered.sort((a, b) => {
                    if (!a.distance) return 1;
                    if (!b.distance) return -1;
                    return a.distance - b.distance;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setFilteredHostels(filtered);
    };

    const toggleFacility = (facility) => {
        setSelectedFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCity('');
        setSelectedGender('');
        setPriceRange({ min: '', max: '' });
        setSortBy('distance');
        setSelectedFacilities([]);
    };

    const cities = [...new Set(hostels.map(h => h.city))].sort();

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Location Prompt */}
            <LocationPrompt
                show={showLocationPrompt}
                onLocationSelect={handleLocationSelect}
            />

            {/* Header/Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container-fluid px-4">
                    <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
                        <div
                            className="bg-primary rounded d-flex align-items-center justify-content-center me-2"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <i className="fas fa-home text-white"></i>
                        </div>
                        <span style={{ fontSize: '24px', color: '#4f46e5' }}>Hamari Manzil</span>
                    </a>
                    
                    <div className="d-flex gap-2 align-items-center">
                        <button
                            className="btn btn-outline-primary d-none d-md-inline-flex align-items-center"
                            onClick={() => setShowLocationPrompt(true)}
                        >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {userLocation ? userLocation.city : 'Set Location'}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/hostel/login')}
                        >
                            <i className="fas fa-building me-2"></i>
                            <span className="d-none d-md-inline">Register Your Hostel</span>
                            <span className="d-md-none">Register</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div
                className="py-5"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-3">Find Your Perfect Hostel</h1>
                            <p className="lead mb-4">
                                Discover comfortable, affordable, and verified hostels near you
                            </p>
                            
                            {/* Search Bar */}
                            <div className="input-group input-group-lg shadow-lg" style={{ borderRadius: '50px', overflow: 'hidden' }}>
                                <span className="input-group-text bg-white border-0 ps-4">
                                    <i className="fas fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search hostels by name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ fontSize: '16px' }}
                                />
                                <button className="btn btn-primary px-4" style={{ fontWeight: '600' }}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-fluid px-4 py-4">
                <div className="row g-4">
                    {/* Filters Sidebar */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px', borderRadius: '16px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0">
                                        <i className="fas fa-filter me-2 text-primary"></i>
                                        Filters
                                    </h5>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>
                                </div>

                                {/* Sort By */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Sort By</label>
                                    <select
                                        className="form-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="distance">Nearest First</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="newest">Newest First</option>
                                    </select>
                                </div>

                                {/* City Filter */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">City</label>
                                    <select
                                        className="form-select"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                    >
                                        <option value="">All Cities</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gender Filter */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Gender Type</label>
                                    <div className="d-flex gap-2">
                                        <button
                                            className={`btn btn-sm flex-grow-1 ${selectedGender === 'boys' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                            onClick={() => setSelectedGender(selectedGender === 'boys' ? '' : 'boys')}
                                            style={{ borderRadius: '8px', fontWeight: '600' }}
                                        >
                                            <i className="fas fa-male me-1"></i>
                                            Boys
                                        </button>
                                        <button
                                            className={`btn btn-sm flex-grow-1 ${selectedGender === 'girls' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                            onClick={() => setSelectedGender(selectedGender === 'girls' ? '' : 'girls')}
                                            style={{ borderRadius: '8px', fontWeight: '600' }}
                                        >
                                            <i className="fas fa-female me-1"></i>
                                            Girls
                                        </button>
                                    </div>
                                </div>

                                {/* Facilities Filter */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Facilities</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {facilities.map(facility => (
                                            <button
                                                key={facility}
                                                className={`btn btn-sm ${
                                                    selectedFacilities.includes(facility)
                                                        ? 'btn-primary text-white'
                                                        : 'btn-outline-secondary'
                                                }`}
                                                onClick={() => toggleFacility(facility)}
                                                style={{ borderRadius: '8px', fontWeight: '500' }}
                                            >
                                                {facility}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hostels Grid */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">
                                {filteredHostels.length} Hostels Found
                                {userLocation && userLocation.city && (
                                    <span className="text-muted fs-6 ms-2">
                                        in {userLocation.city}
                                    </span>
                                )}
                            </h4>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mt-3">Loading hostels...</p>
                            </div>
                        ) : filteredHostels.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No hostels found</h5>
                                <p className="text-muted">Try adjusting your filters</p>
                                <button className="btn btn-primary" onClick={resetFilters}>
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredHostels.map(hostel => (
                                    <div key={hostel.id} className="col-md-6 col-xl-4">
                                        <div
                                            className="card border-0 shadow-sm h-100"
                                            style={{
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                            }}
                                            onClick={() => navigate(`/hostel-details/${hostel.id}`)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            {/* Image */}
                                            <div
                                                style={{
                                                    height: '200px',
                                                    backgroundImage: `url(${hostel.images?.[0] || '/placeholder-hostel.jpg'})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                {/* Verified Badge */}
                                                {hostel.verified && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '12px',
                                                            right: '12px',
                                                        }}
                                                    >
                                                        <span className="badge bg-success">
                                                            <i className="fas fa-check-circle me-1"></i>
                                                            Verified
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {/* Distance Badge */}
                                                {hostel.distance && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: '12px',
                                                            left: '12px',
                                                        }}
                                                    >
                                                        <span className="badge bg-white text-dark">
                                                            <i className="fas fa-map-marker-alt me-1 text-primary"></i>
                                                            {hostel.distance.toFixed(1)} km away
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="fw-bold mb-0" style={{ fontSize: '18px' }}>
                                                        {hostel.name}
                                                    </h5>
                                                    <Badge variant={hostel.genderType === 'boys' ? 'primary' : hostel.genderType === 'girls' ? 'danger' : 'info'}>
                                                        {hostel.genderType}
                                                    </Badge>
                                                </div>
                                                
                                                <p className="text-muted small mb-2">
                                                    <i className="fas fa-map-marker-alt me-1"></i>
                                                    {hostel.city}
                                                </p>

                                                {hostel.description && (
                                                    <p
                                                        className="text-muted small mb-3"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {hostel.description}
                                                    </p>
                                                )}

                                                {/* Facilities */}
                                                {hostel.facilities && hostel.facilities.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-1 mb-3">
                                                        {hostel.facilities.slice(0, 3).map((facility, idx) => (
                                                            <span key={idx} className="badge bg-light text-dark" style={{ fontSize: '11px' }}>
                                                                {facility}
                                                            </span>
                                                        ))}
                                                        {hostel.facilities.length > 3 && (
                                                            <span className="badge bg-light text-dark" style={{ fontSize: '11px' }}>
                                                                +{hostel.facilities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <button className="btn btn-primary btn-sm w-100" style={{ borderRadius: '8px', fontWeight: '600' }}>
                                                    View Details
                                                    <i className="fas fa-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-top mt-5 py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
                            <p className="text-muted mb-0">
                                © 2025 Hamari Manzil. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-4 text-center mb-3 mb-md-0">
                            <a href="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</a>
                            <span className="text-muted">•</span>
                            <a href="/terms" className="text-muted text-decoration-none ms-3">Terms & Conditions</a>
                        </div>
                        <div className="col-md-4 text-center text-md-end">
                            <a href="https://wa.me/923004334270" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                                <i className="fas fa-headset me-2"></i>
                                Need Help? Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BrowseHostels;

import React, { useState, useEffect, useRef } from 'react';

const LocationPickerModal = ({
    show,
    onHide,
    onLocationSelect,
    initialLocation = null
}) => {
    const [address, setAddress] = useState(initialLocation?.address || '');
    const [location, setLocation] = useState(
        initialLocation?.lat && initialLocation?.lng
            ? { lat: initialLocation.lat, lng: initialLocation.lng }
            : { lat: 31.5204, lng: 74.3587 } // Default: Lahore, Pakistan
    );
    const [mapError, setMapError] = useState('');
    const [loading, setLoading] = useState(false);

    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markerRef = useRef(null);
    const autocompleteRef = useRef(null);
    const searchInputRef = useRef(null);

    // Initialize Google Maps
    useEffect(() => {
        if (!show) return;

        const initializeMap = () => {
            if (!window.google) {
                setMapError('Google Maps API not loaded. Please add your API key.');
                return;
            }

            try {
                // Initialize map
                const map = new window.google.maps.Map(mapRef.current, {
                    center: location,
                    zoom: 15,
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                googleMapRef.current = map;

                // Initialize marker
                const marker = new window.google.maps.Marker({
                    position: location,
                    map: map,
                    draggable: true,
                    animation: window.google.maps.Animation.DROP,
                });

                markerRef.current = marker;

                // Marker drag event
                marker.addListener('dragend', () => {
                    const position = marker.getPosition();
                    const newLocation = {
                        lat: position.lat(),
                        lng: position.lng(),
                    };
                    setLocation(newLocation);

                    // Reverse geocode to get address
                    reverseGeocode(newLocation);
                });

                // Map click event
                map.addListener('click', (e) => {
                    const newLocation = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    };
                    setLocation(newLocation);
                    marker.setPosition(e.latLng);

                    // Reverse geocode to get address
                    reverseGeocode(newLocation);
                });

                // Initialize autocomplete with a small delay
                setTimeout(() => {
                    if (searchInputRef.current && window.google && window.google.maps.places) {
                        const autocomplete = new window.google.maps.places.Autocomplete(
                            searchInputRef.current,
                            {
                                componentRestrictions: { country: 'pk' }, // Restrict to Pakistan
                                fields: ['formatted_address', 'geometry', 'name'],
                                types: ['establishment', 'geocode'], // Allow all types of places
                            }
                        );

                        autocompleteRef.current = autocomplete;

                        autocomplete.addListener('place_changed', () => {
                            const place = autocomplete.getPlace();

                            if (!place.geometry || !place.geometry.location) {
                                setMapError('No details available for input: ' + place.name);
                                return;
                            }

                            const newLocation = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                            };

                            setLocation(newLocation);
                            setAddress(place.formatted_address || place.name);

                            map.setCenter(place.geometry.location);
                            map.setZoom(17);
                            marker.setPosition(place.geometry.location);
                        });
                    }
                }, 500);

                setMapError('');
            } catch (error) {
                console.error('Map initialization error:', error);
                setMapError('Failed to initialize map. Please try again.');
            }
        };

        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            // Wait for the API to load
            const checkGoogleMaps = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkGoogleMaps);
                    initializeMap();
                }
            }, 100);

            // Cleanup interval after 10 seconds
            setTimeout(() => clearInterval(checkGoogleMaps), 10000);
        }
    }, [show]);

    // Update map when location changes externally
    useEffect(() => {
        if (googleMapRef.current && markerRef.current && location) {
            const latLng = new window.google.maps.LatLng(location.lat, location.lng);
            googleMapRef.current.setCenter(latLng);
            markerRef.current.setPosition(latLng);
        }
    }, [location]);

    // Reverse geocode to get address from coordinates
    const reverseGeocode = (coords) => {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setAddress(results[0].formatted_address);
            }
        });
    };

    // Get current location
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setLocation(newLocation);

                if (googleMapRef.current && markerRef.current) {
                    const latLng = new window.google.maps.LatLng(newLocation.lat, newLocation.lng);
                    googleMapRef.current.setCenter(latLng);
                    googleMapRef.current.setZoom(17);
                    markerRef.current.setPosition(latLng);
                }

                // Reverse geocode to get address
                reverseGeocode(newLocation);
                setLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please enter address manually.');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    // Handle confirm
    const handleConfirm = () => {
        if (!location.lat || !location.lng) {
            alert('Please select a location on the map');
            return;
        }

        onLocationSelect({
            address: address,
            latitude: location.lat,
            longitude: location.lng,
        });

        onHide();
    };

    if (!show) return null;

    return (
        <>
            <style>
                {`
                    /* Ensure autocomplete dropdown appears above everything */
                    .pac-container {
                        z-index: 9999 !important;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        margin-top: 4px;
                    }
                    
                    .pac-item {
                        padding: 10px;
                        cursor: pointer;
                    }
                    
                    .pac-item:hover {
                        background-color: #f0f0f0;
                    }
                `}
            </style>
            <div
                className="modal show d-block"
                tabIndex="-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Set Hostel Location
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onHide}
                            ></button>
                        </div>

                        <div className="modal-body">
                            {/* Search and Current Location */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-9">
                                    <label className="form-label">
                                        <i className="fas fa-search me-2"></i>
                                        Search Location
                                    </label>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter hostel address (e.g., Model Town, Lahore)"
                                        defaultValue={address}
                                        autoComplete="off"
                                        onKeyDown={(e) => {
                                            // Prevent form submission on Enter
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        Start typing to search for an address
                                    </small>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label d-block">&nbsp;</label>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100"
                                        onClick={handleGetCurrentLocation}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Getting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-location-arrow me-2"></i>
                                                Current Location
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="fas fa-map me-2"></i>
                                    Drag the marker or click on the map to set precise location
                                </label>
                                <div
                                    ref={mapRef}
                                    style={{
                                        width: '100%',
                                        height: '450px',
                                        borderRadius: '8px',
                                        border: '1px solid #dee2e6'
                                    }}
                                >
                                    {mapError && (
                                        <div className="alert alert-warning m-3">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {mapError}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Selected Location Info */}
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6 className="card-title mb-3">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Selected Location
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <strong>Address:</strong>
                                            <p className="mb-0 text-muted">
                                                {address || 'No address selected'}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Latitude:</strong>
                                            <p className="mb-0 text-muted">
                                                {location.lat.toFixed(6)}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Longitude:</strong>
                                            <p className="mb-0 text-muted">
                                                {location.lng.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="alert alert-info mt-3 mb-0">
                                <strong>
                                    <i className="fas fa-lightbulb me-2"></i>
                                    How to use:
                                </strong>
                                <ul className="mb-0 mt-2">
                                    <li>Type an address in the search box for quick location</li>
                                    <li>Click "Current Location" to use your device's GPS</li>
                                    <li>Drag the red marker to adjust the exact position</li>
                                    <li>Click anywhere on the map to place the marker</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className='d-flex justify-content-end gap-2 mt-4'>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onHide}
                                >
                                    <i className="fas fa-times me-2"></i>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirm}
                                    disabled={!location.lat || !location.lng}
                                >
                                    <i className="fas fa-check me-2"></i>
                                    Confirm Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LocationPickerModal;


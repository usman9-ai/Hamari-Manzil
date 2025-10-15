import React, { useState, useRef, useEffect, useCallback } from 'react';

const LocationPrompt = ({ show, onLocationSelect }) => {
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState({ lat: 31.5204, lng: 74.3587 }); // Default: Lahore
    const [loading, setLoading] = useState(false);
    const [mapError, setMapError] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markerRef = useRef(null);
    const autocompleteServiceRef = useRef(null);
    const placesServiceRef = useRef(null);
    const searchInputRef = useRef(null);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = useCallback(
        (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance;
        },
        []
    );

    // Format distance for display
    const formatDistance = useCallback((km) => {
        if (km < 1) {
            return `${Math.round(km * 1000)}m`;
        }
        return `${km.toFixed(1)}km`;
    }, []);

    // Extract city, state, and zip code from address components
    const extractLocationData = useCallback(
        (addressComponents, formattedAddress) => {
            if (!addressComponents) return;

            let extractedCity = '';
            let extractedState = '';
            let extractedZipCode = '';
            let extractedSubLocality = '';

            for (const component of addressComponents) {
                if (component.types.includes('locality')) {
                    extractedCity = component.long_name;
                }
                if (
                    component.types.includes('administrative_area_level_2') &&
                    !extractedCity
                ) {
                    extractedCity = component.long_name;
                }
                if (component.types.includes('sublocality') && !extractedCity) {
                    extractedSubLocality = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    extractedState = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                    extractedZipCode = component.long_name;
                }
            }

            // Fallback: If no city found, use sublocality
            if (!extractedCity && extractedSubLocality) {
                extractedCity = extractedSubLocality;
            }

            // Fallback: Extract zip code from formatted address if not found
            if (!extractedZipCode && formattedAddress) {
                // Match Pakistani postal codes (5 digits) or general patterns
                const zipMatch = formattedAddress.match(/\b(\d{5})\b/);
                if (zipMatch) {
                    extractedZipCode = zipMatch[1];
                }
            }

            // Final fallback: Generate a default zip code based on city/state
            if (!extractedZipCode) {
                // Common Pakistani city zip codes as fallback
                const cityZipMap = {
                    LAHORE: '54000',
                    KARACHI: '75500',
                    ISLAMABAD: '44000',
                    RAWALPINDI: '46000',
                    FAISALABAD: '38000',
                    MULTAN: '60000',
                    GUJRANWALA: '52250',
                    PESHAWAR: '25000',
                    QUETTA: '87300',
                    SIALKOT: '51310',
                };

                const cityUpper = extractedCity.toUpperCase();
                if (cityZipMap[cityUpper]) {
                    extractedZipCode = cityZipMap[cityUpper];
                    console.log(
                        `Using fallback zip code for ${cityUpper}: ${extractedZipCode}`
                    );
                } else {
                    // Last resort: use generic Pakistan zip code
                    extractedZipCode = '00000';
                    console.warn(`No zip code found, using generic: ${extractedZipCode}`);
                }
            }

            // Convert to uppercase
            const finalCity = extractedCity.toUpperCase();
            const finalState = extractedState.toUpperCase();

            setCity(finalCity);
            setState(finalState);
            setZipCode(extractedZipCode);

            // Debug logging
            console.log('Location data extracted:', {
                city: finalCity,
                state: finalState,
                zipCode: extractedZipCode,
                source: formattedAddress,
            });
        },
        []
    );

    // Reverse geocode to get address from coordinates
    const reverseGeocode = useCallback(
        (coords) => {
            if (!window.google) return;

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: coords }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setAddress(results[0].formatted_address);
                    extractLocationData(
                        results[0].address_components,
                        results[0].formatted_address
                    );
                }
            });
        },
        [extractLocationData]
    );

    // Initialize Google Maps
    useEffect(() => {
        if (!show) return;

        let checkInterval = null;
        let timeoutId = null;
        let mapCheckInterval = null;

        const initializeMap = () => {
            if (!window.google) {
                setMapError('Google Maps API not loaded. Please add your API key.');
                return;
            }

            // Wait for the map container to be available in DOM
            mapCheckInterval = setInterval(() => {
                if (mapRef.current) {
                    if (mapCheckInterval) clearInterval(mapCheckInterval);

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
                            if (position) {
                                const newLocation = {
                                    lat: position.lat(),
                                    lng: position.lng(),
                                };
                                setLocation(newLocation);
                                reverseGeocode(newLocation);
                            }
                        });

                        // Map click event
                        map.addListener('click', (e) => {
                            if (e.latLng) {
                                const newLocation = {
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng(),
                                };
                                setLocation(newLocation);
                                marker.setPosition(e.latLng);
                                reverseGeocode(newLocation);
                            }
                        });

                        // Initialize autocomplete service
                        setTimeout(() => {
                            if (window.google && window.google.maps.places) {
                                autocompleteServiceRef.current =
                                    new window.google.maps.places.AutocompleteService();
                                placesServiceRef.current =
                                    new window.google.maps.places.PlacesService(map);
                            }
                        }, 500);

                        setMapError('');
                    } catch (error) {
                        console.error('Map initialization error:', error);
                        setMapError('Failed to initialize map. Please try again.');
                    }
                }
            }, 100);

            // Stop checking after 5 seconds if container is not found
            setTimeout(() => {
                if (mapCheckInterval) {
                    clearInterval(mapCheckInterval);
                }
            }, 5000);
        };

        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            // Wait for the API to load
            checkInterval = setInterval(() => {
                if (window.google && window.google.maps) {
                    if (checkInterval) clearInterval(checkInterval);
                    initializeMap();
                }
            }, 100);

            // Cleanup interval after 10 seconds
            timeoutId = setTimeout(() => {
                if (checkInterval) clearInterval(checkInterval);
            }, 10000);
        }

        // Cleanup function
        return () => {
            if (checkInterval) clearInterval(checkInterval);
            if (timeoutId) clearTimeout(timeoutId);
            if (mapCheckInterval) clearInterval(mapCheckInterval);
        };
    }, [show, reverseGeocode, extractLocationData, userLocation]);

    // Update map when location changes externally
    useEffect(() => {
        if (googleMapRef.current && markerRef.current && location) {
            const latLng = new window.google.maps.LatLng(location.lat, location.lng);
            googleMapRef.current.setCenter(latLng);
            markerRef.current.setPosition(latLng);
        }
    }, [location]);

    // Handle search input change
    const handleSearchChange = useCallback(
        (value) => {
            setSearchValue(value);

            if (!value || value.trim() === '') {
                setPredictions([]);
                setShowPredictions(false);
                setMapError('');
                return;
            }

            if (!autocompleteServiceRef.current) return;

            const request = {
                input: value,
                componentRestrictions: { country: 'pk' },
                types: ['establishment', 'geocode'],
            };

            // Add location biasing if available
            if (userLocation) {
                request.location = new window.google.maps.LatLng(
                    userLocation.lat,
                    userLocation.lng
                );
                request.radius = 50000; // 50km
            }

            autocompleteServiceRef.current.getPlacePredictions(
                request,
                (results, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        results
                    ) {
                        // Calculate distances if user location is available
                        const predictionsWithDistance = results.map((prediction) => ({
                            ...prediction,
                            distance: null, // Will be calculated after getting place details
                        }));

                        // Sort by distance if user location available
                        if (userLocation) {
                            // Get place details for each prediction to calculate distance
                            Promise.all(
                                predictionsWithDistance.map(
                                    (prediction) =>
                                        new Promise((resolve) => {
                                            placesServiceRef.current?.getDetails(
                                                { placeId: prediction.place_id, fields: ['geometry'] },
                                                (place, detailStatus) => {
                                                    if (
                                                        detailStatus ===
                                                        window.google.maps.places.PlacesServiceStatus
                                                            .OK &&
                                                        place?.geometry?.location
                                                    ) {
                                                        const distance = calculateDistance(
                                                            userLocation.lat,
                                                            userLocation.lng,
                                                            place.geometry.location.lat(),
                                                            place.geometry.location.lng()
                                                        );
                                                        resolve({ ...prediction, distance });
                                                    } else {
                                                        resolve(prediction);
                                                    }
                                                }
                                            );
                                        })
                                )
                            ).then((predictionsWithDist) => {
                                // Sort by distance (closest first)
                                const sorted = predictionsWithDist.sort((a, b) => {
                                    if (a.distance === null) return 1;
                                    if (b.distance === null) return -1;
                                    return a.distance - b.distance;
                                });
                                setPredictions(sorted);
                                setShowPredictions(true);
                            });
                        } else {
                            setPredictions(predictionsWithDistance);
                            setShowPredictions(true);
                        }
                    } else {
                        setPredictions([]);
                        setShowPredictions(false);
                    }
                }
            );
        },
        [userLocation, calculateDistance]
    );

    // Handle place selection
    const handlePlaceSelect = useCallback(
        (placeId, description) => {
            if (!placesServiceRef.current) return;

            setShowPredictions(false);
            setSearchValue(description);
            setMapError('');

            placesServiceRef.current.getDetails(
                {
                    placeId: placeId,
                    fields: [
                        'formatted_address',
                        'geometry',
                        'name',
                        'address_components',
                    ],
                },
                (place, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        place
                    ) {
                        if (!place.geometry || !place.geometry.location) {
                            setMapError('Location not found. Please try a different search.');
                            return;
                        }

                        const newLocation = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        };

                        const formattedAddr = place.formatted_address || place.name || '';
                        setLocation(newLocation);
                        setAddress(formattedAddr);
                        extractLocationData(place.address_components, formattedAddr);

                        if (googleMapRef.current && markerRef.current) {
                            googleMapRef.current.setCenter(place.geometry.location);
                            googleMapRef.current.setZoom(17);
                            markerRef.current.setPosition(place.geometry.location);
                        }
                    } else {
                        setMapError('Unable to get place details. Please try again.');
                    }
                }
            );
        },
        [extractLocationData]
    );

    // Get user location with 3 retry attempts
    useEffect(() => {
        if (!show || !navigator.geolocation) return;

        let attemptCount = 0;
        const maxAttempts = 3;

        const tryGetLocation = () => {
            attemptCount++;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    console.log(`User location obtained on attempt ${attemptCount}:`, {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn(
                        `Location attempt ${attemptCount} failed:`,
                        error.message
                    );

                    // Retry if we haven't reached max attempts
                    if (attemptCount < maxAttempts) {
                        console.log(`Retrying... (${attemptCount + 1}/${maxAttempts})`);
                        setTimeout(() => tryGetLocation(), 1000); // Wait 1 second before retry
                    } else {
                        console.log(
                            'All location attempts failed, proceeding without user location'
                        );
                        setUserLocation(null);
                    }
                },
                {
                    enableHighAccuracy: attemptCount === 1, // Use high accuracy on first attempt
                    timeout: 5000,
                    maximumAge: attemptCount > 1 ? 300000 : 0, // Accept cached location on retries
                }
            );
        };

        tryGetLocation();
    }, [show]);

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            return; // Silently fail
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setLocation(newLocation);
                setUserLocation(newLocation);

                if (googleMapRef.current && markerRef.current) {
                    const latLng = new window.google.maps.LatLng(
                        newLocation.lat,
                        newLocation.lng
                    );
                    googleMapRef.current.setCenter(latLng);
                    googleMapRef.current.setZoom(17);
                    markerRef.current.setPosition(latLng);
                }

                reverseGeocode(newLocation);
                setLoading(false);
            },
            () => {
                // Silently fail - no error message
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    const handleConfirm = () => {
        if (!location.lat || !location.lng) {
            setMapError('Please select a location on the map');
            return;
        }

        // Extract city name from address or use the extracted city
        const cityName = city || address.split(',')[0] || 'Lahore';

        onLocationSelect({
            city: cityName,
            latitude: location.lat,
            longitude: location.lng,
            address: address,
            state: state,
            zipCode: zipCode,
            useCurrentLocation: false
        });
    };

    const handleSkip = () => {
        onLocationSelect({
            city: 'Lahore',
            latitude: 31.5204,
            longitude: 74.3587,
            useCurrentLocation: false
        });
    };

    if (!show) return null;

    return (
        <>
            <style>
                {`
                    .pac-container {
                        z-index: 10000 !important;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .pac-item {
                        padding: 10px;
                        cursor: pointer;
                    }
                    .pac-item:hover {
                        background-color: #f0f0f0;
                    }
                    .custom-predictions-dropdown {
                        z-index: 10000 !important;
                        border-radius: 10px;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                        border: 1px solid #e5e7eb;
                    }
                    .custom-predictions-dropdown .prediction-item {
                        border-bottom: 1px solid #f1f3f4;
                        transition: all 0.2s ease;
                    }
                    .custom-predictions-dropdown .prediction-item:last-child {
                        border-bottom: none;
                    }
                    .custom-predictions-dropdown .prediction-item:hover {
                        background-color: #f8f9fa;
                        transform: translateX(2px);
                    }
                `}
            </style>
            <div
                className="modal show d-block"
                tabIndex="-1"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 9999,
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="modal-body p-0">
                            <div className="row g-0">
                                {/* Left Side - Gradient Panel */}
                                <div
                                    className="col-lg-4 d-none d-lg-flex flex-column justify-content-center align-items-center p-5"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        minHeight: '600px'
                                    }}
                                >
                                    <i className="fas fa-map-marked-alt fa-5x mb-4" style={{ opacity: 0.9 }}></i>
                                    <h3 className="text-center fw-bold mb-3">Find Your Perfect Hostel</h3>
                                    <p className="text-center mb-4" style={{ opacity: 0.9, lineHeight: 1.6 }}>
                                        Set your location to discover the best hostels near you with accurate distance calculations
                                    </p>
                                    <div className="text-center mt-3" style={{ opacity: 0.8 }}>
                                        <div className="mb-3">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Interactive map selection
                                        </div>
                                        <div className="mb-3">
                                            <i className="fas fa-check-circle me-2"></i>
                                            GPS auto-detection
                                        </div>
                                        <div className="mb-3">
                                            <i className="fas fa-check-circle me-2"></i>
                                            City search with autocomplete
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Map and Controls */}
                                <div className="col-lg-8 p-4">
                                    <div className="mb-4">
                                        <h4 className="fw-bold mb-2">
                                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                            Set Your Location
                                        </h4>
                                        <p className="text-muted small mb-0">Select your location to find the nearest hostels</p>
                                    </div>

                                    {/* Quick Actions Row */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-8 position-relative">
                                            <label className="form-label fw-semibold small">
                                                <i className="fas fa-search me-2"></i>
                                                Search City or Area
                                            </label>
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                className="form-control"
                                                placeholder="Type city name (e.g., Lahore, Karachi)"
                                                value={searchValue}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                                autoComplete="off"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') e.preventDefault();
                                                }}
                                                onFocus={() => {
                                                    if (predictions.length > 0) {
                                                        setShowPredictions(true);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    // Delay hiding to allow click on prediction
                                                    setTimeout(() => setShowPredictions(false), 200);
                                                }}
                                                style={{ borderRadius: '10px' }}
                                            />
                                            <small className="text-muted d-block mt-1">
                                                Start typing to search for an address
                                            </small>

                                            {/* Custom Autocomplete Dropdown */}
                                            {showPredictions && predictions.length > 0 && (
                                                <div
                                                    className="position-absolute w-100 mt-1 bg-white custom-predictions-dropdown"
                                                    style={{
                                                        zIndex: 1050,
                                                        maxHeight: '300px',
                                                        overflowY: 'auto'
                                                    }}
                                                >
                                                    {predictions.map((prediction) => (
                                                        <div
                                                            key={prediction.place_id}
                                                            className="px-3 py-3 prediction-item"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() =>
                                                                handlePlaceSelect(
                                                                    prediction.place_id,
                                                                    prediction.description
                                                                )
                                                            }
                                                            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                                        >
                                                            <div className="d-flex align-items-start justify-content-between gap-2">
                                                                <div className="flex-grow-1 min-width-0">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <i className="fas fa-map-marker-alt text-primary flex-shrink-0"></i>
                                                                        <p className="mb-0 fw-medium text-truncate small">
                                                                            {prediction.structured_formatting?.main_text ||
                                                                                prediction.description}
                                                                        </p>
                                                                    </div>
                                                                    <p className="mb-0 text-muted small mt-1" style={{ paddingLeft: '1.5rem' }}>
                                                                        {prediction.structured_formatting?.secondary_text ||
                                                                            prediction.description}
                                                                    </p>
                                                                </div>
                                                                {prediction.distance !== null &&
                                                                    prediction.distance !== undefined && (
                                                                        <div className="flex-shrink-0 bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                                                                            <small className="fw-medium text-white">
                                                                                {formatDistance(prediction.distance)}
                                                                            </small>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold small d-block">&nbsp;</label>
                                            <button
                                                type="button"
                                                className="btn btn-primary w-100"
                                                onClick={handleCurrentLocation}
                                                disabled={loading}
                                                style={{ borderRadius: '10px', fontWeight: '600' }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Detecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-crosshairs me-2"></i>
                                                        Use GPS
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error Display */}
                                    {mapError && (
                                        <div className="alert alert-warning mb-3">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {mapError}
                                        </div>
                                    )}

                                    {/* Map Container */}
                                    <div className="mb-3">
                                        <div
                                            ref={mapRef}
                                            style={{
                                                width: '100%',
                                                height: '350px',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                        </div>
                                        <small className="text-muted d-block mt-2">
                                            <i className="fas fa-info-circle me-1"></i>
                                            Drag the marker or click on the map to adjust your location
                                        </small>
                                    </div>

                                    {/* Selected Location Display */}
                                    {address && (
                                        <div className="alert alert-light border mb-3">
                                            <div className="d-flex align-items-start">
                                                <i className="fas fa-map-pin text-primary me-3 mt-1"></i>
                                                <div className="flex-grow-1">
                                                    <strong className="d-block mb-2">Selected Location:</strong>
                                                    <div className="row g-3 small">
                                                        <div className="col-12">
                                                            <strong>Address{zipCode && ` (${zipCode})`}:</strong>
                                                            <p className="text-muted mb-0 mt-1">{address}</p>
                                                        </div>
                                                        {city && (
                                                            <div className="col-md-6">
                                                                <strong>City:</strong>
                                                                <p className="text-muted mb-0 mt-1">{city}</p>
                                                            </div>
                                                        )}
                                                        {state && (
                                                            <div className="col-md-6">
                                                                <strong>Province/State:</strong>
                                                                <p className="text-muted mb-0 mt-1">{state}</p>
                                                            </div>
                                                        )}
                                                        <div className="col-md-6">
                                                            <strong>Latitude:</strong>
                                                            <p className="text-muted mb-0 mt-1">{location.lat.toFixed(6)}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <strong>Longitude:</strong>
                                                            <p className="text-muted mb-0 mt-1">{location.lng.toFixed(6)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    <div className="alert alert-info mb-4">
                                        <i className="fas fa-info-circle me-2"></i>
                                        <strong>How to use:</strong>
                                        <ul className="list-unstyled mt-2 mb-0 small">
                                            <li className="mb-1">
                                                <i className="fas fa-check me-2 text-success"></i>
                                                Type an address in the search box for quick location
                                            </li>
                                            <li className="mb-1">
                                                <i className="fas fa-check me-2 text-success"></i>
                                                Click "Use GPS" to use your device's GPS
                                            </li>
                                            <li className="mb-1">
                                                <i className="fas fa-check me-2 text-success"></i>
                                                Drag the red marker to adjust the exact position
                                            </li>
                                            <li className="mb-0">
                                                <i className="fas fa-check me-2 text-success"></i>
                                                Click anywhere on the map to place the marker
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex gap-2 mt-4">
                                        <button
                                            className="btn btn-outline-secondary flex-grow-1 py-2"
                                            onClick={handleSkip}
                                            style={{ borderRadius: '10px', fontWeight: '600' }}
                                        >
                                            Skip for Now
                                        </button>
                                        <button
                                            className="btn btn-success flex-grow-1 py-2"
                                            onClick={handleConfirm}
                                            disabled={!location.lat || !location.lng}
                                            style={{ borderRadius: '10px', fontWeight: '600' }}
                                        >
                                            <i className="fas fa-check me-2"></i>
                                            Confirm & Find Hostels
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LocationPrompt;


import React, { useState } from "react";

// Dummy favorite hostels data
const dummyFavorites = [
  {
    id: 1,
    name: "Sunrise Hostel",
    location: "Lahore",
    price: 12000,
    description: "Comfortable rooms, WiFi, near university.",
    rating: 4.5,
    amenities: ["WiFi", "Laundry", "Mess"],
    ownerEmail: "owner1@email.com",
  },
  {
    id: 2,
    name: "City Girls Hostel",
    location: "Karachi",
    price: 10000,
    description: "Safe, clean, and affordable.",
    rating: 4.2,
    amenities: ["WiFi", "Security"],
    ownerEmail: "owner2@email.com",
  },
];

// Favorite Hostel Card Component
const FavoriteHostelCard = ({ hostel, onRemove }) => (
  <div className="col-12 col-md-6 col-lg-4 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{hostel.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{hostel.location}</h6>
        <p className="card-text">{hostel.description}</p>
        <div className="mb-2">
          <span className="fw-bold">Rs. {hostel.price}</span> / month
        </div>
        <div className="mb-2">
          <span className="badge bg-success">{hostel.rating} ★</span>
        </div>
        <div className="d-flex gap-2 mt-auto">
          <button
            className="btn btn-outline-primary flex-fill"
            onClick={() => window.open(`mailto:${hostel.ownerEmail}`)}
          >
            Contact Owner
          </button>
          <button
            className="btn btn-outline-danger flex-fill"
            onClick={() => onRemove(hostel.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Favorite Hostel Page Component
const FavoriteHostelPage = () => {
  const [favorites, setFavorites] = useState(dummyFavorites);

  // Remove hostel from favorites
  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <h2 className="mb-4 text-center">My Favorite Hostels</h2>
      <div className="row">
        {favorites.length === 0 ? (
          <div className="col-12 text-center text-muted">
            No favorite hostels yet.
          </div>
        ) : (
          favorites.map((hostel) => (
            <FavoriteHostelCard
              key={hostel.id}
              hostel={hostel}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoriteHostelPage;
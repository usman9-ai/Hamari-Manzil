import React from "react";
import { useNavigate } from "react-router-dom";

const HostelCard = ({
  hostel,
  isInWishlist = false,
  onAddToWishlist = () => {},
  onRemoveFromWishlist = () => {},
}) => {
  const navigate = useNavigate();

  // Navigate to details
  const handleViewDetails = () => {
    navigate(`/hostel-details/${hostel.id}`);
  };

  
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      onRemoveFromWishlist(hostel.id);
    } else {
      onAddToWishlist(hostel.id);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++) stars.push(<i key={i} className="fas fa-star text-warning me-1" />);
    if (half) stars.push(<i key="half" className="fas fa-star-half-alt text-warning me-1" />);
    for (let i = 0; i < 5 - Math.ceil(rating); i++)
      stars.push(<i key={`e-${i}`} className="far fa-star text-warning me-1" />);
    return stars;
  };

  const price = hostel.rent ?? hostel.price ?? null;

  return (
    <div
      className="card hostel-card mb-3 shadow-sm border-0 h-100"
      style={{ cursor: "pointer", height: "100%" }}
      onClick={handleViewDetails}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Image carousel (Bootstrap) */}
      <div className="position-relative">
        <div
          id={`carousel-${hostel.id}`}
          className="carousel slide"
          data-bs-ride="carousel"
          style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem", overflow: "hidden" }}
        >
          <div className="carousel-inner">
            {(Array.isArray(hostel.images) && hostel.images.length > 0 ? hostel.images : ["/images/default-hostel.jpg"]).map(
              (img, idx) => (
                <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                  <img
                    src={img}
                    alt={`${hostel.name} ${idx + 1}`}
                    className="d-block w-100"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
              )
            )}
          </div>

          {/* controls */}
          {Array.isArray(hostel.images) && hostel.images.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${hostel.id}`}
                data-bs-slide="prev"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${hostel.id}`}
                data-bs-slide="next"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>

        {/* verified badge */}
        {hostel.verified && (
          <span className="badge bg-success position-absolute top-0 start-0 m-2">Verified</span>
        )}

        <button
          onClick={toggleWishlist}
          className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light rounded-circle shadow-sm"
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i className={isInWishlist ? "fas fa-heart text-danger" : "far fa-heart text-muted"} />
        </button>

        {/* location badge */}
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-primary">
            <i className="fas fa-map-marker-alt me-1"></i>
            {hostel.city ?? hostel.location ?? ""}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="card-body d-flex flex-column h-100">
        <div>
          <h5 className="card-title fw-bold mb-1">{hostel.name}</h5>

          <p className="card-text text-muted small mb-2" style={{ minHeight: 44, overflow: "hidden" }}>
            {hostel.description ?? "A comfortable place for students and professionals."}
          </p>

          <div className="d-flex flex-wrap gap-1 mb-2">
            {(hostel.facilities || []).slice(0, 3).map((f, i) => (
              <span key={i} className="badge bg-light text-dark border">
                {f}
              </span>
            ))}
            {(hostel.facilities || []).length > 3 && (
              <span className="badge bg-light text-dark border">+{hostel.facilities.length - 3} more</span>
            )}
          </div>

          <div className="d-flex align-items-center mb-2">
            <div className="me-2">{renderStars(hostel.rating)}</div>
            <span className="text-muted small">
              {hostel.rating ?? "No rating"} ({hostel.reviewCount ?? 0} reviews)
            </span>
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto d-flex justify-content-between align-items-end pt-2">
          <div>
            <span className="h5 text-primary fw-bold mb-0">
              PKR {price ? Number(price).toLocaleString() : "-"}
            </span>
            <small className="text-muted d-block">per month</small>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;

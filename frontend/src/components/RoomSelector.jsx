import React, { useState } from 'react';

const RoomSelector = ({ rooms, selectedRoom, onRoomSelect, onBookRoom }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(selectedRoom?.id || null);

  const handleRoomSelect = (room) => {
    setSelectedRoomId(room.id);
    onRoomSelect?.(room);
  };

  const handleBookRoom = () => {
    const room = rooms.find(r => r.id === selectedRoomId);
    if (room && onBookRoom) {
      onBookRoom(room);
    }
  };

  const getAvailabilityBadge = (available) => {
    if (available === 0) {
      return <span className="badge bg-danger">Sold Out</span>;
    } else if (available <= 2) {
      return <span className="badge bg-warning">Limited</span>;
    } else {
      return <span className="badge bg-success">Available</span>;
    }
  };

  return (
    <div className="room-selector">
      <h5 className="mb-4">Available Rooms</h5>
      
      {rooms.length === 0 ? (
        <div className="text-center py-4">
          <i className="fas fa-bed fa-3x text-muted mb-3"></i>
          <p className="text-muted">No rooms available at the moment</p>
        </div>
      ) : (
        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-lg-6 col-md-12 mb-3">
              <div 
                className={`card h-100 cursor-pointer ${
                  selectedRoomId === room.id ? 'border-primary shadow-sm' : 'border'
                }`}
                onClick={() => handleRoomSelect(room)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="card-title fw-bold mb-0">{room.type}</h6>
                    {getAvailabilityBadge(room.available)}
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-users text-muted me-2"></i>
                      <span className="text-muted">Capacity: {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-bed text-muted me-2"></i>
                      <span className="text-muted">Available: {room.available} rooms</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-primary fw-bold mb-0">
                      PKR {room.price.toLocaleString()}
                    </h5>
                    <small className="text-muted">per month</small>
                  </div>

                  <div className="mb-3">
                    <h6 className="small fw-bold mb-2">Amenities:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {room.amenities.map((amenity, index) => (
                        <span key={index} className="badge bg-light text-dark border">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedRoomId === room.id && (
                    <div className="alert alert-primary mb-0">
                      <i className="fas fa-check-circle me-2"></i>
                      Selected for booking
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRoomId && (
        <div className="mt-4 p-3 bg-light rounded">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Selected Room</h6>
              <p className="mb-0 text-muted">
                {rooms.find(r => r.id === selectedRoomId)?.type} - 
                PKR {rooms.find(r => r.id === selectedRoomId)?.price.toLocaleString()}/month
              </p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleBookRoom}
            >
              <i className="fas fa-calendar-check me-2"></i>
              Book This Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;

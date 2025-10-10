import React from 'react';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  // Safe icon mapping
  const getNotificationIcon = (type) => {
    const iconMap = {
      hostel_message: 'fas fa-envelope text-info',
      review_request: 'fas fa-star text-primary',
      booking_confirmation: 'fas fa-check-circle text-success',
      payment_reminder: 'fas fa-credit-card text-warning',
      booking_cancelled: 'fas fa-times-circle text-danger',
      payment_success: 'fas fa-check-circle text-success',
    };
    return iconMap[type] || 'fas fa-bell text-secondary';
  };

  // Safe timestamp formatting
  const formatTime = (timestamp) => {
    if (!timestamp) return ''; // handle missing timestamp
    const date = new Date(timestamp);
    if (isNaN(date)) return '';
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const handleMarkAsRead = () => {
    if (notification && !notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    if (notification && onDelete) {
      onDelete(notification.id);
    }
  };

  if (!notification) return null; // safety check

  return (
    <div
      className={`notification-card p-3 mb-2 border rounded ${
        notification.read ? '' : 'bg-light'
      }`}
    >
      <div className="d-flex align-items-start gap-3 flex-wrap">
        <div>
          <i className={`${getNotificationIcon(notification.type)} fa-lg`}></i>
        </div>
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1">
            <h6 className={`mb-1 ${notification.read ? 'text-muted' : 'fw-bold'}`}>
              {notification.title || 'No Title'}
            </h6>
            <div className="d-flex gap-1">
              {!notification.read && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleMarkAsRead}
                  title="Mark as read"
                >
                  <i className="fas fa-check"></i>
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                title="Delete notification"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <p className={`mb-2 ${notification.read ? 'text-muted' : ''}`}>
            {notification.message || 'No message available.'}
          </p>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <small className="text-muted">{formatTime(notification.timestamp)}</small>
            {!notification.read && <span className="badge bg-primary">New</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

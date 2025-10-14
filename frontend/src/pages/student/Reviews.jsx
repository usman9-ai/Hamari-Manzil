import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import ReviewCard from '../../components/ReviewCard';
import { reviews as allReviews, userProfile, notifications } from '../../data/hostels';

const Reviews = () => {
  // ---------- State ----------
  const [user, setUser] = useState(userProfile);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [reviews, setReviews] = useState(allReviews);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });

  // ---------- Unread Notifications ----------
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    setUser(prev => ({ ...prev, unreadNotifications: unreadCount }));
  }, []);

  // ---------- Filter & Sort Reviews ----------
  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (ratingFilter > 0) list = list.filter(r => r.rating >= ratingFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.hostelName.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'highest') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [reviews, ratingFilter, searchQuery, sortBy]);

  // ---------- Handlers ----------
  const handleHelpful = (reviewId) =>
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));

  const handleReport = () => alert('Thanks for your report. Our team will review this.');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.comment) return;
    const nextId = Math.max(0, ...reviews.map(r => r.id)) + 1;
    const review = {
      id: nextId,
      hostelId: null,
      hostelName: 'Anonymous Hostel',
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: Number(newReview.rating),
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().slice(0, 10),
      helpful: 0,
      verified: false
    };
    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, title: '', comment: '' });
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-grow-1" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <TopHeader
          user={user}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <div className="container-fluid px-2 px-md-4 py-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 px-2">
            <div>
              <h2 className="fw-bold mb-2">Reviews</h2>
              <p className="text-muted mb-0">Share your experience and explore reviews</p>
            </div>
          </div>

          {/* Write Review */}
          <div className="card mb-4 mx-auto" style={{ maxWidth: '700px' }}>
            <div className="card-header"><h6 className="mb-0 fw-bold">Write a Review</h6></div>
            <div className="card-body">
              <form onSubmit={handleSubmitReview}>
                <div className="row g-3">
                  <div className="col-12 col-md-2">
                    <label className="form-label">Rating</label>
                    <select
                      className="form-select"
                      value={newReview.rating}
                      onChange={(e) => setNewReview(prev => ({ ...prev, rating: e.target.value }))}
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-10">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Great stay with friendly staff"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share details about cleanliness, staff, amenities, location..."
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="mt-3 d-flex justify-content-end">
                  <button className="btn btn-primary">
                    <i className="fas fa-paper-plane me-2"></i>Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label">Minimum Rating</label>
                  <select
                    className="form-select"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                  >
                    <option value={0}>Any</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5</option>
                  </select>
                </div>
                <div className="col-12 col-md-5">
                  <label className="form-label">Search</label>
                  <input
                    className="form-control"
                    placeholder="Search title, comment, hostel name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="highest">Highest Rating</option>
                  </select>
                </div>
                <div className="col-12 col-md-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setRatingFilter(0);
                      setSearchQuery('');
                      setSortBy('newest');
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Review List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-5 px-2">
              <i className="fas fa-star fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No reviews found</h5>
            </div>
          ) : (
            <div className="row g-4">
              {filteredReviews.map(r => (
                <div key={r.id} className="col-12 col-md-6 col-lg-4 d-flex">
                  <ReviewCard
                    review={r}
                    onHelpful={handleHelpful}
                    onReport={handleReport}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="d-block d-md-none" style={{ height: '70px' }}></div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;

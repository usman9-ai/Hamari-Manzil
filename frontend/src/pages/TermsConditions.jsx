import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            {/* Header */}
            <nav className="navbar navbar-light bg-white shadow-sm">
                <div className="container">
                    <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
                        <div
                            className="bg-primary rounded d-flex align-items-center justify-content-center me-2"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <i className="fas fa-home text-white"></i>
                        </div>
                        <span style={{ fontSize: '24px', color: '#4f46e5' }}>Hamari Manzil</span>
                    </Link>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-5">
                                <h1 className="fw-bold mb-4">Terms & Conditions</h1>
                                <p className="text-muted mb-4">Last updated: October 2024</p>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">1. Acceptance of Terms</h3>
                                    <p>
                                        By accessing and using Hamari Manzil ("Platform"), you accept and agree to be bound by the terms and provisions of this agreement. 
                                        If you do not agree to these terms, please do not use this Platform.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">2. Platform Services</h3>
                                    <p>Hamari Manzil provides a platform that:</p>
                                    <ul>
                                        <li>Connects hostel owners with students seeking accommodation</li>
                                        <li>Allows hostel owners to list and manage their properties</li>
                                        <li>Enables students to search, browse, and review hostels</li>
                                        <li>Facilitates communication between hostel owners and students</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">3. User Responsibilities</h3>
                                    <h5 className="fw-bold mt-3">For Hostel Owners:</h5>
                                    <ul>
                                        <li>Provide accurate and up-to-date information about your hostel</li>
                                        <li>Upload genuine photos of your property</li>
                                        <li>Maintain fair pricing and honor your listed rates</li>
                                        <li>Respond promptly to inquiries and bookings</li>
                                        <li>Comply with local laws and regulations</li>
                                        <li>Keep your property safe and habitable</li>
                                    </ul>

                                    <h5 className="fw-bold mt-3">For Students:</h5>
                                    <ul>
                                        <li>Provide accurate information when booking</li>
                                        <li>Treat property with respect</li>
                                        <li>Follow hostel rules and regulations</li>
                                        <li>Make payments on time</li>
                                        <li>Leave honest and constructive reviews</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">4. Verification Process</h3>
                                    <p>
                                        Hostel owners can request verification by submitting required documents (CNIC, business license, utility bills, property documents). 
                                        Verification is at our discretion and can be revoked if false information is discovered.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">5. Payments and Fees</h3>
                                    <ul>
                                        <li>Platform usage is currently free for both hostel owners and students</li>
                                        <li>All payment transactions between hostel owners and students are direct</li>
                                        <li>Hamari Manzil is not responsible for payment disputes</li>
                                        <li>We reserve the right to introduce fees in the future with notice</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">6. Reviews and Ratings</h3>
                                    <ul>
                                        <li>Reviews must be honest and based on actual experiences</li>
                                        <li>Fake reviews or review manipulation is prohibited</li>
                                        <li>We reserve the right to remove inappropriate reviews</li>
                                        <li>Hostel owners can respond to reviews</li>
                                        <li>One review per user per hostel</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">7. Prohibited Activities</h3>
                                    <p>Users must not:</p>
                                    <ul>
                                        <li>Post false or misleading information</li>
                                        <li>Use the Platform for illegal purposes</li>
                                        <li>Harass or abuse other users</li>
                                        <li>Attempt to hack or compromise the Platform</li>
                                        <li>Scrape or copy data without permission</li>
                                        <li>Create multiple accounts to manipulate reviews</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">8. Intellectual Property</h3>
                                    <p>
                                        All content on Hamari Manzil, including text, graphics, logos, and software, is the property of Hamari Manzil and protected by 
                                        intellectual property laws. You may not copy, modify, or distribute any content without permission.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">9. Limitation of Liability</h3>
                                    <p>
                                        Hamari Manzil is a platform that connects users. We are not responsible for:
                                    </p>
                                    <ul>
                                        <li>The quality, safety, or legality of hostels listed</li>
                                        <li>The accuracy of information provided by users</li>
                                        <li>Disputes between hostel owners and students</li>
                                        <li>Property damage or personal injuries</li>
                                        <li>Financial losses incurred while using the Platform</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">10. Account Termination</h3>
                                    <p>
                                        We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activity, 
                                        or for any other reason we deem necessary to protect the Platform and its users.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">11. Dispute Resolution</h3>
                                    <p>
                                        Any disputes arising from the use of this Platform shall be resolved through negotiation. If negotiation fails, 
                                        disputes will be subject to the jurisdiction of courts in Pakistan.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">12. Changes to Terms</h3>
                                    <p>
                                        We may modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms. 
                                        We will notify users of significant changes.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">13. Contact Information</h3>
                                    <p>For questions about these terms, contact us:</p>
                                    <ul>
                                        <li><i className="fab fa-whatsapp text-success me-2"></i> WhatsApp: <a href="https://wa.me/923004334270" target="_blank" rel="noopener noreferrer">+92 300 4334270</a></li>
                                        <li><i className="fas fa-envelope text-primary me-2"></i> Email: support@hamarimanzil.com</li>
                                    </ul>
                                </section>

                                <div className="mt-5 pt-4 border-top">
                                    <Link to="/" className="btn btn-primary me-3">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Home
                                    </Link>
                                    <Link to="/privacy-policy" className="btn btn-outline-primary">
                                        View Privacy Policy
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container">
                    <div className="text-center text-muted">
                        <p className="mb-0">© 2024 Hamari Manzil. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TermsConditions;

import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                                <h1 className="fw-bold mb-4">Privacy Policy</h1>
                                <p className="text-muted mb-4">Last updated: October 2024</p>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">1. Information We Collect</h3>
                                    <p>We collect information that you provide directly to us, including:</p>
                                    <ul>
                                        <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
                                        <li><strong>Hostel Information:</strong> Details about your hostel properties, including location, facilities, and pricing</li>
                                        <li><strong>Booking Information:</strong> Details about bookings, including dates and payment information</li>
                                        <li><strong>Review Information:</strong> Reviews and ratings you provide about hostels</li>
                                        <li><strong>Communication:</strong> Messages sent through our platform</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">2. How We Use Your Information</h3>
                                    <p>We use the information we collect to:</p>
                                    <ul>
                                        <li>Provide, maintain, and improve our services</li>
                                        <li>Process bookings and transactions</li>
                                        <li>Send you technical notices and support messages</li>
                                        <li>Respond to your comments and questions</li>
                                        <li>Verify hostel ownership and authenticity</li>
                                        <li>Prevent fraud and abuse</li>
                                        <li>Analyze usage patterns to improve user experience</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">3. Information Sharing</h3>
                                    <p>We do not sell your personal information. We may share your information:</p>
                                    <ul>
                                        <li><strong>With Other Users:</strong> Your hostel information is visible to students searching for accommodation</li>
                                        <li><strong>With Service Providers:</strong> We work with third-party service providers to perform functions on our behalf</li>
                                        <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights</li>
                                        <li><strong>With Your Consent:</strong> When you give us permission to share your information</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">4. Data Security</h3>
                                    <p>
                                        We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. 
                                        However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">5. Your Rights</h3>
                                    <p>You have the right to:</p>
                                    <ul>
                                        <li>Access your personal information</li>
                                        <li>Update or correct your information</li>
                                        <li>Delete your account</li>
                                        <li>Opt-out of marketing communications</li>
                                        <li>Request a copy of your data</li>
                                    </ul>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">6. Cookies and Tracking</h3>
                                    <p>
                                        We use cookies and similar tracking technologies to track activity on our platform and store certain information. 
                                        You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">7. Children's Privacy</h3>
                                    <p>
                                        Our service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">8. Changes to This Policy</h3>
                                    <p>
                                        We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page 
                                        and updating the "Last updated" date.
                                    </p>
                                </section>

                                <section className="mb-4">
                                    <h3 className="fw-bold mb-3">9. Contact Us</h3>
                                    <p>If you have questions about this privacy policy, please contact us:</p>
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
                                    <Link to="/terms" className="btn btn-outline-primary">
                                        View Terms & Conditions
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

export default PrivacyPolicy;


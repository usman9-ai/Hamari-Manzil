import React from 'react';

const FooterNav = () => {
    return (
        <footer className="bg-white text-primary rounded-3 shadow-sm p-4 my-4">
            <div className="container">
                <div className="row g-4 align-items-start">
                    {/* Brand & About */}
                    <div className="col-6">
                        <h5 className="fw-bold mb-2">Hamari Manzil</h5>
                        <p className="text-primary small">
                            Find your perfect hostel easily and book with confidence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6">
                        <h6 className="fw-bold mb-2">Quick Links</h6>
                        <ul className="list-unstyled">
                            <li className="mb-1">
                                <a href="/hostels" className="text-primary text-decoration-none hover-link">Hostels</a>
                            </li>
                            <li className="mb-1">
                                <a href="/about" className="text-primary text-decoration-none hover-link">About Us</a>
                            </li>
                            <li className="mb-1">
                                <a href="/contact" className="text-primary text-decoration-none hover-link">Contact</a>
                            </li>
                            <li className="mb-1">
                                <a href="/privacy" className="text-primary text-decoration-none hover-link">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>

                    {/* Copyright */}
                    <div className="col-12 text-center">
                        <hr className="bg-secondary mt-2" />
                        <div className="text-center text-primary small mt-3">
                            &copy; {new Date().getFullYear()} Hamari Manzil. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterNav;

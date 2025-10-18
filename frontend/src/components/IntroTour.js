import React, { useState, useEffect } from 'react';

const IntroTour = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [show, setShow] = useState(false);

    const steps = [
        {
            title: '🏨 Welcome to Hamari Manzil!',
            content: 'Your all-in-one hostel management portal. Let us show you around!',
            action: 'Start Tour'
        },
        {
            title: '📊 Dashboard',
            content: 'Get an overview of your hostels, bookings, revenue, and key metrics all in one place.',
            action: 'Next'
        },
        {
            title: '🏢 Manage Hostels',
            content: 'Add, edit, and manage your hostel properties. Upload photos, set facilities, and configure details.',
            action: 'Next'
        },
        {
            title: '🛏️ Manage Rooms',
            content: 'Add individual rooms with pricing, capacity, and facilities. Track availability and occupancy.',
            action: 'Next'
        },
        {
            title: '⭐ Reviews & Ratings',
            content: 'View student reviews and respond to build trust. Monitor your ratings and feedback.',
            action: 'Next'
        },
        {
            title: '✅ Get Verified',
            content: 'Submit verification requests to get a verified badge. Verified hostels get 3x more bookings!',
            action: 'Next'
        },
        {
            title: '🎯 You\'re All Set!',
            content: 'Start by adding your first hostel. Need help? Check our quick start guide or contact support.',
            action: 'Get Started'
        }
    ];

    useEffect(() => {
        // Check if user has seen the tour
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            // Delay showing tour by 500ms for better UX
            setTimeout(() => setShow(true), 500);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        localStorage.setItem('hasSeenTour', 'true');
        setShow(false);
        if (onComplete) onComplete();
    };

    if (!show) return null;

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.3s ease-in'
                }}
            />

            {/* Tour Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxWidth: '500px',
                    width: '90%',
                    zIndex: 9999,
                    animation: 'slideUp 0.3s ease-out',
                    overflow: "hidden"
                }}
            >
                {/* Progress Bar */}
                <div
                    style={{
                        height: '4px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '16px 16px 0 0',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            backgroundColor: '#4F46E5',
                            width: `${progress}%`,
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>

                {/* Content */}
                <div style={{ padding: '32px' }}>
                    {/* Step Indicator */}
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                        <span style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        marginBottom: '16px',
                        textAlign: 'center',
                        color: '#111827'
                    }}>
                        {step.title}
                    </h2>

                    {/* Description */}
                    <p style={{
                        fontSize: '16px',
                        color: '#6B7280',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        marginBottom: '32px'
                    }}>
                        {step.content}
                    </p>

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center'
                    }}>
                        {currentStep > 0 && (
                            <button
                                onClick={handleSkip}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: 'transparent',
                                    color: '#6B7280',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#111827'}
                                onMouseOut={(e) => e.target.style.color = '#6B7280'}
                            >
                                Skip Tour
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '12px 32px',
                                backgroundColor: '#4F46E5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#3730A3';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 12px rgba(79, 70, 229, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#4F46E5';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.3)';
                            }}
                        >
                            {step.action}
                        </button>
                    </div>
                </div>
            </div>

            {/* Inline Animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -45%);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default IntroTour;


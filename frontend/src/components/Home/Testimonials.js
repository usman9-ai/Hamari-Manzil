import React from 'react';
import { FaMoneyBillWave, FaStar, FaRocket } from 'react-icons/fa';

const ValueAndTestimonials = () => {
  // ----- Benefits / Value Section -----
  const benefits = [
    { icon: <FaMoneyBillWave size={30} className='text-primary'/>, title: 'Affordable', desc: 'Best prices for students.' },
    { icon: <FaStar size={30} className='text-primary'/>, title: 'Trusted Reviews', desc: 'Verified ratings from real users.' },
    { icon: <FaRocket size={30} className='text-primary'/>, title: 'Easy & Fast', desc: 'Quick search and booking process.' },
  ];

  // ----- Testimonials Section -----
  const testimonials = [
      { name: 'Ali Khan', text: 'Found the perfect hostel near my university!', avatar: 'https://i.pravatar.cc/50?img=1' },
      { name: 'Sara Ahmed', text: 'Easy booking and trusted reviews made my stay worry-free.', avatar: 'https://i.pravatar.cc/50?img=2' },
      { name: 'Usman Raza', text: 'Affordable options and student-friendly hostels!', avatar: 'https://i.pravatar.cc/50?img=3' },
  ];

  return (
    <div className="value-and-testimonials container py-5">

      {/* ----- Why Choose Us Section ----- */}
      <h2 className="h4 fw-bold text-center mb-4 text-primary">Why Choose Us</h2>
      <div className="row g-4 mb-5">
        {benefits.map((benefit, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="card text-center h-100 shadow-sm border-0 p-4 hover-shadow transition">
              <div className="mb-3">{benefit.icon}</div>
              <h5 className="fw-semibold">{benefit.title}</h5>
              <p className="text-muted">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ----- Testimonials Section ----- */}
      <h2 className="h4 fw-bold text-center mb-4 text-primary">What Our Students Say</h2>
      <div className="row g-4">
        {testimonials.map((t, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-4 h-100">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="rounded-circle me-3 border border-2 border-primary" 
                  width={50} 
                  height={50} 
                />
                <h6 className="mb-0 fw-semibold">{t.name}</h6>
              </div>
              <p className="text-muted fst-italic">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueAndTestimonials;

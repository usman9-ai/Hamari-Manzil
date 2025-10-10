import React, { useState } from 'react';

const ImageGallery = ({ images = [], hostelName = 'Hostel' }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const defaultImages = [
    '/placeholder-hostel.jpg',
    '/placeholder-hostel-2.jpg',
    '/placeholder-hostel-3.jpg'
  ];

  const galleryImages = images.length > 0 ? images : defaultImages;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const openModal = (index) => {
    setCurrentImage(index);
    setShowModal(true);
  };

  return (
    <>
      <div className="image-gallery mb-4">
        <div className="row g-2">
          <div className="col-md-8">
            <div className="main-image position-relative">
              <img
                src={galleryImages[0]}
                alt={`${hostelName} - Main`}
                className="img-fluid rounded cursor-pointer w-100"
                style={{ height: '400px', objectFit: 'cover' }}
                onClick={() => openModal(0)}
              />
              <button
                className="btn btn-dark btn-sm position-absolute bottom-0 end-0 m-3"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-images me-1"></i>
                View All ({galleryImages.length})
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="row g-2 h-100">
              {galleryImages.slice(1, 5).map((image, index) => (
                <div key={index} className="col-6 col-md-12">
                  <div className="position-relative h-100">
                    <img
                      src={image}
                      alt={`${hostelName} - ${index + 2}`}
                      className="img-fluid rounded cursor-pointer w-100 h-100"
                      style={{ objectFit: 'cover', minHeight: '95px' }}
                      onClick={() => openModal(index + 1)}
                    />
                    {index === 3 && galleryImages.length > 5 && (
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        <span className="text-white fw-bold">
                          +{galleryImages.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title text-white">
                  {hostelName} - Image {currentImage + 1} of {galleryImages.length}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center p-0">
                <div className="position-relative">
                  <img
                    src={galleryImages[currentImage]}
                    alt={`${hostelName} - ${currentImage + 1}`}
                    className="img-fluid rounded"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                  
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
                        onClick={prevImage}
                        style={{ zIndex: 1 }}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3"
                        onClick={nextImage}
                        style={{ zIndex: 1 }}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                <div className="d-flex justify-content-center mt-3 flex-wrap gap-2">
                  {galleryImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`rounded cursor-pointer ${
                        index === currentImage ? 'border border-primary border-3' : ''
                      }`}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

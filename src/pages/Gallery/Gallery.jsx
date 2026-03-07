import { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/gallery');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const openLightbox = (img) => {
    setSelectedImage(img);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return <div className="gallery-loading">Đang tải góc trưng bày... 🌸</div>;
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Góc Trưng Bày ✨</h1>
        <p>Nơi lưu giữ những sản phẩm len được đan bằng cả trái tim</p>
      </div>

      <div className="gallery-masonry">
        {images.length === 0 ? (
          <div className="gallery-empty">
            <p>Shop chưa đăng tải hình ảnh nào.</p>
            <p>Hãy quay lại sau nhé! 🧶✨</p>
          </div>
        ) : (
          images.map((img) => (
            <div 
              key={img.id || img._id} 
              className="gallery-item"
              onClick={() => openLightbox(img)}
            >
              <img src={`http://localhost:4000${img.image}`} alt={img.title} loading="lazy" />
              <div className="gallery-overlay">
                <h3>{img.title}</h3>
                {img.tags && img.tags.length > 0 && (
                  <div className="gallery-tags">
                    {img.tags.map((tag, i) => (
                      <span key={i} className="gallery-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <img src={`http://localhost:4000${selectedImage.image}`} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h2>{selectedImage.title}</h2>
              {selectedImage.description && <p>{selectedImage.description}</p>}
              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div className="lightbox-tags">
                  {selectedImage.tags.map((tag, i) => (
                    <span key={i} className="gallery-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

import { useState, useEffect } from 'react';
import heic2any from 'heic2any';
import API_URL from '../../api/config';
import { DeleteIcon } from '../../components/Icons/DeleteIcon';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [newImage, setNewImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); // Comma separated
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách ảnh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageChange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    // Handle HEIC format conversion for Gallery
    if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
      try {
        setIsSubmitting(true);
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        });
        
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const convertedFile = new File([finalBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
          type: 'image/jpeg'
        });
        file = convertedFile;
      } catch (err) {
        console.error('❌ Lỗi chuyển đổi HEIC (Gallery):', err);
        alert('Lỗi khi xử lý ảnh HEIC. Vui lòng thử lại.');
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    setNewImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImage || !title) {
      alert('Vui lòng nhập tiêu đề và chọn ảnh!');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('image', newImage);

    try {
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setNewImage(null);
      document.getElementById('gallery-image-upload').value = '';
      
      // Refresh list
      fetchImages();
      alert('Đăng ảnh thành công! ✨');
    } catch (err) {
      alert(err.message || 'Lỗi khi đăng ảnh');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi Góc Trưng Bày?')) {
      try {
        const res = await fetch(`${API_URL}/api/gallery/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Network response was not ok');
        alert('Đã xóa ảnh thành công');
        fetchImages();
      } catch (err) {
        alert('Lỗi khi xóa ảnh');
      }
    }
  };

  if (loading) return <div>Đang tải dữ liệu thư viện ảnh...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-content-section">
      <div className="admin-header">
        <h2>Quản lý Góc Trưng Bày (Gallery)</h2>
        <p>Thêm hình ảnh đẹp để khách hàng cùng chiêm ngưỡng 🌸</p>
      </div>

      {/* Form thêm ảnh mới */}
      <div className="admin-form-container" style={{ marginBottom: '30px', padding: '20px', background: 'var(--white)', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3>Đăng ảnh mới lên Gallery</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tiêu đề / Caption ngắn *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="VD: Cừu bông len xù siêu mềm"
              required 
            />
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết (Tùy chọn)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Chia sẻ câu chuyện hoặc chất liệu làm nên bé này..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Tags (Cách nhau bằng dấu phẩy)</label>
            <input 
              type="text" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="VD: gấu bông, quà tặng, len xù"
            />
          </div>

          <div className="form-group document-upload">
            <label>Hình ảnh * (Nên chọn ảnh chất lượng tốt)</label>
            <input 
              type="file" 
              id="gallery-image-upload"
              accept="image/*" 
              onChange={handleImageChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="admin-btn-primary" 
            disabled={isSubmitting}
            style={{ marginTop: '15px' }}
          >
            {isSubmitting ? 'Đang tải lên...' : 'Đăng Ảnh Ngay ✨'}
          </button>
        </form>
      </div>

      {/* Danh sách ảnh hiện tại */}
      <h3>Hình ảnh đang hiển thị ({images.length})</h3>
      
      <div className="gallery-admin-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {images.length === 0 ? (
          <p>Chưa có hình ảnh nào được đăng.</p>
        ) : (
          images.map(img => (
            <div key={img.id || img._id} className="gallery-admin-card" style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={img.image.startsWith('http') ? img.image : `${API_URL}${img.image}`} 
                  alt={img.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: 'var(--dark-text)' }}>{img.title}</h4>
                {img.tags && img.tags.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--light-text)', marginBottom: '10px' }}>
                    {img.tags.map(t => `#${t}`).join(' ')}
                  </div>
                )}
                <button 
                  onClick={() => handleDelete(img.id || img._id)}
                  style={{
                    marginTop: 'auto',
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontWeight: 'bold',
                    fontFamily: 'Quicksand'
                  }}
                >
                  <DeleteIcon width={16} height={16} /> Xóa ảnh
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminGallery;

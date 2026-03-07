import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminGallery from './AdminGallery';
import './Admin.css';

const API = '/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'users'
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'anime',
    size: '', material: 'Len cotton', tags: '', inStock: true, isNew: false, isHot: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: 'anime', size: '', material: 'Len cotton', tags: '', inStock: true, isNew: false, isHot: false });
    setImageFile(null);
    setImagePreview('');
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      size: product.size,
      material: product.material,
      tags: (product.tags || []).join(', '),
      inStock: product.inStock,
      isNew: product.isNew,
      isHot: product.isHot,
    });
    setImagePreview(product.image ? product.image : '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) formData.append('image', imageFile);

    try {
      const url = editingProduct
        ? `${API}/products/${editingProduct.id}`
        : `${API}/products`;
      
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await fetch(`${API}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (e) { console.error(e); }
  };

  const handleToggleHidden = async (product) => {
    const formData = new FormData();
    formData.append('hidden', (!product.hidden).toString());
    try {
      await fetch(`${API}/products/${product.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      fetchProducts();
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + '₫';
  const categoryNames = { anime: '🌸 Anime', game: '🎮 Game', 'gau-bong': '🧸 Gấu bông', 'phu-kien': '🔑 Phụ kiện' };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>🧶 Quản lý Dino Handmade</h1>
        <div className="admin-dashboard__actions">
          {activeTab === 'products' && (
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? '✕ Đóng' : '＋ Thêm sản phẩm'}
            </button>
          )}
          <button className="btn btn-outline" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>

      <div className="admin-tabs-nav" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTab('products')}
        >
          🧶 Sản phẩm
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTab('orders')}
        >
          📋 Đơn hàng
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTab('users')}
        >
          👤 Tài khoản
        </button>
        <button 
          className={`btn ${activeTab === 'gallery' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTab('gallery')}
        >
          ✨ Góc Trưng Bày
        </button>
      </div>

      {activeTab === 'orders' && <AdminOrders token={token} />}
      {activeTab === 'users' && <AdminUsers token={token} />}
      {activeTab === 'gallery' && <AdminGallery />}

      {activeTab === 'products' && (
        <div className="admin-products-tab">

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{products.length}</span>
          <span className="admin-stat-label">Tổng sản phẩm</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{products.filter(p => p.inStock).length}</span>
          <span className="admin-stat-label">Còn hàng</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{products.filter(p => p.isNew).length}</span>
          <span className="admin-stat-label">Sản phẩm mới</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-num">{products.filter(p => p.isHot).length}</span>
          <span className="admin-stat-label">Hot 🔥</span>
        </div>
      </div>

      {/* Product Form */}
      {showForm && (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <h2>{editingProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Tên sản phẩm *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="VD: Gojo Satoru Amigurumi" />
            </div>
            <div className="admin-form-group">
              <label>Giá (VNĐ) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required placeholder="350000" />
            </div>
            <div className="admin-form-group">
              <label>Danh mục</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="anime">🌸 Anime</option>
                <option value="game">🎮 Game</option>
                <option value="gau-bong">🧸 Gấu bông</option>
                <option value="phu-kien">🔑 Phụ kiện</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Kích thước</label>
              <input value={form.size} onChange={(e) => setForm({...form, size: e.target.value})} placeholder="15cm" />
            </div>
            <div className="admin-form-group">
              <label>Chất liệu</label>
              <input value={form.material} onChange={(e) => setForm({...form, material: e.target.value})} placeholder="Len cotton" />
            </div>
            <div className="admin-form-group">
              <label>Tags (dùng dấu phẩy)</label>
              <input value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} placeholder="anime, gojo, jjk" />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" placeholder="Mô tả chi tiết sản phẩm..." />
          </div>

          <div className="admin-form-group">
            <label>📷 Hình ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="admin-image-preview" />}
          </div>

          <div className="admin-checkboxes">
            <label><input type="checkbox" checked={form.inStock} onChange={(e) => setForm({...form, inStock: e.target.checked})} /> Còn hàng</label>
            <label><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({...form, isNew: e.target.checked})} /> Mới ✨</label>
            <label><input type="checkbox" checked={form.isHot} onChange={(e) => setForm({...form, isHot: e.target.checked})} /> Hot 🔥</label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Thêm sản phẩm')}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      )}

      {/* Product List */}
      <div className="admin-product-list">
        <h2>📦 Danh sách sản phẩm ({products.length})</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={p.hidden ? 'admin-row--hidden' : ''}>
                  <td>
                    <div className="admin-product-thumb" style={{ backgroundImage: p.image ? `url(${p.image})` : 'none' }}>
                      {!p.image && '🧶'}
                    </div>
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="admin-product-tags">
                      {p.isNew && <span className="badge badge-new">Mới</span>}
                      {p.isHot && <span className="badge badge-hot">Hot</span>}
                      {p.hidden && <span className="badge badge-sold">Ẩn</span>}
                    </div>
                  </td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{categoryNames[p.category] || p.category}</td>
                  <td>{p.inStock ? '✅ Còn' : '❌ Hết'}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <button className="admin-btn-sm admin-btn-edit" onClick={() => handleEdit(p)}>✏️</button>
                      <button className="admin-btn-sm admin-btn-hide" onClick={() => handleToggleHidden(p)}>
                        {p.hidden ? '👁️' : '🙈'}
                      </button>
                      <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

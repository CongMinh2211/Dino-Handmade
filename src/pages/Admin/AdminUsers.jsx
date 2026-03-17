import API_URL from '../../api/config';

const API = `${API_URL}/api`;

const AdminUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API}/users/${editingId}` : `${API}/users`;
      const method = editingId ? 'PUT' : 'POST';
      
      const body = { ...form };
      if (editingId && !body.password) {
        delete body.password; // Don't update password if empty
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        fetchUsers();
        setForm({ username: '', password: '', role: 'admin' });
        setShowForm(false);
        setEditingId(null);
      } else {
        const error = await res.json();
        alert(error.error || 'Có lỗi xảy ra');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (user) => {
    setForm({ username: user.username, password: '', role: user.role });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa tài khoản này?')) return;
    try {
      const res = await fetch(`${API}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || 'Không thể xóa');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Đang tải danh sách tài khoản...</div>;

  return (
    <div className="admin-users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>👤 Quản lý Tài Khoản ({users.length})</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ username: '', password: '', role: 'admin' }); }}>
          {showForm ? '✕ Đóng' : '＋ Thêm tài khoản'}
        </button>
      </div>

      {showForm && (
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <h2>{editingId ? '✏️ Sửa tài khoản' : '➕ Thêm tài khoản mới'}</h2>
          <div className="admin-form-group">
            <label>Tên đăng nhập *</label>
            <input 
              value={form.username} 
              onChange={(e) => setForm({...form, username: e.target.value})} 
              required 
            />
          </div>
          <div className="admin-form-group">
            <label>{editingId ? 'Mật khẩu mới (Bỏ trống nếu không đổi)' : 'Mật khẩu *'}</label>
            <input 
              type="password"
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
              required={!editingId} 
            />
          </div>
          <div className="admin-form-group">
            <label>Phân quyền</label>
            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
              <option value="admin">Quản trị viên</option>
              <option value="editor">Người phụ đan</option>
            </select>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary">Lưu</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Quyền hạn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ fontSize: '0.8rem', color: '#888' }}>{user.id.substring(0,8)}...</td>
                <td><strong>{user.username}</strong></td>
                <td>{user.role === 'admin' ? '👑 Quản trị' : '🛠️ Người phụ'}</td>
                <td>
                  <div className="admin-actions-cell">
                    <button className="admin-btn-sm admin-btn-edit" onClick={() => handleEdit(user)}>✏️</button>
                    <button className="admin-btn-sm admin-btn-delete" onClick={() => handleDelete(user.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../api/config';
import './Admin.css';

const API = `${API_URL}/api`;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', data.username);
      navigate('/admin/dashboard');
    } catch {
      setError('Không thể kết nối server');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">🧶 Dino Handmade</h1>
        <p className="admin-login__subtitle">Trang Quản Trị</p>

        <form onSubmit={handleLogin} className="admin-login__form">
          {error && <div className="admin-error">{error}</div>}

          <div className="admin-form-group">
            <label>👤 Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>🔒 Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary admin-login__btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập ✨'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

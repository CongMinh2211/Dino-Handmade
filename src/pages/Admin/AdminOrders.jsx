import API_URL from '../../api/config';

const API = `${API_URL}/api`;

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Xóa yêu cầu đặt hàng này?')) return;
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="admin-orders">
      <h2>📋 Quản lý Đơn Đặt Hàng ({orders.length})</h2>
      
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Yêu cầu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Chưa có đơn hàng nào</td></tr>
            ) : orders.map(order => (
              <tr key={order.id}>
                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td><strong>{order.name}</strong></td>
                <td>{order.contact}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>NV:</strong> {order.character} <br/>
                    <strong>Size:</strong> {order.size} <br/>
                    <strong>Màu:</strong> {order.colors}
                  </div>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="new">Mới</option>
                    <option value="in_progress">Đang đan</option>
                    <option value="completed">Đã giao</option>
                    <option value="cancelled">Hủy</option>
                  </select>
                </td>
                <td>
                  <button className="admin-btn-sm admin-btn-delete" onClick={() => deleteOrder(order.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

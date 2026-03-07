import { useState } from 'react';
import { motion } from 'framer-motion';
import { shopInfo } from '../../data/mockData';
import { ZaloIcon } from '../../components/Icons/ZaloIcon';
import { FacebookIcon } from '../../components/Icons/FacebookIcon';
import './CustomOrder.css';

const CustomOrder = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    character: '',
    size: 'M',
    colors: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitZalo = async () => {
    if (!formData.name || !formData.contact) {
      alert('Vui lòng điền tên và số điện thoại/Zalo để mình tiện liên hệ nhé!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Lưu đơn hàng vào database
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // 2. Chuyển hướng sang Zalo
      const message = encodeURIComponent(
        `🧶 YÊU CẦU ĐẶT MẪU RIÊNG - Dino Handmade\n\n` +
        `👤 Tên: ${formData.name}\n` +
        `📱 Liên hệ: ${formData.contact}\n` +
        `🎮 Nhân vật: ${formData.character}\n` +
        `📏 Kích thước: ${formData.size}\n` +
        `🎨 Màu sắc: ${formData.colors}\n` +
        `📝 Ghi chú: ${formData.notes}`
      );
      window.open(`https://zalo.me/0941401149?text=${message}`, '_blank');
      
      // Xóa form sau khi gửi
      setFormData({ name: '', contact: '', character: '', size: 'M', colors: '', notes: '' });
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      alert('Có lỗi xảy ra khi gửi đơn, bạn vui lòng thử lại hoặc nhắn tin trực tiếp nhé!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-order" style={{ paddingTop: 'calc(var(--header-height) + 20px)' }}>
      <div className="container">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Đặt Mẫu Theo Yêu Cầu
        </motion.h1>
        <p className="custom-order__subtitle">
          Gửi cho mình ảnh nhân vật bạn yêu thích, mình sẽ đan cho bạn! 🎨🧶
        </p>

        <motion.div
          className="custom-order__form-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="custom-order__form">
            <div className="form-group">
              <label className="form-label">👤 Tên của bạn</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">📱 Số điện thoại / Zalo</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Số điện thoại hoặc Zalo..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">🎮 Nhân vật muốn đan</label>
              <input
                type="text"
                name="character"
                value={formData.character}
                onChange={handleChange}
                placeholder="VD: Gojo Satoru, Pikachu, Omen..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">📏 Kích thước mong muốn</label>
              <select name="size" value={formData.size} onChange={handleChange} className="form-input">
                <option value="S">S - Nhỏ (5-10cm) ~ Móc khóa</option>
                <option value="M">M - Vừa (10-15cm) ~ Để bàn</option>
                <option value="L">L - Lớn (15-25cm) ~ Ôm</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">🎨 Màu sắc yêu thích</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="VD: Hồng, trắng, đen..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">📝 Ghi chú thêm</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Yêu cầu đặc biệt, link ảnh mẫu..."
                className="form-input form-textarea"
                rows="4"
              />
            </div>

            <div className="custom-order__actions">
              <button onClick={handleSubmitZalo} className="btn btn-zalo" type="button">
                <ZaloIcon width={20} height={20} /> Gửi yêu cầu qua Zalo
              </button>
              <a href={shopInfo.contact.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-facebook">
                <FacebookIcon width={20} height={20} /> Inbox Facebook
              </a>
            </div>
          </div>

          <div className="custom-order__info">
            <div className="custom-order__info-card">
              <h3>📋 Quy trình đặt hàng</h3>
              <ol className="custom-order__steps">
                <li>
                  <span className="step-num">1</span>
                  <span>Điền form hoặc nhắn tin trực tiếp</span>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <span>Mình sẽ phản hồi và báo giá trong 24h</span>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <span>Xác nhận đơn và thanh toán cọc 50%</span>
                </li>
                <li>
                  <span className="step-num">4</span>
                  <span>Mình bắt đầu đan (3-7 ngày)</span>
                </li>
                <li>
                  <span className="step-num">5</span>
                  <span>Gửi ảnh thành phẩm, thanh toán và giao hàng!</span>
                </li>
              </ol>
            </div>

            <div className="custom-order__price-guide">
              <h3>💰 Bảng giá tham khảo</h3>
              <div className="price-row">
                <span>Móc khóa (S)</span>
                <span className="price-val">40.000 - 150.000₫</span>
              </div>
              <div className="price-row">
                <span>Để bàn (M)</span>
                <span className="price-val">200.000 - 400.000₫</span>
              </div>
              <div className="price-row">
                <span>Size lớn (L)</span>
                <span className="price-val">400.000 - 800.000₫</span>
              </div>
              <p className="price-note">* Giá thực tế tùy thuộc vào độ phức tạp của mẫu</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomOrder;

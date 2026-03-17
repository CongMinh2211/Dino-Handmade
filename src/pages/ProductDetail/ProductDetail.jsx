import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice, shopInfo } from '../../data/mockData';
import { ZaloIcon } from '../../components/Icons/ZaloIcon';
import { FacebookIcon } from '../../components/Icons/FacebookIcon';
import API_URL from '../../api/config';
import './ProductDetail.css';

const API = `${API_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        data.image = data.image ? data.image : '';
        setProduct(data);
      }
    } catch {
      // Fallback to mock data
      const { products } = await import('../../data/mockData');
      setProduct(products.find((p) => p.id === parseInt(id) || p.id === id));
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: 'calc(var(--header-height) + 40px)', textAlign: 'center' }}>🧶 Đang tải...</div>;
  }

  if (!product) {
    return (
      <div className="product-detail__not-found container" style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}>
        <h2>🧶 Không tìm thấy sản phẩm</h2>
        <Link to="/san-pham" className="btn btn-primary">← Quay lại</Link>
      </div>
    );
  }

  const zaloMessage = encodeURIComponent(`Chào bạn! Mình muốn hỏi về sản phẩm "${product.name}" (${formatPrice(product.price)}) trên Dino Handmade ạ 🧶`);

  return (
    <div className="product-detail" style={{ paddingTop: 'calc(var(--header-height) + 20px)' }}>
      <div className="container">
        <Link to="/san-pham" className="product-detail__back">← Quay lại sản phẩm</Link>

        <div className="product-detail__content">
          <motion.div
            className="product-detail__image-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="product-detail__main-image" style={{ 
              backgroundImage: product.image 
                ? `url(${product.image.startsWith('http') ? product.image : API_URL + product.image})` 
                : 'none' 
            }}>
              {!product.image && <span style={{ fontSize: '6rem', opacity: 0.3 }}>🧶</span>}
            </div>
          </motion.div>

          <motion.div
            className="product-detail__info-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="product-detail__badges">
              {product.isNew && <span className="badge badge-new">✨ Mới</span>}
              {product.isHot && <span className="badge badge-hot">🔥 Hot</span>}
            </div>

            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__price">{formatPrice(product.price)}</p>

            <div className="product-detail__specs">
              <div className="spec-item">
                <span className="spec-label">📏 Kích thước</span>
                <span className="spec-value">{product.size}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">🧶 Chất liệu</span>
                <span className="spec-value">{product.material}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">📦 Trạng thái</span>
                <span className="spec-value" style={{ color: product.inStock ? '#4CAF50' : '#F44336' }}>
                  {product.inStock ? '✅ Còn hàng' : '❌ Hết hàng'}
                </span>
              </div>
            </div>

            <p className="product-detail__description">{product.description}</p>

            {product.tags && product.tags.length > 0 && (
              <div className="product-detail__tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="product-detail__tag">#{tag}</span>
                ))}
              </div>
            )}

            <div className="product-detail__actions">
              <a
                href={`https://zalo.me/0941401149?text=${zaloMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-zalo"
              >
                <ZaloIcon width={20} height={20} /> Nhắn Zalo đặt hàng
              </a>
              <a
                href={shopInfo.contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-facebook"
              >
                <FacebookIcon width={20} height={20} /> Inbox Facebook
              </a>
            </div>

            <p className="product-detail__note">
              💡 Sản phẩm handmade 100%, mỗi sản phẩm có thể khác nhau đôi chút.
              Liên hệ mình qua Zalo hoặc Facebook để được tư vấn chi tiết nhé!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

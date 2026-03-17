import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products as mockProducts, categories, feedbacks as mockFeedbacks, shopInfo, formatPrice } from '../../data/mockData';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const API = '/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, fbRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/feedback`),
      ]);
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.map(p => ({ ...p, image: p.image ? p.image : '' })));
      } else {
        setProducts(mockProducts);
      }
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData.length > 0) setFeedbacks(fbData);
      }
    } catch {
      setProducts(mockProducts);
    }
  };

  // Hiển thị 8 sản phẩm mới nhất hoặc nổi bật nhất
  const featuredProducts = products
    .sort((a, b) => {
      const aFeatured = a.isHot || a.isNew ? 1 : 0;
      const bFeatured = b.isHot || b.isNew ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return b.id - a.id; // Nếu cùng mức độ nổi bật thì ưu tiên sản phẩm mới thêm (ID lớn hơn)
    })
    .slice(0, 8);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__sparkle hero__sparkle--1">✨</div>
          <div className="hero__sparkle hero__sparkle--2">⭐</div>
          <div className="hero__sparkle hero__sparkle--3">🌟</div>
          <div className="hero__sparkle hero__sparkle--4">💫</div>
        </div>
        <div className="hero__content container">
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🧶 {shopInfo.name}
          </motion.h1>
          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {shopInfo.tagline}
          </motion.p>
          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Đồ đan len amigurumi thủ công phong cách anime & game
          </motion.p>
          <motion.div
            className="hero__buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/san-pham" className="btn btn-primary">
              Khám phá ngay ✨
            </Link>
            <Link to="/dat-hang" className="btn btn-outline">
              Đặt mẫu riêng 🎨
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories">
        <div className="container">
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          <div className="categories__grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/san-pham?category=${cat.id}`}
                  className="category-card"
                  style={{ '--cat-color': cat.color }}
                >
                  <span className="category-card__icon">{cat.icon}</span>
                  <span className="category-card__name">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured">
        <div className="container">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <div className="featured__grid">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="featured__cta">
            <Link to="/san-pham" className="btn btn-secondary">
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="section feedbacks">
        <div className="container">
          <h2 className="section-title">Khách Hàng Nói Gì</h2>
          <div className="feedbacks__grid">
            {feedbacks.map((fb, i) => (
              <motion.div
                key={fb.id}
                className="feedback-card card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="feedback-card__stars">
                  {'⭐'.repeat(fb.rating)}
                </div>
                <p className="feedback-card__content">"{fb.content}"</p>
                <div className="feedback-card__author">
                  <span className="feedback-card__avatar">😊</span>
                  <div>
                    <p className="feedback-card__name">{fb.name}</p>
                    <p className="feedback-card__date">{fb.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta">
        <div className="container">
          <motion.div
            className="cta__card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="cta__title">Muốn đặt mẫu riêng? 🎀</h2>
            <p className="cta__desc">
              Gửi ảnh nhân vật anime/game bạn yêu thích, mình sẽ đan cho bạn!
            </p>
            <div className="cta__buttons">
              <a href={`https://zalo.me/${shopInfo.contact.zalo}`} target="_blank" rel="noopener noreferrer" className="btn btn-zalo">
                📱 Nhắn Zalo
              </a>
              <a href={shopInfo.contact.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-facebook">
                🔵 Inbox Facebook
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

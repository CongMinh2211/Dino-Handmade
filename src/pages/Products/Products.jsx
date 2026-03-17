import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories, formatPrice } from '../../data/mockData';
import API_URL from '../../api/config';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const API = `${API_URL}/api`;

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      if (res.ok) {
        const data = await res.json();
        // Add backend URL prefix for images
        setProducts(data.map(p => ({
          ...p,
          image: p.image ? p.image : p.image,
        })));
      }
    } catch {
      // Fallback to mock data
      const { products: mockProducts } = await import('../../data/mockData');
      setProducts(mockProducts);
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    return result;
  }, [activeCategory, searchTerm, products]);

  return (
    <div className="products-page" style={{ paddingTop: 'calc(var(--header-height) + 20px)' }}>
      <div className="container">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Tất Cả Sản Phẩm
        </motion.h1>

        <div className="products-page__search">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-page__search-input"
          />
        </div>

        <div className="products-page__filters">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'filter-btn--active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            🌈 Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="products-page__empty"><p>🧶 Đang tải...</p></div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-page__grid">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="products-page__empty">
            <p>🧶 Không tìm thấy sản phẩm nào</p>
            <p>Thử tìm kiếm với từ khóa khác nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

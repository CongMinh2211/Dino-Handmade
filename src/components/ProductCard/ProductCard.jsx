import { Link } from 'react-router-dom';
import { formatPrice } from '../../data/mockData';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/san-pham/${product.id}`} className="product-card card">
      <div className="product-card__image-wrapper">
        <div className="product-card__image" style={{ backgroundImage: `url(${product.image})` }}>
          {!product.image || product.image.includes('placeholder') ? (
            <span className="product-card__emoji">🧶</span>
          ) : null}
        </div>
        <div className="product-card__badges">
          {product.isNew && <span className="badge badge-new">✨ Mới</span>}
          {product.isHot && <span className="badge badge-hot">🔥 Hot</span>}
        </div>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__category">{product.category === 'anime' ? '🌸 Anime' : product.category === 'game' ? '🎮 Game' : product.category === 'gau-bong' ? '🧸 Gấu bông' : '🔑 Phụ kiện'}</p>
        <div className="product-card__bottom">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <span className="product-card__size">{product.size}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

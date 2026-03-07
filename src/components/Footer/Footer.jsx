import { shopInfo } from '../../data/mockData';
import { ZaloIcon } from '../Icons/ZaloIcon';
import { FacebookIcon } from '../Icons/FacebookIcon';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__wave"></div>
      <div className="footer__content container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__logo">🧶 {shopInfo.name}</h3>
            <p className="footer__tagline">{shopInfo.tagline}</p>
            <p className="footer__desc">{shopInfo.description}</p>
          </div>

          <div className="footer__links">
            <h4 className="footer__heading">Điều hướng</h4>
            <a href="/" className="footer__link">Trang chủ</a>
            <a href="/san-pham" className="footer__link">Sản phẩm</a>
            <a href="/nhat-ky" className="footer__link">Nhật ký</a>
            <a href="/dat-hang" className="footer__link">Đặt hàng</a>
            <a href="/gioi-thieu" className="footer__link">Giới thiệu</a>
          </div>

          <div className="footer__contact">
            <h4 className="footer__heading">Liên hệ</h4>
            <a href={`https://zalo.me/${shopInfo.contact.zalo}`} target="_blank" rel="noopener noreferrer" className="footer__contact-item">
              <ZaloIcon width={16} height={16} /> Zalo: {shopInfo.contact.zalo}
            </a>
            <a href={shopInfo.contact.facebook} target="_blank" rel="noopener noreferrer" className="footer__contact-item">
              <FacebookIcon width={16} height={16} /> Facebook
            </a>
            <a href={`mailto:${shopInfo.contact.email}`} className="footer__contact-item">
              📧 {shopInfo.contact.email}
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 {shopInfo.name}. Tất cả đều được đan bằng tay với 💖</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

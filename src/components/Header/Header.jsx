import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ZaloIcon } from '../Icons/ZaloIcon';
import logoImg from '../../img/logo.jpg';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/san-pham', label: 'Sản phẩm' },
    { path: '/thu-vien', label: 'Góc Trưng Bày' },
    { path: '/nhat-ky', label: 'Nhật ký' },
    { path: '/dat-hang', label: 'Đặt hàng' },
    { path: '/gioi-thieu', label: 'Giới thiệu' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          <img src={logoImg} alt="Dino Handmade Logo" className="header__logo-img" />
          <span className="header__logo-text">Dino Handmade</span>
        </Link>

        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header__nav-link ${location.pathname === link.path ? 'header__nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <a
            href="https://zalo.me/0941401149"
            target="_blank"
            rel="noopener noreferrer"
            className="header__contact-btn"
          >
            <ZaloIcon width={18} height={18} /> Zalo
          </a>
          <button
            className="header__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

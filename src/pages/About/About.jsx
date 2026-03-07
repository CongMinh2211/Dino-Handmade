import { motion } from 'framer-motion';
import { shopInfo } from '../../data/mockData';
import './About.css';

const About = () => {
  return (
    <div className="about-page" style={{ paddingTop: 'calc(var(--header-height) + 20px)' }}>
      <div className="container">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Về Chúng Mình
        </motion.h1>

        {/* Maker Profile */}
        <motion.section
          className="about-page__profile"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="about-page__avatar">
            <span className="about-page__avatar-emoji">🧶</span>
          </div>
          <h2 className="about-page__name">{shopInfo.maker.name}</h2>
          <p className="about-page__role">{shopInfo.maker.role}</p>
          <p className="about-page__bio">{shopInfo.maker.bio}</p>

          <div className="about-page__skills">
            {shopInfo.maker.skills.map((skill) => (
              <span key={skill} className="about-page__skill-tag">{skill}</span>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="about-page__contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="about-page__contact-title">📬 Liên Hệ Với Mình</h2>
          <div className="about-page__contact-grid">
            <a href={`https://zalo.me/${shopInfo.contact.zalo}`} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card__icon">📱</span>
              <span className="contact-card__label">Zalo</span>
              <span className="contact-card__value">{shopInfo.contact.zalo}</span>
            </a>
            <a href={shopInfo.contact.facebook} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card__icon">🔵</span>
              <span className="contact-card__label">Facebook</span>
              <span className="contact-card__value">Nhấn để xem</span>
            </a>
            <a href={`mailto:${shopInfo.contact.email}`} className="contact-card">
              <span className="contact-card__icon">📧</span>
              <span className="contact-card__label">Email</span>
              <span className="contact-card__value">{shopInfo.contact.email}</span>
            </a>
          </div>
        </motion.section>

        {/* Story */}
        <motion.section
          className="about-page__story"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>🌟 Câu Chuyện Dino Handmade</h2>
          <div className="about-page__story-content">
            <p>
              Dino Handmade bắt đầu từ tình yêu dành cho đan len và thế giới anime/game.
              Mỗi sản phẩm amigurumi đều là sự kết hợp giữa nghệ thuật thủ công truyền thống
              và sáng tạo hiện đại.
            </p>
            <p>
              Từ những nhân vật anime được yêu thích như Gojo Satoru (Jujutsu Kaisen)
              đến các agent trong Valorant, mỗi tác phẩm đều được đan tay 100%,
              không có hai sản phẩm nào giống hệt nhau.
            </p>
            <p>
              Mình tin rằng mỗi mũi len không chỉ là một kỹ thuật, mà là một câu chuyện.
              Và mình muốn chia sẻ những câu chuyện đó với bạn! ✨
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;

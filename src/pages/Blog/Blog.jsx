import { motion } from 'framer-motion';
import { blogPosts } from '../../data/mockData';
import './Blog.css';

const Blog = () => {
  return (
    <div className="blog-page" style={{ paddingTop: 'calc(var(--header-height) + 20px)' }}>
      <div className="container">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nhật Ký Làm Đồ
        </motion.h1>
        <p className="blog-page__subtitle">Theo dõi quá trình tạo ra những tác phẩm len dễ thương 🧶</p>

        <div className="blog-page__grid">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              className="blog-card card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="blog-card__image" style={{ backgroundImage: `url(${post.image})` }}>
                <span className="blog-card__emoji">📝</span>
              </div>
              <div className="blog-card__content">
                <span className="blog-card__date">📅 {post.date}</span>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__text">{post.content}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

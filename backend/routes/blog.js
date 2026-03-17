import express from 'express';
import { Blog } from '../models/Blog.js';
import { authMiddleware } from '../utils/auth.js';
import { uploadBlog } from '../utils/cloudinary.js';

const router = express.Router();

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/blog - Admin
router.post('/', authMiddleware, uploadBlog.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;

    const newPost = new Blog({
      title,
      content,
      excerpt,
      image: req.file ? req.file.path : '',
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo bài viết' });
  }
});

// DELETE /api/blog/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    res.json({ message: 'Đã xóa bài viết' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa bài viết' });
  }
});

export default router;

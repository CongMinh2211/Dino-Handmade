import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Blog } from '../models/Blog.js';
import { authMiddleware } from '../utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'blog');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `blog-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

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
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt } = req.body;

    const newPost = new Blog({
      title,
      content,
      excerpt,
      image: req.file ? `/uploads/blog/${req.file.filename}` : '',
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


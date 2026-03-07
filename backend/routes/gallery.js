import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Gallery } from '../models/Gallery.js';
import { authMiddleware } from '../utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for high quality images
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Chỉ hỗ trợ file ảnh: jpg, png, webp, gif'));
  }
});

const router = express.Router();

// GET /api/gallery - Public
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách ảnh' });
  }
});

// POST /api/gallery - Admin
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn ảnh' });
    }

    const newGalleryItem = new Gallery({
      title,
      description: description || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
      image: `/uploads/gallery/${req.file.filename}`,
    });

    await newGalleryItem.save();
    res.status(201).json(newGalleryItem);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tải ảnh lên' });
  }
});

// DELETE /api/gallery/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy ảnh' });
    res.json({ message: 'Đã xóa ảnh' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa ảnh' });
  }
});

export default router;

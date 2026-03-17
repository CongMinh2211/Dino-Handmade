import express from 'express';
import { Gallery } from '../models/Gallery.js';
import { authMiddleware } from '../utils/auth.js';
import { uploadGallery } from '../utils/cloudinary.js';

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
router.post('/', authMiddleware, (req, res, next) => {
  console.log('🚀 POST /api/gallery - Bắt đầu xử lý upload...');
  uploadGallery.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Lỗi Multer/Cloudinary (Gallery):', err);
      return res.status(400).json({ error: 'Lỗi tải ảnh lên Cloudinary: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('✅ Upload thành công. File info:', req.file ? req.file.path : 'No file');
    const { title, description, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn ảnh' });
    }

    const newGalleryItem = new Gallery({
      title,
      description: description || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
      image: req.file.path,
    });

    await newGalleryItem.save();
    console.log('✨ Đã tải ảnh lên Gallery:', newGalleryItem.title);
    res.status(201).json(newGalleryItem);
  } catch (err) {
    console.error('❌ Lỗi khi tải ảnh lên Gallery:', err);
    res.status(500).json({ error: 'Không thể tải ảnh lên: ' + err.message });
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

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { authMiddleware } from '../utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Chỉ hỗ trợ file ảnh: jpg, png, webp, gif'));
  }
});

const router = express.Router();

// GET /api/products - Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { hidden: false };

    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      const term = new RegExp(search, 'i');
      query.$or = [
        { name: term },
        { tags: { $in: [term] } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm' });
  }
});

// GET /api/products/all - Admin (includes hidden)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/products - Admin
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, size, material, tags, inStock, isNew, isHot } = req.body;

    const newProduct = new Product({
      name,
      description,
      price: parseInt(price) || 0,
      category: category || 'phu-kien',
      image: req.file ? `/uploads/products/${req.file.filename}` : '',
      size: size || '',
      material: material || 'Len cotton',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      inStock: inStock === 'true',
      isNew: isNew === 'true',
      isHot: isHot === 'true',
      hidden: false
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo sản phẩm' });
  }
});

// PUT /api/products/:id - Admin
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, size, material, tags, inStock, isNew, isHot, hidden } = req.body;
    
    let updateData = {
      name,
      description,
      price: price !== undefined ? parseInt(price) : undefined,
      category,
      size,
      material,
      tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
      inStock: inStock !== undefined ? inStock === 'true' : undefined,
      isNew: isNew !== undefined ? isNew === 'true' : undefined,
      isHot: isHot !== undefined ? isHot === 'true' : undefined,
      hidden: hidden !== undefined ? hidden === 'true' : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Không thể cập nhật sản phẩm' });
  }
});

// DELETE /api/products/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
  }
});


export default router;

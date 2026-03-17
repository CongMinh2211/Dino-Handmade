import express from 'express';
import { Product } from '../models/Product.js';
import { authMiddleware } from '../utils/auth.js';
import { uploadProduct } from '../utils/cloudinary.js';

const router = express.Router();

// GET /api/products - Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { hidden: { $ne: true } };

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
router.post('/', authMiddleware, (req, res, next) => {
  console.log('🚀 POST /api/products - Bắt đầu xử lý upload...');
  uploadProduct.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Lỗi Multer/Cloudinary (POST):', err);
      return res.status(400).json({ error: 'Lỗi tải ảnh lên Cloudinary: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('✅ Upload thành công. File info:', req.file ? req.file.path : 'No file');
    const { name, description, price, category, size, material, tags, inStock, isNew, isHot } = req.body;

    const newProduct = new Product({
      name,
      description,
      price: parseInt(price) || 0,
      category: category || 'phu-kien',
      image: req.file ? req.file.path : '',
      size: size || '',
      material: material || 'Len cotton',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      inStock: inStock === 'true' || inStock === true,
      isNew: isNew === 'true' || isNew === true,
      isHot: isHot === 'true' || isHot === true,
      hidden: false
    });

    await newProduct.save();
    console.log('✨ Đã lưu sản phẩm mới vào DB:', newProduct.name);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Lỗi khi lưu sản phẩm (POST):', err);
    res.status(500).json({ error: 'Không thể tạo sản phẩm: ' + err.message });
  }
});

// PUT /api/products/:id - Admin
router.put('/:id', authMiddleware, (req, res, next) => {
  console.log('🚀 PUT /api/products/' + req.params.id + ' - Bắt đầu xử lý upload...');
  uploadProduct.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Lỗi Multer/Cloudinary (PUT):', err);
      return res.status(400).json({ error: 'Lỗi tải ảnh lên Cloudinary: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('✅ Upload thành công. File info:', req.file ? req.file.path : 'No file');
    const { name, description, price, category, size, material, tags, inStock, isNew, isHot, hidden } = req.body;
    
    let updateData = {
      name,
      description,
      price: price !== undefined ? parseInt(price) : undefined,
      category,
      size,
      material,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : undefined,
      inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : undefined,
      isNew: isNew !== undefined ? (isNew === 'true' || isNew === true) : undefined,
      isHot: isHot !== undefined ? (isHot === 'true' || isHot === true) : undefined,
      hidden: hidden !== undefined ? (hidden === 'true' || hidden === true) : undefined,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      console.log('⚠️ Không tìm thấy sản phẩm để cập nhật:', req.params.id);
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    
    console.log('✨ Đã cập nhật sản phẩm:', updated.name);
    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật sản phẩm (PUT):', err);
    res.status(500).json({ error: 'Không thể cập nhật sản phẩm: ' + err.message });
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

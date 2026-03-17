import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import productRoutes from './routes/products.js';
import blogRoutes from './routes/blog.js';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import galleryRoutes from './routes/gallery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

const MONGO_URI = 'mongodb+srv://admin:Dino123456@cluster0.92uaoys.mongodb.net/dino_handmade?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối với MongoDB Atlas'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));


// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Phục vụ thư mục uploads (ảnh sản phẩm)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Phục vụ các file tĩnh từ thư mục build của React (Vite dist)
const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Dino Handmade API' });
});

// Xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Lỗi server nội bộ',
    code: err.code || 'INTERNAL_ERROR'
  });
});

// Catch-all route: Chuyển hướng mọi request không thuộc API về React App (hỗ trợ React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧶 Dino Handmade Server đang chạy tại cổng ${PORT}`);
});

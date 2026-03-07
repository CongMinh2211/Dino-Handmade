import express from 'express';
import { Order } from '../models/Order.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// POST /api/orders (Public)
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      status: 'new'
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Không thể gửi đơn hàng' });
  }
});

// GET /api/orders (Admin protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// PUT /api/orders/:id (Admin protected - update status)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Không thể cập nhật đơn hàng' });
  }
});

// DELETE /api/orders/:id (Admin protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa đơn hàng' });
  }
});

export default router;


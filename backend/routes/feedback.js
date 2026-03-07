import express from 'express';
import { Feedback } from '../models/Feedback.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// GET /api/feedback - Public (approved only)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// GET /api/feedback/all - Admin
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/feedback - Public (khách gửi)
router.post('/', async (req, res) => {
  try {
    const { name, comment, rating } = req.body;

    const newFeedback = new Feedback({
      name,
      comment,
      rating: parseInt(rating) || 5,
      approved: false,
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: 'Không thể gửi phản hồi' });
  }
});

// PUT /api/feedback/:id/approve - Admin
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ error: 'Không tìm thấy feedback' });

    fb.approved = !fb.approved;
    await fb.save();
    res.json(fb);
  } catch (err) {
    res.status(500).json({ error: 'Không thể cập nhật feedback' });
  }
});

// DELETE /api/feedback/:id - Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy feedback' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa feedback' });
  }
});

export default router;


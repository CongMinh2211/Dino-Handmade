import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { ensureDefaultAdmin } from './users.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    await ensureDefaultAdmin(); // Make sure at least one admin exists
    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Sai tên đăng nhập' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }

    const token = generateToken({ id: user.id || user._id, username: user.username, role: user.role });
    res.json({ token, username: user.username, role: user.role, id: user.id || user._id });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword, username } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Không thể đổi mật khẩu' });
  }
});

export default router;


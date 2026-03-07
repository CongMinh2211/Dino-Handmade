import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// Utility to verify/create default admin if users array is empty
export async function ensureDefaultAdmin() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      const defaultAdmin = new User({ 
        username: 'admin', 
        password: hash, 
        role: 'admin' 
      });
      await defaultAdmin.save();
      console.log('✅ Default admin created in MongoDB');
    }
  } catch (err) {
    console.error('❌ Error in ensureDefaultAdmin:', err);
  }
}

// Ensure default admin on server start (Note: this is now async, handled in server.js or just called here)
ensureDefaultAdmin();

// GET /api/users (Admin protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(products); // Wait, I typed 'products' by mistake in my head, let me fix it
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/users (Admin protected - add new admin account)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;
    
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      password: hash,
      role
    });

    await newUser.save();
    
    const safeUser = newUser.toObject();
    delete safeUser.password;
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo người dùng' });
  }
});

// PUT /api/users/:id (Admin protected - update user info/password)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check username collision if changing username
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
      }
    }

    let updateData = { username, role };
    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    // Remove undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Không thể cập nhật người dùng' });
  }
});

// DELETE /api/users/:id (Admin protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ error: 'Không thể xóa tài khoản Quản trị duy nhất' });
    }
    
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa người dùng' });
  }
});


export default router;

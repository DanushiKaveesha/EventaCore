import express from 'express';
import User from '../models/User.js';
import userController from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Logged-in user's profile
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.delete('/profile', protect, userController.deleteOwnProfile);

// Admin user management
router.get('/', protect, authorizeRoles('admin'), userController.getAllUsers);
router.put(
  '/:id/status',
  protect,
  authorizeRoles('admin'),
  userController.updateUserStatus
);
router.get('/:id', protect, authorizeRoles('admin'), userController.getUserById);
router.put('/:id', protect, authorizeRoles('admin'), userController.updateUser);
router.delete('/:id', protect, authorizeRoles('admin'), userController.deleteUser);

// Optional utility/search routes for admin use
router.get('/search/:username', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      '-passwordHash'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/check/:username', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      '-passwordHash'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/find', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(
  '/search/name/:name',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: req.params.name, $options: 'i' } },
          { firstName: { $regex: req.params.name, $options: 'i' } },
          { lastName: { $regex: req.params.name, $options: 'i' } },
        ],
      }).select('-passwordHash');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post('/search', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const users = await User.find({
      $or: [
        { username: { $regex: name, $options: 'i' } },
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
      ],
    }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/test/exists', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const count = await User.countDocuments();
    const allUsers = await User.find().select(
      'username firstName lastName email _id status role'
    );
    res.json({
      message: 'User routes working',
      totalUsers: count,
      allUsers,
      sampleUsers: await User.find()
        .limit(3)
        .select('username firstName lastName email'),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
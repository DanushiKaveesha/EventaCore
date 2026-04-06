const express = require('express');
const User = require('../Models/User');
const userController = require('../Controllers/UserController');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

const router = express.Router();

// User Profile Routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.patch('/profile/deactivate', protect, userController.deactivateCurrentUser);


// Admin user management
// --------------------------------------------------------------------------
// NOTE: Main user CRUD is currently handled by UserRoute.js.
// If you need the search utilities, they are implemented below:

router.get('/search/:username', protect, adminOnly, async (req, res) => {
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

router.get('/check/:username', protect, adminOnly, async (req, res) => {
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

router.post('/find', protect, adminOnly, async (req, res) => {
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
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: req.params.name, $options: 'i' } },
          { firstName: { $regex: req.params.name, $options: 'i' } },
          { lastName: { $regex: req.params.name, $options: 'i' } },
          { name: { $regex: req.params.name, $options: 'i' } }
        ],
      }).select('-passwordHash -password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post('/search', protect, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    const users = await User.find({
      $or: [
        { username: { $regex: name, $options: 'i' } },
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
        { name: { $regex: name, $options: 'i' } }
      ],
    }).select('-passwordHash -password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/test/exists', protect, adminOnly, async (req, res) => {
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

module.exports = router;
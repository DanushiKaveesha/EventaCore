const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Ensure the user account is active
      const isCurrentlyActive = req.user.status ? req.user.status === 'active' : req.user.isActive !== false;
      if (!isCurrentlyActive) {
        const statusMsg = req.user.status === 'suspended' ? 'Your account has been suspended.' : 'Your account has been deactivated.';
        return res.status(403).json({
          success: false,
          message: statusMsg,
          isAccountRestricted: true
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
<<<<<<< HEAD
  if (req.user && req.user.role === 'Admin') {
=======
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
>>>>>>> SecondMerge
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
};

// Organizer or Admin
exports.organizerOrAdmin = (req, res, next) => {
<<<<<<< HEAD
  if (req.user && (req.user.role === 'Organizer' || req.user.role === 'Admin')) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Organizer or Admin access required' 
    });
  }
=======
  if (req.user && req.user.role) {
    const r = req.user.role.toLowerCase();
    if (r === 'organizer' || r === 'admin') {
      return next();
    }
  }
  res.status(403).json({ 
      success: false,
      message: 'Organizer or Admin access required' 
    });
>>>>>>> SecondMerge
};
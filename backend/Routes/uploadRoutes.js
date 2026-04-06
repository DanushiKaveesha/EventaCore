const express = require('express');
const upload = require('../Middleware/upload.js');

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload single image
// @access  Public
router.post('/', (req, res) => {
  upload.single('profileImage')(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        message: err.message || 'Image upload failed',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    return res.status(200).json({
      message: 'Image uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
    });
  });
});

module.exports = router;
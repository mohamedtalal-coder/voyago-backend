const express = require('express');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Single image upload
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      url: req.file.path,
      public_id: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Multiple images upload (up to 10)
router.post('/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const urls = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json({ images: urls });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;

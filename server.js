const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dzqtakvvi',
  api_key: '229311813876698',
  api_secret: 'A67kwcz2ADqQvX6MGtEu8i231HU'
});

// ☁️ Cloudinary storage with overwrite & invalidate
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',               // Cloudinary folder
      public_id: req.params.name,      // Use URL param as image name
      format: 'jpg',                   // Force .jpg extension
      transformation: [],              // Optional: resize/crop
      overwrite: true,                 // ✅ Force overwrite
      invalidate: true                 // ✅ Clear CDN cache
    };
  }
});

const upload = multer({ storage });

// Serve public and views
app.use(express.static('public'));
app.use(express.static('views'));

// 📤 Upload Route
app.post('/upload/:name', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('❌ Upload failed — no file received.');
    return res.status(400).send('Upload failed');
  }

  console.log('✅ Cloudinary upload complete:', {
    originalname: req.file.originalname,
    path: req.file.path,
    url: req.file.path // Cloudinary image URL
  });

  res.redirect('/admin.html');
});

// ❗ Error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
    console.error('❌ Upload error:', err.message);
    return res.status(400).send(err.message);
  }

  console.error('❌ Unexpected error:', err);
  res.status(500).send('Internal Server Error');
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000; // ⚠️ Use correct port for Render

// 🔐 Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dzqtakvvi',
  api_key: '229311813876698',
  api_secret: 'A67kwcz2ADqQvX6MGtEu8i231HU'
});

// ☁️ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      public_id: req.params.name,
      format: 'jpg',
      transformation: [],
      overwrite: true,      // ✅ Force overwrite same public_id
      invalidate: true      // ✅ Invalidate CDN cache
    };
  }
});

const upload = multer({ storage });

// Static Files
app.use(express.static('public'));
app.use(express.static('views'));

// 📤 Upload Route
app.post('/upload/:name', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('❌ No file uploaded');
    return res.status(400).send('No file uploaded');
  }

  console.log('✅ Upload successful:', {
    name: req.params.name,
    originalname: req.file.originalname,
    url: req.file.path
  });

 res.redirect('/admin.html?upload=success');
});

// ❗ Error Handling
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err);
  res.status(500).send('Internal Server Error');
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
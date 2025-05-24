const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Cloudinary Config — replace these with your actual credentials
cloudinary.config({
  cloud_name: 'dzqtakvvi',
  api_key: '229311813876698',
  api_secret: 'A67kwcz2ADqQvX6MGtEu8i231HU'
});

// ☁️ Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // folder in Cloudinary
    format: async (req, file) => 'jpg', // all images saved as .jpg
    public_id: (req, file) => req.params.name, // use /upload/:name
  }
});

const upload = multer({ storage });

// Serve static files from public and views (not uploads anymore)
app.use(express.static('public'));
app.use(express.static('views'));

// 📤 Upload route
app.post('/upload/:name', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('❌ Upload failed — no file received.');
    return res.status(400).send('Upload failed');
  }

  console.log('✅ Uploaded to Cloudinary:', req.file.path);
  res.redirect('/admin.html');
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Invalid file type')) {
    console.error('Upload error:', err.message);
    return res.status(400).send(err.message);
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
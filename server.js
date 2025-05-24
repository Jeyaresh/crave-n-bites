const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('📁 uploads folder created');
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Force extension to .jpg for consistency
    const imageName = req.params.name + '.jpg';
    cb(null, imageName);
  }
});

// File filter: allow only jpeg, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Invalid file type: ' + file.mimetype), false);
  }
};

const upload = multer({ storage, fileFilter });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('views'));

// Upload route
app.post('/upload/:name', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('❌ Upload failed — no file received or invalid type.');
    return res.status(400).send('Upload failed');
  }

  console.log('✅ File uploaded:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    filename: req.file.filename,
    path: req.file.path,
  });

  res.redirect('/admin.html');
});

// Error handling middleware for multer and file type errors
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
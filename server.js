const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const imageName = req.params.name + path.extname(file.originalname);
    cb(null, imageName);
  }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('views'));

app.post('/upload/:name', upload.single('image'), (req, res) => {
  console.log(`✅ Uploaded: ${req.params.name}`);
  res.redirect('/admin.html');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
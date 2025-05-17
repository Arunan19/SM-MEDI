// sendFile.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your database connection
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reports',
    resource_type: 'raw'
  }
});
const upload = multer({ storage });

// POST /api/send-file
router.post('/send-file', upload.single('file'), async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const fileUrl = req.file.path;
  const fileName = req.file.originalname;

  try {
    await db.query(
      'INSERT INTO sent_files (sender_id, receiver_id, file_path, file_name, message) VALUES (?, ?, ?, ?, ?)',
      [senderId, receiverId, fileUrl, fileName, message]
    );

    res.json({ success: true, fileUrl });
  } catch (error) {
    console.error('DB Insert Error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/sent-files/:userId
router.get('/sent-files/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [files] = await db.query(
      'SELECT id, sender_id, receiver_id, file_name, file_path, message, created_at FROM sent_files WHERE receiver_id = ?',
      [userId]
    );
    res.json({ success: true, files });
  } catch (error) {
    console.error('Fetch Sent Files Error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

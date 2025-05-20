const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your mysql2 promise pool

// 🔹 Attendance Reports
router.get('/attendance', async (req, res) => {
  try {
    const filter = req.query.filter;
    let condition = '1=1';  // default to no filter

    if (filter === 'today') {
      condition = 'DATE(a.date) = CURDATE()';
    } else if (filter === 'month') {
      condition = 'MONTH(a.date) = MONTH(CURDATE()) AND YEAR(a.date) = YEAR(CURDATE())';
    } else if (filter === 'year') {
      condition = 'YEAR(a.date) = YEAR(CURDATE())';
    }

    const sql = `
      SELECT u.firstname, u.lastname, a.status, a.date
      FROM attendance a
      JOIN users u ON a.userid = u.userid
      WHERE ${condition}
    `;

    const [results] = await db.query(sql);  // await the promise query
    res.json(results);
  } catch (err) {
    console.error('Attendance report error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Sample Request Reports
router.get('/sample-requests', async (req, res) => {
  try {
    const filter = req.query.filter;
    let condition = '1=1';

    if (filter === 'today') {
      condition = 'DATE(s.request_date) = CURDATE()';
    } else if (filter === 'month') {
      condition = 'MONTH(s.request_date) = MONTH(CURDATE()) AND YEAR(s.request_date) = YEAR(CURDATE())';
    } else if (filter === 'year') {
      condition = 'YEAR(s.request_date) = YEAR(CURDATE())';
    }

    const sql = `
      SELECT s.*, u.firstname, u.lastname
      FROM sample_requests s
      JOIN users u ON s.user_id = u.userid
      WHERE ${condition}
    `;

    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Sample request report error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

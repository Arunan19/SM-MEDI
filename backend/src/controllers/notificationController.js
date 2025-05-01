const db = require('../config/db');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json({ notifications: results });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Get notifications by recipient_id or role
exports.getUserNotifications = async (req, res) => {
  const { userid, role } = req.query;

  try {
    let query = `SELECT * FROM notifications WHERE `;
    const params = [];

    if (userid && role) {
      query += `(recipient_id = ? OR recipient_role = ? OR recipient_role = 'all')`;
      params.push(userid, role);
    } else if (userid) {
      query += `(recipient_id = ? OR recipient_role = 'all')`;
      params.push(userid);
    } else if (role) {
      query += `(recipient_role = ? OR recipient_role = 'all')`;
      params.push(role);
    } else {
      query = `SELECT * FROM notifications WHERE recipient_role = 'all'`;
    }

    query += ` ORDER BY created_at DESC`;

    const [results] = await db.query(query, params);
    res.json({ notifications: results });

  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};



// Create a new notification
exports.createNotification = async (req, res) => {
  const { title, message, recipient_id, recipient_role } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO notifications (title, message, recipient_id, recipient_role)
       VALUES (?, ?, ?, ?)`,
      [title, message, recipient_id || null, recipient_role || null]
    );
    res.status(201).json({ message: "Notification created", notification_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification", details: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM notifications WHERE notification_id = ?", [id]);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification", details: err.message });
  }
};

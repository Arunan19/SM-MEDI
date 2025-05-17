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
  let { userid, role } = req.query;

  // Sanitize inputs
  userid = userid?.trim();
  role = role?.trim();

  console.log("Sanitized Query Params:", { userid, role });

  try {
    if (!userid && !role) {
      return res.status(400).json({ error: "userid or role is required" });
    }

    const params = [];
    const conditions = [];

    if (userid) {
      conditions.push(`recipient_id = ?`);
      params.push(userid);
    }

    if (role) {
      conditions.push(`recipient_role = ?`);
      params.push(role);
    }

    // Always include global notifications
    conditions.push(`recipient_role = 'all'`);

    const query = `
      SELECT * FROM notifications
      WHERE (${conditions.join(' OR ')})
      ORDER BY created_at DESC
    `;

    console.log("QUERY:", query);
    console.log("PARAMS:", params);

    const [results] = await db.query(query, params);
    res.json({ notifications: results });
  } catch (err) {
    console.error(err);
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

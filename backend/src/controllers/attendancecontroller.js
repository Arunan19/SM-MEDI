const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// ✅ Automatically mark attendance for all users
exports.autoMarkAttendance = async (req, res) => {
  try {
    // Get all users
    const [users] = await db.execute("SELECT userid FROM users");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found in the system" });
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Insert attendance for each user if not already marked
    for (const user of users) {
      const checkQuery = `SELECT * FROM Attendance WHERE userid = ? AND date = ?`;
      const [existing] = await db.execute(checkQuery, [user.userid, today]);

      if (existing.length === 0) {
        const insertQuery = `INSERT INTO Attendance (userid, date, status) VALUES (?, ?, 'Absent')`;
        await db.execute(insertQuery, [user.userid, today]);
      }
    }

    res.status(200).json({ message: "Attendance marked successfully for all users" });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

// ✅ Manually mark attendance for a specific user
exports.markAttendance = async (req, res) => {
    const { userid, status } = req.body;
    try {
      // Validate input
      if (!userid || !status) {
        return res.status(400).json({ message: "User ID and status are required" });
      }
  
      // Get today's date
      const today = new Date().toISOString().split("T")[0];
  
      // Check if attendance is already marked
      const checkQuery = `SELECT * FROM Attendance WHERE userid = ? AND date = ?`;
      const [existing] = await db.execute(checkQuery, [userid, today]);
  
      if (existing.length > 0) {
        // Attendance exists -> Update the existing record
        const updateQuery = `UPDATE Attendance SET status = ? WHERE userid = ? AND date = ?`;
        await db.execute(updateQuery, [status, userid, today]);
  
        return res.status(200).json({ message: "Attendance updated successfully" });
      }
  
      // Insert new attendance record
      const insertQuery = `INSERT INTO Attendance (userid, date, status) VALUES (?, ?, ?)`;
      await db.execute(insertQuery, [userid, today, status]);
  
      res.status(200).json({ message: "Attendance marked successfully" });
    } catch (err) {
      console.error("Error marking attendance:", err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };
  

// ✅ Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const query = `
     SELECT a.Attendance_id, 
       u.userid AS employeeId, 
       u.firstname, 
       u.lastname, 
       a.date, 
       a.status, 
       a.created_at 
       FROM Attendance a
       JOIN users u ON a.userid = u.userid
       ORDER BY a.date DESC
    `;
    const [results] = await db.execute(query);

    res.status(200).json({ attendance: results });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Ensure database connection
const bcrypt = require("bcryptjs");

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "User"');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add user
router.post("/add", async (req, res) => {
  const { firstName, lastName, email, username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO "User" (FirstName, LastName, Email, Username, Password, Role) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstName, lastName, email, username, hashedPassword, role]
    );
    res.status(201).json({ message: "User added successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete user (only Admin)
router.delete("/delete", async (req, res) => {
  const { adminUsername, password, userId } = req.body; // Changed userEmail to userId
  try {
    // Verify if the admin exists and has the Admin role
    const adminResult = await pool.query('SELECT * FROM "User" WHERE Username = $1 AND Role = $2', [adminUsername, "Admin"]);
    const admin = adminResult.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(403).json({ error: "Unauthorized: Only admin can delete users" });
    }

    // Delete the user by user ID
    await pool.query('DELETE FROM "User" WHERE UserId = $1', [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

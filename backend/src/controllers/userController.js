const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.registerUser = async (req, res) => {
  const { username, password, role, firstname, lastname, email, phone, address } = req.body;
  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    await connection.beginTransaction(); // Start transaction

    console.log('Query Params:', email, phone);

    // Check if email already exists
    const [rows] = await connection.query("SELECT * FROM Users WHERE email = ?", [email]);

    if (rows.length > 0) {
      await connection.rollback(); // Rollback changes if email exists
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Insert Params:', username, hashedPassword, role, firstname, lastname, email, phone, address);

    // Insert new user
    const insertQuery = `INSERT INTO Users (username, password, role, firstname, lastname, email, phone, address)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [insertResults] = await connection.query(insertQuery, [username, hashedPassword, role, firstname, lastname, email, phone, address]);

    await connection.commit(); // Commit transaction

    res.status(201).json({
      message: 'User registered successfully',
      userid: insertResults.insertId
    });
  } catch (err) {
    await connection.rollback(); // Rollback transaction on error
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};


// Find user by username
const findUserByUsername = async (username) => {
  try {
      console.log("Checking database connection:", db); // Debugging

      console.log("Searching for user:", username);
      
      if (!db || typeof db.query !== "function") {
          throw new Error("Database connection is not properly initialized.");
      }

      const [rows] = await db.query("SELECT username, password, role FROM users WHERE username = ?", [username]);
      
      if (rows.length === 0) return null; // No user found
      
      console.log("User Retrieved from DB:", rows[0]);
      return rows[0];
  } catch (error) {
      console.error("Database Query Error:", error);
      return null;
  }
};


// Login User API
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
      if (!username || !password) {
          return res.status(400).json({ message: "Username and Password required" });
      }

      // Find user in DB
      const user = await findUserByUsername(username);
      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          return res.status(401).json({ message: "Invalid Password" });
      }

      // Ensure JWT Secret is available
      if (!process.env.JWT_SECRET) {
          console.error("JWT Secret is missing in .env file");
          return res.status(500).json({ message: "JWT Secret is not defined" });
      }

      // Generate JWT Token
      const generateToken = (user) => {
        return jwt.sign(
          {
            userid: user.userid, 
            username: user.username, 
            role: user.role
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
      };

      const token = generateToken(user); // Call the function to generate the token

      console.log("Generated JWT Token:", token);

      // Send token and role in response
      res.json({ token, role: user.role });

  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
  }
};

// GET /users/{user_id}
exports.getUserProfile = async (req, res) => {
  try {
    // Validate authentication token
    const username = req.user?.username;
    if (!username) {
      return res.status(400).json({ message: "Invalid or missing authentication token" });
    }

    console.log(`Searching for user with username: ${username}`);

    const query = 'SELECT * FROM users WHERE username = ?';
    const [results] = await db.execute(query, [username]);

    if (results.length === 0) {
      console.log(`No user found with username: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    return res.status(200).json({
      userid: user.userid,
      username: user.username,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phonenumber: user.phone,
      address: user.address
    });

  } catch (err) {
    console.error("Error querying user:", err);
    return res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

  
// PUT /users/{user_id}
exports.updateUserProfile = async (req, res) => {
  const { username } = req.params;
  const updates = req.body;

  try {
    // Build the query dynamically
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(username);

    const query = `UPDATE Users SET ${fields} WHERE username = ?`;
    const [results] = await db.execute(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

// Get all users (optional, if needed)
exports.getAllusers = async (req, res) => {
  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    // Ensure only authorized users can access this endpoint
    const { role } = req.user;
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const query = `SELECT userid, username, role, firstname, lastname, email, phone, address FROM Users`;
    const [users] = await connection.query(query);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};

exports.changePasswordBeforeLogin = async (req, res) => {
  const { username, email, newPassword } = req.body;

  try {
    // Check if the username and email match
    const query = `SELECT * FROM Users WHERE username = ? AND email = ?`;
    const [rows] = await db.execute(query, [username, email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const updateQuery = `UPDATE Users SET password = ? WHERE username = ? AND email = ?`;
    await db.execute(updateQuery, [hashedPassword, username, email]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

exports.changePasswordAfterLogin = async (req, res) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Check if the username is provided
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Validate if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Fetch the user from the database by username
    const query = `SELECT * FROM Users WHERE username = ?`;
    const [rows] = await db.execute(query, [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the stored hashed password
    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updateQuery = `UPDATE Users SET password = ? WHERE username = ?`;
    await db.execute(updateQuery, [hashedPassword, username]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

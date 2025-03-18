const pool = require("../config/db");

// Get User Profile by ID
const getUserById = async (userid) => {
    const result = await pool.query('SELECT userid, username, role, FirstName, LastName, PhoneNumber, Email, Address FROM "User" WHERE userid = $1', [userid]);
    return result.rows[0]; // Return single user
};

// Update User Profile Details
const updateUserDetails = async (userid, FirstName, LastName, PhoneNumber, Email, Address) => {
    const result = await pool.query(
        `UPDATE "User" SET FirstName = $1, LastName = $2, PhoneNumber = $3, Email = $4, Address = $5 
         WHERE userid = $6 RETURNING *`,
        [FirstName, LastName, PhoneNumber, Email, Address, userid]
    );
    return result.rows[0];
};

// Change User Password
const updateUserPassword = async (userid, hashedPassword) => {
    const result = await pool.query(
        `UPDATE "User" SET password = $1 WHERE userid = $2 RETURNING *`,
        [hashedPassword, userid]
    );
    return result.rows[0];
};

module.exports = { getUserById, updateUserDetails, updateUserPassword };

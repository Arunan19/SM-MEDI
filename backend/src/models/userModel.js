const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const findUserByUsername = async (username) => {
    const result = await pool.query(
        'SELECT "userid", "username", "password", "role" FROM "User" WHERE "username" = $1',
        [username]
    );

    console.log("Database Query Result:", result.rows); // Debugging statement

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const findUserById = async (userid) => {
    const result = await pool.query(
        'SELECT "userid", "username", "password", "role" FROM "User" WHERE "userid" = $1',
        [userid]
    );

    console.log("Database Query Result:", result.rows); // Debugging statement

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const updateUserPassword = async (userid, currentPassword, newPassword) => {
    const user = await findUserById(userid);
    if (!user) return null;

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return null;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
        'UPDATE "User" SET "password" = $1 WHERE "userid" = $2',
        [hashedPassword, userid]
    );

    return user;
};

module.exports = { findUserByUsername, findUserById, updateUserPassword };

const pool = require("../config/db");

const findAdminById = async (userid) => {
    console.log("Finding Admin by ID:", userid);
    const result = await pool.query(
        'SELECT "userid", "first_name", "last_name", "phone_number", "email", "address" FROM "Admin" WHERE "userid" = $1',
        [userid]
    );

    console.log("Database Query Result:", result.rows);

    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

const updateAdminDetails = async (userid, first_name, last_name, phone_number, email, address) => {
    console.log("Updating Admin Details:", { userid, first_name, last_name, phone_number, email, address });
    await pool.query(
        'UPDATE "Admin" SET "first_name" = $1, "last_name" = $2, "phone_number" = $3, "email" = $4, "address" = $5 WHERE "userid" = $6',
        [first_name, last_name, phone_number, email, address, userid]
    );
};

module.exports = { findAdminById, updateAdminDetails };

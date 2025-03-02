const bcrypt = require("bcryptjs");
const { updateUserDetails, updateUserPassword } = require("../models/userModel");
const { findAdminById, updateAdminDetails } = require("../models/adminModel");

const editUserDetails = async (req, res) => {
    const { userid, first_name, last_name, phone_number, email, address } = req.body;

    try {
        console.log("Edit User Details Request:", req.body);
        const admin = await findAdminById(userid);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        await updateAdminDetails(userid, first_name, last_name, phone_number, email, address);
        res.json({ message: "User details updated successfully" });
    } catch (error) {
        console.error("Edit User Details Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const changePassword = async (req, res) => {
    const { userid, currentPassword, newPassword } = req.body;

    try {
        console.log("Change Password Request:", req.body);
        const user = await updateUserPassword(userid, currentPassword, newPassword);
        if (!user) return res.status(401).json({ message: "Invalid current password" });

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAdminProfile = async (req, res) => {
    console.log("Request User Data:", req.user);

    const userid = req.user?.userid;
    if (!userid) return res.status(401).json({ message: "Unauthorized access" });

    try {
        const admin = await findAdminById(userid);
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { editUserDetails, changePassword, getAdminProfile };

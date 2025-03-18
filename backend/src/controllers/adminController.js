const bcrypt = require("bcryptjs");
const { getUserById, updateUserDetails, updateUserPassword } = require("../models/user_Model.js");

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userid = req.user.user_id; // Extract user ID from token
        
        if (!userid) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await getUserById(userid);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Edit User Details
const editUserProfile = async (req, res) => {
    try {
        const userid = req.user.user_id;
        const { FirstName, LastName, PhoneNumber, Email, Address } = req.body;

        const updatedUser = await updateUserDetails(userid, FirstName, LastName, PhoneNumber, Email, Address);

        res.json({ message: "User profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Change User Password
const changeUserPassword = async (req, res) => {
    try {
        const userid = req.user.user_id;
        const { currentPassword, newPassword } = req.body;

        const user = await getUserById(userid);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.status(401).json({ message: "Incorrect current password" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await updateUserPassword(userid, hashedPassword);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getUserProfile, editUserProfile, changeUserPassword };

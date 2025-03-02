const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByUsername, findUserById } = require("../models/userModel");
require("dotenv").config();

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) return res.status(401).json({ message: "Invalid Username" });

        console.log("User Retrieved from DB:", user); // Debugging statement

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid Password" });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT Secret is not defined" });
        }

        const token = jwt.sign(
            { user_id: user.userid, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("User Role:", user.role); // Debugging statement

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await findUserById(req.user.user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ userid: user.userid, username: user.username, role: user.role });
    } catch (error) {
        console.error("Get User Details Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { loginUser, getUserDetails };

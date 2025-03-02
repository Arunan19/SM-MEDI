const express = require("express");
const { getAdminProfile, editUserDetails, changePassword } = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body); // Log request method, URL, and body
    next();
});

// Fixed route path
router.get("/admin/profile", authenticateToken, getAdminProfile);
router.put("/edit", authenticateToken, editUserDetails);
router.put("/change-password", authenticateToken, changePassword);

module.exports = router;

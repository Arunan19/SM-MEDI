const express = require("express");
const { getUserProfile, editUserDetails, changeUserPassword } = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/edit", authenticateToken, editUserDetails);
router.put("/change-password", authenticateToken, changeUserPassword);

module.exports = router;

const express = require("express");
const { loginUser, getUserDetails } = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/login", loginUser);
router.get("/user", authenticateToken, getUserDetails);

module.exports = router;

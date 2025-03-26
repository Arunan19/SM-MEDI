const express = require("express");
const { loginUser, getUserDetails, editUserDetails, changeUserPassword } = require("../controllers/authController");
const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.get("/user/:user_id", authenticateToken, getUserDetails);
router.put("/update", authenticateToken, editUserDetails);
router.put("/password", authenticateToken, changeUserPassword);

module.exports = router;

const express = require("express");
const router = express.Router();
const attendancecontroller = require("../controllers/attendancecontroller");


router.post("/attendance/auto", attendancecontroller.autoMarkAttendance); // Auto mark attendance for all users
router.post("/attendance/mark", attendancecontroller.markAttendance); // Mark attendance manually
router.get("/attendance", attendancecontroller.getAllAttendance); // Get all attendance records

module.exports = router;

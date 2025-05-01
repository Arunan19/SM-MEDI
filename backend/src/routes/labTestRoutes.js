const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController');

// Get all lab tests
router.get('/', labTestController.getAllLabTests);

// Add new lab test
router.post('/add', labTestController.addLabTest);

// Update lab test
router.put('/update/:test_id', labTestController.updateLabTest);

module.exports = router;

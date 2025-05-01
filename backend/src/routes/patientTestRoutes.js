const express = require('express');
const router = express.Router();
const patientTestController = require('../controllers/patientTestController');

// Get all patient test records
router.get('/', patientTestController.getAllPatientTests);

// Add a new patient test record
router.post('/add', patientTestController.addPatientTest);

// Update a patient test record
router.put('/update/:patient_tests_id', patientTestController.updatePatientTest);

module.exports = router;

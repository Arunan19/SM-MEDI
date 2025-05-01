const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientcontroller'); // Adjust path if needed

// Route to get all patients
router.get('/', patientController.getAllPatients);

// Route to add a new patient
router.post('/add', patientController.addPatient);

// Route to update a patient
router.put('/update/:patient_id', patientController.updatePatient);

module.exports = router;

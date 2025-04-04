const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController'); 

// Routes
router.get('/', equipmentController.getAllEquipment);
router.post('/', equipmentController.addEquipment);
router.put('/:id', equipmentController.updateEquipment);

module.exports = router;

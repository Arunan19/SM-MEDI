const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes
router.get('/inventory', inventoryController.getAllInventory);
router.post('/inventory', inventoryController.addInventoryItem);
router.put('/inventory/:id', inventoryController.updateInventoryItem);

module.exports = router;

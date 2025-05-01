const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getAllNotifications);
router.get('/user', notificationController.getUserNotifications);
router.post('/', notificationController.createNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

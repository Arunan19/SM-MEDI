const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import the controller
const authenticateToken = require('../middleware/authmiddleware'); // Import the middleware

router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/:username', authenticateToken, userController.getUserProfile);
router.put('/users/:username', authenticateToken, userController.updateUserProfile);
router.get('/users', authenticateToken, userController.getAllusers);
router.post('/change-password/before-login', userController.changePasswordBeforeLogin);
router.post('/change-password/after-login', userController.changePasswordAfterLogin);


module.exports = router;
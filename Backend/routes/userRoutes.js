const express = require('express');
const router = express.Router();
// Import your controller functions here once they are ready
const userController = require('../controllers/userController'); 
const { protect, admin } = require('../middleware/authmiddleware'); // For authorization

// Example Admin route to get all users, restricted to only admins
router.get('/', protect, admin, userController.getAllUsers);

// Example Admin route to update a user's role or status
router.put('/:id/status', protect, admin, userController.updateUserStatus);

module.exports = router;
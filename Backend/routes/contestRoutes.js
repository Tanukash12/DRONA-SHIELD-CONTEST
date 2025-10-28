const express = require('express');
const router = express.Router();
// You will create this controller next!
const contestController = require('../controllers/contestController'); 
const { protect, admin } = require('../middleware/authmiddleware'); 

// 1. Admin Routes (requires 'admin' role)
// Create a new contest (selecting questions)
router.post('/', protect, admin, contestController.createContest);

// Get all contests for admin view
router.get('/admin', protect, admin, contestController.getAllContestsAdmin);

// Update contest status (upcoming/live/finished)
router.put('/:id/status', protect, admin, contestController.updateContestStatus);

// 2. User Route (requires general login)
// Get live/approved contests assigned to the user
router.get('/user', protect, contestController.getAssignedContestsUser);

module.exports = router;
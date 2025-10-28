const Contest = require('../models/Contest.model');
const Question = require('../models/Question.model'); // Needs to be created next!

// @desc    Admin creates a new contest
// @route   POST /api/contests
// @access  Private/Admin
exports.createContest = async (req, res) => {
    const { name, questionIds } = req.body; // Expects a name and an array of question IDs
    
    // Simple validation
    if (!name || !questionIds || questionIds.length === 0) {
        return res.status(400).json({ message: 'Please provide a contest name and select at least one question.' });
    }

    try {
        // You could check if all questionIds are valid/exist here
        
        const contest = await Contest.create({
            name,
            question_ids: questionIds,
            status: 'upcoming' // Default status
        });
        
        res.status(201).json({ 
            message: 'Contest created successfully.', 
            contest 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create contest: ' + error.message });
    }
};

// @desc    Admin views all contests
// @route   GET /api/contests/admin
// @access  Private/Admin
exports.getAllContestsAdmin = async (req, res) => {
    try {
        const contests = await Contest.find().populate('assigned_users', 'name email');
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contests.' });
    }
};

// @desc    Update contest status (e.g., set to 'live')
// @route   PUT /api/contests/:id/status
// @access  Private/Admin
exports.updateContestStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const contest = await Contest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        
        res.json({ message: `Contest status updated to ${status}`, contest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contest status: ' + error.message });
    }
};

// @desc    User gets contests assigned to them
// @route   GET /api/contests/user
// @access  Private/User
exports.getAssignedContestsUser = async (req, res) => {
    // We assume the authenticated user's ID is stored in the session
    const userId = req.session.userId; 
    
    try {
        const contests = await Contest.find({
            // Find contests that are 'live' AND have the user's ID in assigned_users
            status: 'live',
            assigned_users: userId
        }).select('name status created_at'); // Only return essential info
        
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user contests.' });
    }
};
const User = require('../models/User.model'); // Import the User Model

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password'); // Fetch only regular users, hide password hash
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// @desc    Update a user's status or role (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
    const { status, role } = req.body;
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply updates if provided
        if (status) user.status = status;
        if (role) user.role = role;

        await user.save();
        res.json({ 
            message: 'User updated successfully', 
            user: { id: user._id, name: user.name, status: user.status, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update user status' });
    }
};

// You'll need to create similar controller files for contests and questions later.
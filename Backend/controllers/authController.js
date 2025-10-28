const User = require('../models/User');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        
        // No login on registration for this project's flow, just return success
        res.status(201).json({ 
            message: 'Registration successful. Account created.', 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            // Set session data
            req.session.userId = user._id;
            req.session.role = user.role;
            
            res.json({ 
                message: 'Login successful', 
                role: user.role, 
                redirectUrl: user.role === 'admin' ? '/admin-dashboard.html' : '/user-portal.html' 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: 'Logged out successfully' });
    });
};
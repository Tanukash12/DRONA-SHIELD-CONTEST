const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Password is automatically hashed by the User model's pre-save hook
        const user = await User.create({ name, email, password, role: 'user' }); 
        
        // Respond with success and user info (but NO token/password)
        res.status(201).json({ 
            message: 'Registration successful. Account created.', 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            
            // ✅ SUCCESS: Generate the JWT upon successful login
            const token = generateToken(user._id, user.role);

            res.json({ 
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                // Send the token to the client
                token: token, 
                // Suggest redirect URL to frontend
                redirectUrl: user.role === 'admin' ? '/admin-dashboard.html' : '/user-portal.html' 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout (JWT is handled on the client side by deleting the token)
// @route   GET /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
    // With JWT, the server does nothing; the client deletes the token from local storage.
    res.json({ message: 'Logged out successfully (Client should delete stored token).' });
};
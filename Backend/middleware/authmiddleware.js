const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// @desc    Checks for a valid JWT in the Authorization header
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (e.g., 'Bearer token123' -> 'token123')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token and decode the payload (id, role)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Fetch the user associated with the token payload
            // We store the user info (excluding password) directly on the request object
            req.user = await User.findById(decoded.id).select('-password');
            
            // Check if the user exists and is active (optional, good for security)
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Token is valid, proceed to the route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Checks if the authenticated user has the 'admin' role
exports.admin = (req, res, next) => {
    // req.user is populated by the protect middleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
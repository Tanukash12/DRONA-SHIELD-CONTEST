// A simple check for session-based authentication
exports.protect = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated
        next(); 
    } else {
        res.status(401).json({ message: 'Not authorized, no session found' });
    }
};

// Check for Admin Role
exports.admin = (req, res, next) => {
    // In a real app, you'd fetch the user from DB using req.session.userId
    // For this example, we assume the user object is stored in the session on login
    if (req.session && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
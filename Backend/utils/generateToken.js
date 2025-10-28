const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role }, // Payload: Data stored in the token
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE, // e.g., '30d'
        }
    );
};

module.exports = generateToken;
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contestRoutes = require('./routes/contestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGO_URI; 

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));
// --------------------------

// Middlewares
app.use(express.json()); // To parse JSON request bodies
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'super-secret-key', // Move to .env for production!
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
// }));

// CORS setup (Essential for separate frontend/backend)
app.use((req, res, next) => {
    // Allows any origin (you might restrict this in production)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // MUST include Authorization
    // res.setHeader('Access-Control-Allow-Credentials', 'true'); // ❌ REMOVE for simple token auth
    next();
});

// Routes (APIs)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contests', contestRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
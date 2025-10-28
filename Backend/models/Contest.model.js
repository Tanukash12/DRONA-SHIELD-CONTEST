const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
    // References a sub-set of Questions from the Question collection
    question_ids: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }],
    // Users who are explicitly assigned to this contest
    assigned_users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contest', ContestSchema);
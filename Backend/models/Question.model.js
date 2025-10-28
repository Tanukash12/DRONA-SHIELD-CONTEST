const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    module: { 
        type: String, 
        enum: ['Python', 'Cybersecurity'], 
        required: true 
    },
    questionText: { 
        type: String, 
        required: true 
    },
    options: [{
        type: String,
        required: true
    }],
    correctOptionIndex: { // Stores the index (0, 1, 2, 3) of the correct answer in the options array
        type: Number,
        required: true 
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
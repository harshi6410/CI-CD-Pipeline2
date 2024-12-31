// A model for handling deployment logs or status (optional for demonstration)
const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deployment', deploymentSchema);

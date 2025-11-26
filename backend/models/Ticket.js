const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a ticket title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Ticket', ticketSchema);

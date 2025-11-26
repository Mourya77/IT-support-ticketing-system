const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public (or Private depending on requirements, assuming Public for now as per prompt simplicity, but usually protected)
const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('assignedTo', 'name email');
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
const createTicket = async (req, res) => {
    const { title, description, priority, assignedTo } = req.body;

    if (!title || !description || !priority) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const ticket = await Ticket.create({
            title,
            description,
            priority,
            assignedTo,
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Public
const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTickets,
    createTicket,
    updateTicket,
};

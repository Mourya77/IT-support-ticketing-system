const express = require('express');
const router = express.Router();
const {
    getTickets,
    createTicket,
    updateTicket,
} = require('../controllers/ticketController');

router.route('/').get(getTickets).post(createTicket);
router.route('/:id').put(updateTicket);

module.exports = router;

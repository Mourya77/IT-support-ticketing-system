const express = require('express');
const router = express.Router();
// Update import to include getUsers
const { registerUser, loginUser, getUsers } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers); // <--- NEW ROUTE

module.exports = router;
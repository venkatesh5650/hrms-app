const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.get('/profile', auth, getProfile);

module.exports = router;

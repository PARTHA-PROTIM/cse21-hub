const express = require('express');
const router = express.Router();
const { registerRequest, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register-request', registerRequest);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
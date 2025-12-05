const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  deleteMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMessages);
router.post('/', protect, createMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
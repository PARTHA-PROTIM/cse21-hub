const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, checkRole('cr'), getAllUsers);
router.delete('/:id', protect, checkRole('cr'), deleteUser);
router.put('/:id/role', protect, checkRole('cr'), updateUserRole);

module.exports = router;
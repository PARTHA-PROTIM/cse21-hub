const express = require('express');
const router = express.Router();
const {
  getPendingRequests,
  approveRequest,
  rejectRequest,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, checkRole('cr'), getPendingRequests);
router.put('/:id/approve', protect, checkRole('cr'), approveRequest);
router.put('/:id/reject', protect, checkRole('cr'), rejectRequest);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/busController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, getAllSchedules);
router.post('/', protect, checkRole('cr'), createSchedule);
router.put('/:id', protect, checkRole('cr'), updateSchedule);
router.delete('/:id', protect, checkRole('cr'), deleteSchedule);

module.exports = router;
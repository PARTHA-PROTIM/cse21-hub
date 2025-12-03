const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getStudentMarks,
  addOrUpdateMarks,
} = require('../controllers/markController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/leaderboard/:courseId', protect, getLeaderboard);
router.get('/my-marks', protect, getStudentMarks);
router.post('/', protect, checkRole('cr'), addOrUpdateMarks);

module.exports = router;
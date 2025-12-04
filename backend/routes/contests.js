const express = require('express');
const router = express.Router();
const {
  getAllContests,
  createContest,
  updateContest,
  deleteContest,
} = require('../controllers/contestController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, getAllContests);
router.post('/', protect, checkRole('cr'), createContest);
router.put('/:id', protect, checkRole('cr'), updateContest);
router.delete('/:id', protect, checkRole('cr'), deleteContest);

module.exports = router;
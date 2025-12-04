const express = require('express');
const router = express.Router();
const {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, getAllNews);
router.post('/', protect, checkRole('cr'), createNews);
router.put('/:id', protect, checkRole('cr'), updateNews);
router.delete('/:id', protect, checkRole('cr'), deleteNews);

module.exports = router;
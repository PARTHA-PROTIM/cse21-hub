const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, checkRole('cr'), createCourse);
router.put('/:id', protect, checkRole('cr'), updateCourse);
router.delete('/:id', protect, checkRole('cr'), deleteCourse);

module.exports = router;
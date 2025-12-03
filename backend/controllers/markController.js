const Mark = require('../models/Mark');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const marks = await Mark.find({ course: courseId })
      .populate('student', 'name regNo')
      .sort({ totalMarks: -1 });
    
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.user._id })
      .populate('course', 'courseCode courseName');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addOrUpdateMarks = async (req, res) => {
  try {
    const { studentRegNo, courseId, marks } = req.body;

    console.log('Received marks update request:', { studentRegNo, courseId, marks });

    // Find student by registration number
    const student = await User.findOne({ 
      regNo: studentRegNo,
      isApproved: true 
    });
    
    if (!student) {
      return res.status(404).json({ 
        message: `Student not found with registration number: ${studentRegNo}. Make sure the student is registered and approved.` 
      });
    }

    console.log('Found student:', student.name, student._id);

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Found course:', course.courseName);

    // Calculate total marks
    const totalMarks = Object.values(marks).reduce((a, b) => a + b, 0);

    console.log('Total marks:', totalMarks);

    // Update or create marks
    const mark = await Mark.findOneAndUpdate(
      { student: student._id, course: courseId },
      { marks, totalMarks },
      { new: true, upsert: true }
    ).populate('student', 'name regNo').populate('course', 'courseCode courseName');

    console.log('Marks saved successfully');

    res.json(mark);
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ message: error.message });
  }
};
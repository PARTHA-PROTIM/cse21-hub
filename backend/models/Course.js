const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  markDistribution: {
    test1: { type: Number, default: 0 },
    test2: { type: Number, default: 0 },
    quiz: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    final: { type: Number, default: 0 },
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  marks: {
    test1: { type: Number, default: 0 },
    test2: { type: Number, default: 0 },
    quiz: { type: Number, default: 0 },
    assignment: { type: Number, default: 0 },
    final: { type: Number, default: 0 },
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

markSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
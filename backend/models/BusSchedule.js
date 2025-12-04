const mongoose = require('mongoose');

const busScheduleSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  stops: [String],
  days: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BusSchedule', busScheduleSchema);
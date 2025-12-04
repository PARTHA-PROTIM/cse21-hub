const BusSchedule = require('../models/BusSchedule');

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await BusSchedule.find({ isActive: true })
      .sort({ departureTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await BusSchedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await BusSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await BusSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
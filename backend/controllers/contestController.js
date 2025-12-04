const Contest = require('../models/Contest');

exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find({ isActive: true })
      .sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContest = async (req, res) => {
  try {
    const contest = await Contest.create(req.body);
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    await Contest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contest deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
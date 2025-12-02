const User = require('../models/User');
const RegistrationRequest = require('../models/RegistrationRequest');

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await RegistrationRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await RegistrationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Create user WITHOUT re-hashing the password (it's already hashed)
    const user = new User({
      name: request.name,
      email: request.email,
      regNo: request.regNo,
      password: request.password, // Already hashed in registration
      role: 'student',
      isApproved: true,
      department: request.department,
      batch: request.batch
    });

    // Save without triggering pre-save hook for password
    await user.save({ validateBeforeSave: false });

    // Update request status
    request.status = 'approved';
    await request.save();

    res.json({ 
      message: 'User approved and created successfully', 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo
      }
    });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await RegistrationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Registration request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
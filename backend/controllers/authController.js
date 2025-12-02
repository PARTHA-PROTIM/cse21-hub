const User = require('../models/User');
const RegistrationRequest = require('../models/RegistrationRequest');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

exports.registerRequest = async (req, res) => {
  try {
    const { name, email, regNo, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { regNo }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const requestExists = await RegistrationRequest.findOne({ 
      $or: [{ email }, { regNo }] 
    });
    if (requestExists) {
      return res.status(400).json({ message: 'Registration request already submitted' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const registrationRequest = await RegistrationRequest.create({
      name,
      email,
      regNo,
      password: hashedPassword,
      requestedRole: 'student',
    });

    res.status(201).json({
      message: 'Registration request submitted. Waiting for CR approval.',
      request: {
        id: registrationRequest._id,
        name: registrationRequest.name,
        email: registrationRequest.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Account not approved yet' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
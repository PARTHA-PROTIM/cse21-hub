const mongoose = require('mongoose');
module.exports = mongoose.model('RegistrationRequest', new mongoose.Schema({
  name: String,
  regNo: String,
  email: String,
  password: String,
  role: { type: String, default: 'student' },
  status: { type: String, default: 'pending' }
}));

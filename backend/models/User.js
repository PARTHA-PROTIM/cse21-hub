const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['cr', 'student'],
    default: 'student',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  department: {
    type: String,
    default: 'CSE',
  },
  batch: {
    type: String,
    default: '21',
  },
}, {
  timestamps: true,
});

// Don't hash password if it's already hashed
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
  
//   // Check if password is already hashed (starts with $2a$ or $2b$)
//   if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
//     return next();
//   }
  
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // Check if already hashed
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password comparison:', {
      enteredPassword: enteredPassword,
      storedHash: this.password.substring(0, 20) + '...',
      isMatch: isMatch
    });
    return isMatch;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
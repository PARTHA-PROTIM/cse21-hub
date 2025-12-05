const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  regNo: String,
  password: String,
  role: String,
  isApproved: Boolean,
  department: String,
  batch: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createCR() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing CR
    await User.deleteMany({email: "cr@cse21.sust.edu"});
    console.log('🗑️  Deleted old CR accounts');
    
    // Create password hash
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔐 Password to use: admin123');
    console.log('🔑 Hashed password:', hashedPassword.substring(0, 30) + '...');
    
    // Verify the hash works
    const testMatch = await bcrypt.compare('admin123', hashedPassword);
    console.log('✅ Hash verification:', testMatch ? 'SUCCESS' : 'FAILED');
    
    if (!testMatch) {
      console.error('❌ ERROR: Hash verification failed!');
      process.exit(1);
    }
    
    // Create CR user
    const crUser = new User({
      name: 'CR Admin',
      email: 'cr@cse21.sust.edu',
      regNo: '2021331000',
      password: hashedPassword,
      role: 'cr',
      isApproved: true,
      department: 'CSE',
      batch: '21'
    });
    
    await crUser.save();
    
    console.log('✅ CR account created successfully!');
    console.log('📧 Email: cr@cse21.sust.edu');
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', crUser.role);
    console.log('✓ Approved:', crUser.isApproved);
    
    // Verify in database
    const savedUser = await User.findOne({email: 'cr@cse21.sust.edu'});
    const passwordWorks = await bcrypt.compare('admin123', savedUser.password);
    
    console.log('\n🔍 Verification:');
    console.log('  - User found in DB:', !!savedUser);
    console.log('  - Role is CR:', savedUser.role === 'cr');
    console.log('  - Password matches:', passwordWorks);
    
    if (!passwordWorks) {
      console.error('❌ ERROR: Password does not match after saving!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createCR();
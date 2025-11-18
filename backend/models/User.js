// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { // patient or healthcare_provider
    type: String,
    required: true,
    enum: ['patient', 'healthcare_provider'],
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    allergies: [String],
    currentMedications: [String],
    // Add more fields as needed based on requirements
  },
  assignedPatients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Only applicable for healthcare_provider
  }],
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
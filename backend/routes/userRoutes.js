// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    username,
    email,
    password,
    role, // Make sure to handle this on the frontend for patient/provider choice
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  res.json(req.user); // req.user is set by the protect middleware
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  const user = req.user; // User from protect middleware

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash it
    }
    user.profile.firstName = req.body.firstName || user.profile.firstName;
    user.profile.lastName = req.body.lastName || user.profile.lastName;
    user.profile.dateOfBirth = req.body.dateOfBirth || user.profile.dateOfBirth;
    user.profile.allergies = req.body.allergies || user.profile.allergies;
    user.profile.currentMedications = req.body.currentMedications || user.profile.currentMedications;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile,
      token: generateToken(updatedUser._id), // Optionally generate new token
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get all patients (for providers)
// @route   GET /api/users/patients
// @access  Private/HealthcareProvider
router.get('/patients', protect, authorizeRoles('healthcare_provider'), async (req, res) => {
  const patients = await User.find({ role: 'patient' }).select('-password');
  res.json(patients);
});

router.get('/profile/:id', protect, authorizeRoles('healthcare_provider'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});




module.exports = router;
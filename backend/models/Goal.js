// backend/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: { // e.g., 'steps', 'water_intake', 'sleep'
    type: String,
    required: true,
  },
  target: {
    type: Number, // e.g., 6000 steps, 8 glasses, 7 hours
    required: true,
  },
  unit: { // e.g., 'steps', 'glasses', 'hours'
    type: String,
    required: true,
  },
  progress: [{
    date: { type: Date, default: Date.now },
    value: { type: Number, required: true },
  }],
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  isAchieved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
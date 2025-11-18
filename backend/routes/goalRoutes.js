// // // backend/routes/goalRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const Goal = require('../models/Goal');
// // const { protect } = require('../middleware/authMiddleware');

// // // @desc    Get all goals for a user
// // // @route   GET /api/goals
// // // @access  Private
// // router.get('/', protect, async (req, res) => {
// //   const goals = await Goal.find({ user: req.user._id });
// //   res.json(goals);
// // });

// // // @desc    Create a new goal
// // // @route   POST /api/goals
// // // @access  Private
// // router.post('/', protect, async (req, res) => {
// //   const { type, target, unit, startDate, endDate } = req.body;

// //   const goal = new Goal({
// //     user: req.user._id,
// //     type,
// //     target,
// //     unit,
// //     startDate,
// //     endDate,
// //   });

// //   const createdGoal = await goal.save();
// //   res.status(201).json(createdGoal);
// // });

// // // @desc    Log progress for a goal
// // // @route   PUT /api/goals/:id/progress
// // // @access  Private
// // router.put('/:id/progress', protect, async (req, res) => {
// //   const { value, date } = req.body;
// //   const goal = await Goal.findById(req.params.id);

// //   if (goal && goal.user.toString() === req.user._id.toString()) {
// //     goal.progress.push({ value, date: date || new Date() });
// //     // Check if goal is achieved based on the latest progress and target
// //     if (goal.type === 'steps' && value >= goal.target) { // Simple check, adjust logic for other goal types
// //       goal.isAchieved = true;
// //     } else if (goal.type === 'water_intake' && value >= goal.target) {
// //         goal.isAchieved = true;
// //     } // Add more logic for different goal types

// //     const updatedGoal = await goal.save();
// //     res.json(updatedGoal);
// //   } else {
// //     res.status(404).json({ message: 'Goal not found or user not authorized' });
// //   }
// // });

// // // @desc    Get a single goal by ID
// // // @route   GET /api/goals/:id
// // // @access  Private
// // router.get('/:id', protect, async (req, res) => {
// //   const goal = await Goal.findById(req.params.id);

// //   if (goal && goal.user.toString() === req.user._id.toString()) {
// //     res.json(goal);
// //   } else {
// //     res.status(404).json({ message: 'Goal not found or user not authorized' });
// //   }
// // });

// // module.exports = router;
// // backend/routes/goalRoutes.js
// const express = require('express');
// const router = express.Router();
// const Goal = require('../models/Goal');
// const { protect } = require('../middleware/authMiddleware');

// // @desc    Get all goals for a user
// // @route   GET /api/goals
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const goals = await Goal.find({ user: req.user._id });
//     res.json(goals);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching goals', error: error.message });
//   }
// });

// // @desc    Create a new goal
// // @route   POST /api/goals
// // @access  Private
// router.post('/', protect, async (req, res) => {
//   const { type, target, unit, startDate, endDate } = req.body;

//   if (!type || !target || !unit) {
//     return res.status(400).json({ message: 'Please provide type, target, and unit for the goal.' });
//   }

//   try {
//     const goal = new Goal({
//       user: req.user._id,
//       type,
//       target,
//       unit,
//       startDate: startDate || new Date(), // Default to today if not provided
//       endDate,
//     });

//     const createdGoal = await goal.save();
//     res.status(201).json(createdGoal);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating goal', error: error.message });
//   }
// });

// // @desc    Log progress for a goal
// // @route   PUT /api/goals/:id/progress
// // @access  Private
// router.put('/:id/progress', protect, async (req, res) => {
//   const { value, date } = req.body; // value is the amount, date is optional
  
//   if (value === undefined || value === null) {
//       return res.status(400).json({ message: 'Progress value is required.' });
//   }

//   try {
//     const goal = await Goal.findById(req.params.id);

//     if (goal && goal.user.toString() === req.user._id.toString()) {
//       // Add new progress entry
//       goal.progress.push({ value, date: date || new Date() });

//       // Check if goal is achieved (simple logic for MVP)
//       // This logic can be more complex, e.g., sum up all progress for total goals
//       // For now, let's assume `value` is the current state for goal types like steps/water
//       // For types like 'sleep', value would be hours slept, and target hours to sleep.
//       if (goal.type === 'steps' || goal.type === 'water_intake' || goal.type === 'sleep') {
//         const latestProgressValue = goal.progress[goal.progress.length - 1].value;
//         if (latestProgressValue >= goal.target) {
//           goal.isAchieved = true;
//         } else {
//           goal.isAchieved = false; // Reset if progress drops below target after an update
//         }
//       } else {
//         // More complex achievement logic for other goal types
//         goal.isAchieved = false; // Default to false
//       }

//       const updatedGoal = await goal.save();
//       res.json(updatedGoal);
//     } else {
//       res.status(404).json({ message: 'Goal not found or user not authorized' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging goal progress', error: error.message });
//   }
// });

// // @desc    Get a single goal by ID
// // @route   GET /api/goals/:id
// // @access  Private
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const goal = await Goal.findById(req.params.id);

//     if (goal && goal.user.toString() === req.user._id.toString()) {
//       res.json(goal);
//     } else {
//       res.status(404).json({ message: 'Goal not found or user not authorized' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching goal', error: error.message });
//   }
// });

// // @desc    Delete a goal
// // @route   DELETE /api/goals/:id
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const goal = await Goal.findById(req.params.id);

//     if (goal && goal.user.toString() === req.user._id.toString()) {
//       await Goal.deleteOne({ _id: req.params.id }); // Use deleteOne
//       res.json({ message: 'Goal removed' });
//     } else {
//       res.status(404).json({ message: 'Goal not found or user not authorized' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting goal', error: error.message });
//   }
// });

// module.exports = router;
// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import authorizeRoles

// @desc    Get all goals for the logged-in user (patient)
// @route   GET /api/goals
// @access  Private (Patient only)
router.get('/', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
});

// @desc    Create a new goal for the logged-in user (patient)
// @route   POST /api/goals
// @access  Private (Patient only)
router.post('/', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  const { type, target, unit, startDate, endDate } = req.body;

  if (!type || !target || !unit) {
    return res.status(400).json({ message: 'Please provide type, target, and unit for the goal.' });
  }

  try {
    const goal = new Goal({
      user: req.user._id,
      type,
      target,
      unit,
      startDate: startDate || new Date(),
      endDate,
    });

    const createdGoal = await goal.save();
    res.status(201).json(createdGoal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error: error.message });
  }
});

// @desc    Log progress for a goal of the logged-in user (patient)
// @route   PUT /api/goals/:id/progress
// @access  Private (Patient only)
router.put('/:id/progress', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  const { value, date } = req.body;

  if (value === undefined || value === null) {
      return res.status(400).json({ message: 'Progress value is required.' });
  }

  try {
    const goal = await Goal.findById(req.params.id);

    if (goal && goal.user.toString() === req.user._id.toString()) {
      goal.progress.push({ value, date: date || new Date() });

      if (goal.type === 'steps' || goal.type === 'water_intake' || goal.type === 'sleep') {
        const latestProgressValue = goal.progress[goal.progress.length - 1].value;
        goal.isAchieved = (latestProgressValue >= goal.target);
      } else {
        goal.isAchieved = false;
      }

      const updatedGoal = await goal.save();
      res.json(updatedGoal);
    } else {
      res.status(404).json({ message: 'Goal not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging goal progress', error: error.message });
  }
});

// @desc    Get a single goal by ID for the logged-in user (patient)
// @route   GET /api/goals/:id
// @access  Private (Patient only)
router.get('/:id', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal && goal.user.toString() === req.user._id.toString()) {
      res.json(goal);
    } else {
      res.status(404).json({ message: 'Goal not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error: error.message });
  }
});

// @desc    Delete a goal for the logged-in user (patient)
// @route   DELETE /api/goals/:id
// @access  Private (Patient only)
router.delete('/:id', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  try {
    const goal = await Goal.findById(req.params.id);

    if (goal && goal.user.toString() === req.user._id.toString()) {
      await Goal.deleteOne({ _id: req.params.id });
      res.json({ message: 'Goal removed' });
    } else {
      res.status(404).json({ message: 'Goal not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
});

// NEW ROUTE: @desc    Get all goals for a specific patient (for providers)
// @route   GET /api/goals/patient/:patientId
// @access  Private (HealthcareProvider only)
router.get('/patient/:patientId', protect, authorizeRoles('healthcare_provider'), async (req, res) => {
  try {
    const patientGoals = await Goal.find({ user: req.params.patientId });
    res.json(patientGoals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient goals', error: error.message });
  }
});

module.exports = router;
// // // backend/routes/reminderRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const Reminder = require('../models/Reminder');
// // const { protect } = require('../middleware/authMiddleware');

// // // @desc    Get all reminders for a user
// // // @route   GET /api/reminders
// // // @access  Private
// // router.get('/', protect, async (req, res) => {
// //   const reminders = await Reminder.find({ user: req.user._id }).sort({ dueDate: 1 });
// //   res.json(reminders);
// // });

// // // @desc    Create a new reminder
// // // @route   POST /api/reminders
// // // @access  Private
// // router.post('/', protect, async (req, res) => {
// //   const { message, type, dueDate } = req.body;

// //   const reminder = new Reminder({
// //     user: req.user._id,
// //     message,
// //     type,
// //     dueDate,
// //   });

// //   const createdReminder = await reminder.save();
// //   res.status(201).json(createdReminder);
// // });

// // // @desc    Update reminder status (e.g., mark as completed)
// // // @route   PUT /api/reminders/:id
// // // @access  Private
// // router.put('/:id', protect, async (req, res) => {
// //   const { isCompleted } = req.body;
// //   const reminder = await Reminder.findById(req.params.id);

// //   if (reminder && reminder.user.toString() === req.user._id.toString()) {
// //     reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

// //     const updatedReminder = await reminder.save();
// //     res.json(updatedReminder);
// //   } else {
// //     res.status(404).json({ message: 'Reminder not found or user not authorized' });
// //   }
// // });

// // module.exports = router;
// // backend/routes/reminderRoutes.js
// const express = require('express');
// const router = express.Router();
// const Reminder = require('../models/Reminder');
// const { protect } = require('../middleware/authMiddleware');

// // @desc    Get all reminders for a user
// // @route   GET /api/reminders
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const reminders = await Reminder.find({ user: req.user._id }).sort({ dueDate: 1 });
//     res.json(reminders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching reminders', error: error.message });
//   }
// });

// // @desc    Create a new reminder
// // @route   POST /api/reminders
// // @access  Private
// router.post('/', protect, async (req, res) => {
//   const { message, type, dueDate } = req.body;

//   if (!message || !type || !dueDate) {
//     return res.status(400).json({ message: 'Please provide message, type, and due date for the reminder.' });
//   }

//   try {
//     const reminder = new Reminder({
//       user: req.user._id,
//       message,
//       type,
//       dueDate,
//     });

//     const createdReminder = await reminder.save();
//     res.status(201).json(createdReminder);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating reminder', error: error.message });
//   }
// });

// // @desc    Update reminder status (e.g., mark as completed)
// // @route   PUT /api/reminders/:id
// // @access  Private
// router.put('/:id', protect, async (req, res) => {
//   const { isCompleted } = req.body;
  
//   try {
//     const reminder = await Reminder.findById(req.params.id);

//     if (reminder && reminder.user.toString() === req.user._id.toString()) {
//       reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

//       const updatedReminder = await reminder.save();
//       res.json(updatedReminder);
//     } else {
//       res.status(404).json({ message: 'Reminder not found or user not authorized' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating reminder', error: error.message });
//   }
// });

// // @desc    Delete a reminder
// // @route   DELETE /api/reminders/:id
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const reminder = await Reminder.findById(req.params.id);

//     if (reminder && reminder.user.toString() === req.user._id.toString()) {
//       await Reminder.deleteOne({ _id: req.params.id });
//       res.json({ message: 'Reminder removed' });
//     } else {
//       res.status(404).json({ message: 'Reminder not found or user not authorized' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting reminder', error: error.message });
//   }
// });

// module.exports = router;

// backend/routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import authorizeRoles

// @desc    Get all reminders for the logged-in user (patient)
// @route   GET /api/reminders
// @access  Private (Patient only)
router.get('/', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
});

// @desc    Create a new reminder for the logged-in user (patient)
// @route   POST /api/reminders
// @access  Private (Patient only)
router.post('/', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  const { message, type, dueDate } = req.body;

  if (!message || !type || !dueDate) {
    return res.status(400).json({ message: 'Please provide message, type, and due date for the reminder.' });
  }

  try {
    const reminder = new Reminder({
      user: req.user._id,
      message,
      type,
      dueDate,
    });

    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reminder', error: error.message });
  }
});

// @desc    Update reminder status (e.g., mark as completed) for the logged-in user (patient)
// @route   PUT /api/reminders/:id
// @access  Private (Patient only)
router.put('/:id', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  const { isCompleted } = req.body;

  try {
    const reminder = await Reminder.findById(req.params.id);

    if (reminder && reminder.user.toString() === req.user._id.toString()) {
      reminder.isCompleted = isCompleted !== undefined ? isCompleted : reminder.isCompleted;

      const updatedReminder = await reminder.save();
      res.json(updatedReminder);
    } else {
      res.status(404).json({ message: 'Reminder not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating reminder', error: error.message });
  }
});

// @desc    Delete a reminder for the logged-in user (patient)
// @route   DELETE /api/reminders/:id
// @access  Private (Patient only)
router.delete('/:id', protect, authorizeRoles('patient'), async (req, res) => { // Added authorizeRoles
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (reminder && reminder.user.toString() === req.user._id.toString()) {
      await Reminder.deleteOne({ _id: req.params.id });
      res.json({ message: 'Reminder removed' });
    } else {
      res.status(404).json({ message: 'Reminder not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder', error: error.message });
  }
});

// NEW ROUTE: @desc    Get all reminders for a specific patient (for providers)
// @route   GET /api/reminders/patient/:patientId
// @access  Private (HealthcareProvider only)
router.get('/patient/:patientId', protect, authorizeRoles('healthcare_provider'), async (req, res) => {
  try {
    const patientReminders = await Reminder.find({ user: req.params.patientId }).sort({ dueDate: 1 });
    res.json(patientReminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient reminders', error: error.message });
  }
});

module.exports = router;
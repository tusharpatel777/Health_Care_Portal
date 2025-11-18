// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is required here

const userRoutes = require('./routes/userRoutes');
// const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
// const goalRoutes = require('./routes/goalRoutes'); // Will create these later
// const reminderRoutes = require('./routes/reminderRoutes'); // Will create these later


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: ['https://health-care-portal-beryl.vercel.app/','http://localhost:5173'],
  credentials: true
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Healthcare Portal API is running!');
});

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/reminders', reminderRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).send({ message: 'Something broke!', error: err.message });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
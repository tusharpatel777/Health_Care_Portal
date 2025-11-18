import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { PlusCircleIcon, CheckCircleIcon, BoltIcon, BeakerIcon, MoonIcon, BellAlertIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

const pageContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 10,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const getGoalIcon = (type) => {
  switch (type) {
    case 'steps': return <BoltIcon className="h-6 w-6 text-blue-500 dark:text-blue-300" />;
    case 'water_intake': return <BeakerIcon className="h-6 w-6 text-teal-500 dark:text-teal-300" />;
    case 'sleep': return <MoonIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />;
    default: return <CheckCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />;
  }
};

const getGoalColorClass = (type) => {
  switch (type) {
    case 'steps': return 'border-l-4 border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20';
    case 'water_intake': return 'border-l-4 border-teal-400 bg-teal-50 dark:border-teal-700 dark:bg-teal-900/20';
    case 'sleep': return 'border-l-4 border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20';
    default: return 'border-l-4 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
  }
};


const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalType, setNewGoalType] = useState('steps');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('steps');

  const [progressInputValues, setProgressInputValues] = useState({});

  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminderMessage, setNewReminderMessage] = useState('');
  const [newReminderType, setNewReminderType] = useState('blood_test');
  const [newReminderDueDate, setNewReminderDueDate] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const storedUserInfo = getUserInfo();
      if (storedUserInfo) {
        setUserInfo(storedUserInfo);

        const config = {
          headers: {
            Authorization: `Bearer ${storedUserInfo.token}`,
          },
        };

        const { data: goalsData } = await axios.get('http://localhost:5000/api/goals', config);
        setGoals(goalsData);
        const initialProgressInputs = {};
        goalsData.forEach(goal => {
            if (goal.progress && goal.progress.length > 0) {
                initialProgressInputs[goal._id] = goal.progress[goal.progress.length - 1].value;
            } else {
                initialProgressInputs[goal._id] = '';
            }
        });
        setProgressInputValues(initialProgressInputs);


        const { data: remindersData } = await axios.get('http://localhost:5000/api/reminders', config);
        setReminders(remindersData);
      } else {
        setError('User not logged in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getDailyHealthTip = () => {
    const tips = [
      "Stay hydrated! Aim to drink at least 8 glasses of water per day.",
      "Go for a 30-minute walk today to boost your mood and energy.",
      "Prioritize sleep. Aim for 7-9 hours of quality sleep each night.",
      "Eat a colorful variety of fruits and vegetables.",
      "Take a few minutes to meditate or practice deep breathing for stress reduction."
    ];
    const today = new Date().getDay();
    return tips[today % tips.length];
  };

  const calculateProgress = (goal) => {
    if (!goal.progress || goal.progress.length === 0) return 0;
    const latestProgress = goal.progress[goal.progress.length - 1].value;
    return Math.min(100, (latestProgress / goal.target) * 100);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('http://localhost:5000/api/goals',
        { type: newGoalType, target: newGoalTarget, unit: newGoalUnit }, config);
      setMessage('Goal added successfully!');
      setShowAddGoalModal(false);
      setNewGoalTarget('');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add goal');
    }
  };

  const handleLogProgressDirect = async (goalId) => {
    const value = progressInputValues[goalId];
    if (value === '' || isNaN(value) || Number(value) < 0) {
        setError('Please enter a valid positive number for progress.');
        return;
    }
    setError('');
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/goals/${goalId}/progress`,
        { value: Number(value), date: new Date() }, config);
      setMessage('Progress logged successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log progress');
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('http://localhost:5000/api/reminders',
        { message: newReminderMessage, type: newReminderType, dueDate: newReminderDueDate }, config);
      setMessage('Reminder added successfully!');
      setShowAddReminderModal(false);
      setNewReminderMessage('');
      setNewReminderDueDate('');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add reminder');
    }
  };

  const handleMarkReminderComplete = async (reminderId) => {
    setError('');
    setMessage('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/reminders/${reminderId}`, { isCompleted: true }, config);
      setMessage('Reminder marked as complete!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark reminder complete');
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      <p className="ml-4 text-xl text-blue-600 dark:text-blue-400">Loading dashboard...</p>
    </div>
  );
  if (error) return <div className="text-center p-8 text-red-600 dark:text-red-400 font-semibold text-lg">{error}</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainerVariants}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl max-w-5xl mx-auto border border-gray-300 dark:border-gray-700 transition-colors duration-500 ease-in-out"
    >
      <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-8 text-center drop-shadow-sm">Welcome, {userInfo?.username || 'Patient'}!</h1>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-lg mb-6 text-center border border-green-200 dark:border-green-800 shadow-md"
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-lg mb-6 text-center border border-red-200 dark:border-red-800 shadow-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Wellness Goals Section */}
      <motion.section
        variants={sectionVariants}
        className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-blue-500 dark:border-blue-700 transition-colors duration-500 ease-in-out"
      >
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Wellness Goals</h2>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddGoalModal(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-lg"
          >
            <PlusCircleIcon className="h-6 w-6" /> Add Goal
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.length === 0 ? (
              <motion.p variants={itemVariants} className="col-span-full text-gray-600 dark:text-gray-400 text-center py-8 text-lg">No wellness goals set yet. Click "Add Goal" to create one!</motion.p>
            ) : (
              goals.map((goal) => (
                <motion.div
                  key={goal._id}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                  className={`p-5 rounded-lg shadow-md flex flex-col justify-between transition-all duration-200 ease-in-out ${getGoalColorClass(goal.type)}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {getGoalIcon(goal.type)}
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {goal.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Target: <span className="font-medium">{goal.target} {goal.unit}</span></p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-1 relative">
                    <motion.div
                      className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full flex items-center justify-end pr-2 font-bold text-white text-xs"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateProgress(goal)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      {calculateProgress(goal) > 10 && `${Math.round(calculateProgress(goal))}%`}
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {goal.progress.length > 0 ? `Latest: ${goal.progress[goal.progress.length - 1].value} ${goal.unit} (${Math.round(calculateProgress(goal))}%)` : 'No progress logged yet.'}
                  </p>
                  {goal.isAchieved && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                      className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center mt-3 gap-1"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" /> Goal Achieved!
                    </motion.span>
                  )}
                  <div className="mt-5 flex items-center gap-2">
                    <input
                      type="number"
                      className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder={`Log ${goal.unit}`}
                      value={progressInputValues[goal._id] || ''}
                      onChange={(e) => setProgressInputValues({ ...progressInputValues, [goal._id]: e.target.value })}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: '#8b5cf6' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLogProgressDirect(goal._id)}
                      className="bg-purple-500 dark:bg-purple-600 text-white text-sm px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0 font-semibold"
                    >
                      Log
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Preventive Care Reminders Section */}
      <motion.section
        variants={sectionVariants}
        className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-yellow-500 dark:border-yellow-700 transition-colors duration-500 ease-in-out"
      >
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Preventive Care Reminders</h2>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddReminderModal(true)}
            className="bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-lg"
          >
            <PlusCircleIcon className="h-6 w-6" /> Add Reminder
          </motion.button>
        </div>
        <div className="space-y-4">
          <AnimatePresence mode='wait'>
            {reminders.filter(reminder => !reminder.isCompleted && moment(reminder.dueDate).isSameOrAfter(moment(), 'day')).length === 0 ? (
              <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-center py-8 text-lg">No upcoming reminders. Click "Add Reminder" to create one!</motion.p>
            ) : (
              reminders
                .filter(reminder => !reminder.isCompleted && moment(reminder.dueDate).isSameOrAfter(moment(), 'day'))
                .map((reminder) => (
                  <motion.div
                    key={reminder._id}
                    variants={itemVariants}
                    whileHover={{ x: 8, boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg flex justify-between items-center shadow-sm border border-yellow-200 dark:border-yellow-800 transition-all duration-200 ease-in-out"
                  >
                    <div className="flex items-center gap-3">
                      <BellAlertIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">{reminder.message}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium capitalize">{reminder.type.replace('_', ' ')}</span> due on {moment(reminder.dueDate).format('MMM Do, YYYY')}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: '#22c55e' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkReminderComplete(reminder._id)}
                      className="bg-green-500 dark:bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                    >
                      Mark Done
                    </motion.button>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Health Tip of the Day */}
      <motion.section
        variants={sectionVariants}
        className="bg-green-100 dark:bg-green-900/20 p-6 rounded-xl shadow-lg border-b-4 border-green-500 dark:border-green-700 flex items-center gap-4 transition-colors duration-500 ease-in-out"
      >
        <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Health Tip of the Day</h2>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-green-700 dark:text-green-300 text-lg font-medium"
          >
            {getDailyHealthTip()}
          </motion.p>
        </div>
      </motion.section>

      {/* Modals */}
      <AnimatePresence>
        {showAddGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-500 dark:border-blue-700 transition-colors duration-500 ease-in-out"
            >
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">Add New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-5">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Goal Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 bg-white"
                    value={newGoalType}
                    onChange={(e) => {
                      setNewGoalType(e.target.value);
                      if (e.target.value === 'steps') setNewGoalUnit('steps');
                      else if (e.target.value === 'water_intake') setNewGoalUnit('glasses');
                      else if (e.target.value === 'sleep') setNewGoalUnit('hours');
                      else setNewGoalUnit('');
                    }}
                    required
                  >
                    <option value="steps">Steps</option>
                    <option value="water_intake">Water Intake</option>
                    <option value="sleep">Sleep</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Target</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="e.g., 10000"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Unit</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    placeholder="e.g., steps, glasses, hours"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#d1d5db' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowAddGoalModal(false)}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Add Goal
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-yellow-500 dark:border-yellow-700 transition-colors duration-500 ease-in-out"
            >
              <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-6 text-center">Add New Reminder</h3>
              <form onSubmit={handleAddReminder} className="space-y-5">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Message</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                    value={newReminderMessage}
                    onChange={(e) => setNewReminderMessage(e.target.value)}
                    placeholder="e.g., Annual blood test"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 bg-white"
                    value={newReminderType}
                    onChange={(e) => setNewReminderType(e.target.value)}
                    required
                  >
                    <option value="blood_test">Blood Test</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="medication">Medication</option>
                    <option value="checkup">General Checkup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-base font-semibold mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 transition-all duration-200 text-gray-800 dark:text-gray-100 dark:bg-gray-700 bg-white"
                    value={newReminderDueDate}
                    onChange={(e) => setNewReminderDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#d1d5db' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowAddReminderModal(false)}
                    className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#fbbf24' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-yellow-500 dark:bg-yellow-600 text-white font-bold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Add Reminder
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardPage;
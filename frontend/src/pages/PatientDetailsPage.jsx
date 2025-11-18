// frontend/src/pages/PatientDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, UserCircleIcon, BoltIcon, BeakerIcon, MoonIcon, BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/solid';



const backend_url='https://health-care-portal.onrender.com' || 'http://localhost:5000' ;


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

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const userInfo = getUserInfo();
        if (!userInfo || userInfo.role !== 'healthcare_provider') {
          setError('Access Denied: Only healthcare providers can view patient details.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data: patientData } = await axios.get(`${backend_url}/api/users/profile/${patientId}`, config);
        setPatient(patientData);

        const { data: goalsData } = await axios.get(`${backend_url}/api/goals/patient/${patientId}`, config);
        setGoals(goalsData);

        const { data: remindersData } = await axios.get(`${backend_url}/api/reminders/patient/${patientId}`, config);
        setReminders(remindersData);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const calculateProgress = (goal) => {
    if (!goal.progress || goal.progress.length === 0) return 0;
    const latestProgress = goal.progress[goal.progress.length - 1].value;
    return Math.min(100, (latestProgress / goal.target) * 100);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      <p className="ml-4 text-xl text-blue-600 dark:text-blue-400">Loading patient details...</p>
    </div>
  );
  if (error) return <div className="text-center p-8 text-red-600 dark:text-red-400 font-semibold text-lg">{error}</div>;
  if (!patient) return <div className="text-center p-8 text-gray-600 dark:text-gray-400 text-lg">Patient not found. This might be due to an invalid ID or restricted access.</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainerVariants}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl max-w-5xl mx-auto border border-gray-300 dark:border-gray-700 transition-colors duration-500 ease-in-out"
    >
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: '#4b5563' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/provider/dashboard')}
        className="mb-8 bg-gray-600 dark:bg-gray-700 text-white font-bold py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-lg"
      >
        <ArrowLeftIcon className="h-5 w-5" /> Back to Dashboard
      </motion.button>

      <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-8 text-center drop-shadow-sm">Patient Details: {patient.username}</h1>

      {/* Patient Profile */}
      <motion.section
        variants={sectionVariants}
        className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-blue-500 dark:border-blue-700 transition-colors duration-500 ease-in-out"
      >
        <div className="flex items-center gap-4 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <UserCircleIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Profile Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-gray-700 dark:text-gray-300 text-lg">
          <p><strong>Name:</strong> {patient.profile?.firstName} {patient.profile?.lastName}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Date of Birth:</strong> {patient.profile?.dateOfBirth ? moment(patient.profile.dateOfBirth).format('MMM Do, YYYY') : 'N/A'}</p>
          <p className="lg:col-span-2"><strong>Allergies:</strong> {patient.profile?.allergies?.join(', ') || 'None'}</p>
          <p className="lg:col-span-3"><strong>Current Medications:</strong> {patient.profile?.currentMedications?.join(', ') || 'None'}</p>
        </div>
      </motion.section>

      {/* Patient Goals */}
      <motion.section
        variants={sectionVariants}
        className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-blue-500 dark:border-blue-700 transition-colors duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Wellness Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.length === 0 ? (
              <motion.p variants={itemVariants} className="col-span-full text-gray-600 dark:text-gray-400 text-center py-8 text-lg">This patient has no wellness goals set.</motion.p>
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
                      <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" /> Achieved!
                    </motion.span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Patient Reminders */}
      <motion.section
        variants={sectionVariants}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-yellow-500 dark:border-yellow-700 transition-colors duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Preventive Care Reminders</h2>
        <div className="space-y-4">
          <AnimatePresence mode='wait'>
            {reminders.length === 0 ? (
              <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-center py-8 text-lg">This patient has no upcoming reminders.</motion.p>
            ) : (
              reminders.map((reminder) => (
                <motion.div
                  key={reminder._id}
                  variants={itemVariants}
                  whileHover={{ x: 8, boxShadow: "0 5px 10px -3px rgba(0, 0, 0, 0.1)" }}
                  className={`p-4 rounded-lg flex justify-between items-center shadow-sm border transition-all duration-200 ease-in-out
                    ${reminder.isCompleted ? 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}`}
                >
                  <div className="flex items-center gap-3">
                    <BellAlertIcon className={`h-6 w-6 ${reminder.isCompleted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                    <div>
                      <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">{reminder.message}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium capitalize">{reminder.type.replace('_', ' ')}</span> due on {moment(reminder.dueDate).format('MMM Do, YYYY')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full
                    ${reminder.isCompleted ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'}`}>
                    {reminder.isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default PatientDetailsPage;
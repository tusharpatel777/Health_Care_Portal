
// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';


const backend_url='https://health-care-portal.onrender.com';

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
};

const formFieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`${backend_url}/api/users/profile`, config);
        setUsername(data.username);
        setEmail(data.email);
        setFirstName(data.profile?.firstName || '');
        setLastName(data.profile?.lastName || '');
        setDateOfBirth(data.profile?.dateOfBirth ? new Date(data.profile.dateOfBirth).toISOString().split('T')[0] : '');
        setAllergies(data.profile?.allergies ? data.profile.allergies.join(', ') : '');
        setCurrentMedications(data.profile?.currentMedications ? data.profile.currentMedications.join(', ') : '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const updatedProfile = {
        username,
        email,
        firstName,
        lastName,
        dateOfBirth,
        allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
        currentMedications: currentMedications.split(',').map(s => s.trim()).filter(Boolean),
      };

      const { data } = await axios.put(`${backend_url}/api/users/profile`, updatedProfile, config);
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center p-8 text-blue-600 dark:text-blue-400 text-xl">Loading profile...</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl mx-auto border-t-4 border-blue-500 dark:border-blue-400 transform transition-all duration-300 hover:shadow-3xl dark:hover:shadow-lg"
    >
      <h1 className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-8 border-b pb-4 dark:border-gray-600">My Profile</h1>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-lg mb-4 text-center border border-green-200 dark:border-green-800"
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-lg mb-4 text-center border border-red-200 dark:border-red-800"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={formFieldVariants}>
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>

          <motion.div variants={formFieldVariants}>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-400"
              value={email}
              readOnly
            />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 pt-4 pb-2 border-b border-gray-200 dark:border-gray-600">Basic Health Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={formFieldVariants}>
            <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">First Name</label>
            <input
              type="text"
              id="firstName"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </motion.div>

          <motion.div variants={formFieldVariants}>
            <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </motion.div>

          <motion.div variants={formFieldVariants}>
            <label htmlFor="dateOfBirth" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </motion.div>

          <motion.div variants={formFieldVariants} className="md:col-span-2">
            <label htmlFor="allergies" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Allergies (comma separated)</label>
            <input
              type="text"
              id="allergies"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g., Peanuts, Penicillin"
            />
          </motion.div>

          <motion.div variants={formFieldVariants} className="md:col-span-2">
            <label htmlFor="currentMedications" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-sm">Current Medications (comma separated)</label>
            <input
              type="text"
              id="currentMedications"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 transition-all duration-200 ease-in-out text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="e.g., Ibuprofen, Insulin"
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: '#1d4ed8' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out text-lg"
        >
          Update Profile
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ProfilePage;
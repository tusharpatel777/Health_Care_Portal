import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon, UserCircleIcon, MagnifyingGlassIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';



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

const patientCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'Goal Met': return 'text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-800';
    case 'On Track': return 'text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/20 dark:border-blue-800';
    case 'Needs Attention': return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'Missed Checkup': return 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800';
    default: return 'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-gray-700/20 dark:border-gray-600';
  }
};


const ProviderDashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'healthcare_provider') {
          setError('Access Denied: Only healthcare providers can view this page.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`${backend_url}/api/users/patients`, config);
        setPatients(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getComplianceStatus = (patient) => {
    const statuses = ["Goal Met", "On Track", "Needs Attention", "Missed Checkup"];
    const hash = patient._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return statuses[hash % statuses.length];
  };

  const handleViewPatientDetails = (patientId) => {
    navigate(`/provider/patient/${patientId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      <p className="ml-4 text-xl text-blue-600 dark:text-blue-400">Loading patients...</p>
    </div>
  );
  if (error) return (
    <div className="text-center p-8 text-red-600 dark:text-red-400 font-semibold text-lg flex items-center justify-center gap-2">
      <ExclamationCircleIcon className="h-6 w-6 text-red-500 dark:text-red-400" /> {error}
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageContainerVariants}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-2xl max-w-5xl mx-auto border border-gray-300 dark:border-gray-700 transition-colors duration-500 ease-in-out"
    >
      <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-8 text-center drop-shadow-sm">Healthcare Provider Dashboard</h1>

      <motion.section
        variants={sectionVariants}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-b-4 border-blue-500 dark:border-blue-700 transition-colors duration-500 ease-in-out"
      >
        <div className="flex items-center gap-4 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <UserGroupIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Assigned Patients</h2>
        </div>
        {patients.length === 0 ? (
          <motion.p variants={patientCardVariants} className="col-span-full text-gray-600 dark:text-gray-400 text-center py-8 text-lg">No patients found. Please ensure patients are registered.</motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {patients.map((patient) => (
                <motion.div
                  key={patient._id}
                  variants={patientCardVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-purple-400 dark:border-purple-700 flex flex-col justify-between transition-all duration-200 ease-in-out"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <UserCircleIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{patient.username}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Email: <span className="font-medium">{patient.email}</span></p>

                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">Compliance Status:</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusClasses(getComplianceStatus(patient))}`}>
                      {getComplianceStatus(patient) === 'Goal Met' && <CheckCircleIcon className="h-4 w-4 mr-1" />}
                      {getComplianceStatus(patient) === 'Needs Attention' && <ExclamationCircleIcon className="h-4 w-4 mr-1" />}
                      {getComplianceStatus(patient)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewPatientDetails(patient._id)}
                    className="mt-3 bg-blue-600 dark:bg-blue-500 text-white text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4" /> View Details
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default ProviderDashboardPage;

import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Import sun and moon icons

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.2 } },
};

const logoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.4 } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const Header = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { theme, toggleTheme } = useContext(ThemeContext); // Use theme context

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="bg-gradient-to-r from-blue-700 to-blue-500 dark:from-gray-900 dark:to-gray-700 text-white p-4 shadow-xl flex justify-between items-center z-40 relative transition-colors duration-500 ease-in-out" // Added dark mode gradient and transition
    >
      <motion.div variants={logoVariants}>
        <Link to="/" className="text-3xl font-extrabold tracking-tight dark:text-blue-300">
           Healthcare Portal
        </Link>
      </motion.div>

      <nav className="flex items-center space-x-6"> {/* Unified nav container */}
        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-blue-400 dark:bg-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6 text-yellow-300" /> // Moon icon for light mode (click to switch to dark)
          ) : (
            <SunIcon className="h-6 w-6 text-yellow-300" /> // Sun icon for dark mode (click to switch to light)
          )}
        </motion.button>

        {userInfo ? (
          <div className="flex items-center space-x-6">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-xl font-medium dark:text-gray-200"
            >
              Welcome, {userInfo.username}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#dc2626', color: '#fff' }}
              whileTap={{ scale: 0.9 }}
              onClick={logoutHandler}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full shadow-md transition-all duration-200 ease-in-out"
            >
              Logout
            </motion.button>
            {userInfo.role === 'patient' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      delayChildren: 0.8,
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="flex items-center space-x-4"
              >
                <motion.div variants={navItemVariants}>
                  <Link to="/dashboard" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Dashboard</Link>
                </motion.div>
                <motion.div variants={navItemVariants}>
                  <Link to="/profile" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Profile</Link>
                </motion.div>
              </motion.div>
            )}
            {userInfo.role === 'healthcare_provider' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      delayChildren: 0.8,
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div variants={navItemVariants}>
                  <Link to="/provider/dashboard" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Provider Dashboard</Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.6,
                  staggerChildren: 0.1
                }
              }
            }}
            className="flex items-center space-x-4"
          >
            <motion.div variants={navItemVariants}>
              <Link to="/login" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Login</Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link to="/register" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Register</Link>
            </motion.div>
            <motion.div variants={navItemVariants}>
              <Link to="/public-info" className="hover:text-blue-200 dark:hover:text-gray-400 transition-colors duration-200 text-lg font-semibold">Public Info</Link>
            </motion.div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;
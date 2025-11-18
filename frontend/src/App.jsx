import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PublicInfoPage from './pages/PublicInfoPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

const pageVariants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 ease-in-out"> {/* Added dark mode background and transition */}
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-4 overflow-hidden">
          <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={
                <motion.div
                  key="login"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                ><LoginPage /></motion.div>} />
              <Route path="/register" element={
                <motion.div
                  key="register"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                ><RegisterPage /></motion.div>} />
              <Route path="/public-info" element={
                <motion.div
                  key="public-info"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                ><PublicInfoPage /></motion.div>} />

              <Route element={<PrivateRoute allowedRoles={['patient']} />}>
                <Route path="/" element={
                  <motion.div
                    key="dashboard-patient"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  ><DashboardPage /></motion.div>} />
                <Route path="/dashboard" element={
                  <motion.div
                    key="dashboard-patient-explicit"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  ><DashboardPage /></motion.div>} />
                <Route path="/profile" element={
                  <motion.div
                    key="profile"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  ><ProfilePage /></motion.div>} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={['healthcare_provider']} />}>
                 <Route path="/provider/dashboard" element={
                   <motion.div
                     key="provider-dashboard"
                     initial="initial"
                     animate="in"
                     exit="out"
                     variants={pageVariants}
                     transition={pageTransition}
                   ><ProviderDashboardPage /></motion.div>} />
                 <Route path="/provider/patient/:patientId" element={
                   <motion.div
                     key="patient-details"
                     initial="initial"
                     animate="in"
                     exit="out"
                     variants={pageVariants}
                     transition={pageTransition}
                   ><PatientDetailsPage /></motion.div>} />
              </Route>

              <Route path="*" element={
                <motion.div
                  key="404"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                ><div>404 Not Found</div></motion.div>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
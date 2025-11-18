// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  // You might want to get user role from local storage/context to display relevant links
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        {userInfo && userInfo.role === 'patient' && (
          <>
            <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-700">Dashboard</Link>
            <Link to="/profile" className="block py-2 px-3 rounded hover:bg-gray-700">My Profile</Link>
            <Link to="/wellness-goals" className="block py-2 px-3 rounded hover:bg-gray-700">Wellness Goals</Link>
            {/* Add more patient-specific links */}
          </>
        )}
        {userInfo && userInfo.role === 'healthcare_provider' && (
          <>
            <Link to="/provider/dashboard" className="block py-2 px-3 rounded hover:bg-gray-700">Provider Dashboard</Link>
            <Link to="/provider/patients" className="block py-2 px-3 rounded hover:bg-gray-700">View Patients</Link>
            {/* Add more provider-specific links */}
          </>
        )}
        {!userInfo && (
          <>
            <Link to="/login" className="block py-2 px-3 rounded hover:bg-gray-700">Login</Link>
            <Link to="/register" className="block py-2 px-3 rounded hover:bg-gray-700">Register</Link>
          </>
        )}
        <Link to="/public-info" className="block py-2 px-3 rounded hover:bg-gray-700">Public Health Info</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
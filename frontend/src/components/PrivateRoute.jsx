// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// A simple way to manage authentication status (for hackathon)
// In a real app, you'd use context API or Redux for global state
const isAuthenticated = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

const PrivateRoute = ({ allowedRoles }) => {
  const userInfo = isAuthenticated();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // If user is logged in but doesn't have the required role, redirect to their default dashboard
    return <Navigate to={userInfo.role === 'patient' ? '/dashboard' : '/provider/dashboard'} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
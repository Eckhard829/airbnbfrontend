// utils/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return children;
  }

  // Check if user has the required role
  if (user.role !== requiredRole) {
    // Redirect based on their actual role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'host':
        return <Navigate to="/host" />;
      case 'user':
        return <Navigate to="/reservations" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
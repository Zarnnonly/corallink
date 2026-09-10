import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // If page requires user or admin but not logged in
  if (!user && allowedRoles.length > 0 && !allowedRoles.includes('guest')) {
    return <Navigate to="/signin" replace />;
  }

  // If logged in, check if user's role is in allowed roles
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to home if unauthorized
  }

  return children;
};

export default ProtectedRoute;

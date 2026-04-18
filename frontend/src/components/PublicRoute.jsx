import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/getCurrentUser';

const PublicRoute = ({ children }) => {
  const user = getCurrentUser();

  if (user && user.token) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
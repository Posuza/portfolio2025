import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/store';

const AdminRoute = ({ children }) => {
  const user = useStore(state => state.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/home" replace />;
  }
  else 

  return children;
  
};

export default AdminRoute;
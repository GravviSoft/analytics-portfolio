import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = () => {
    // Check if the user is authenticated (e.g., if the JWT token is present)
    return !!localStorage.getItem('token');
  };

  return (
    <Route
      {...rest}
      element={isAuthenticated() ? <Element /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;


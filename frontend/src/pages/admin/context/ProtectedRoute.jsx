import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Not logged in, redirect to login
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in, render children
  return children;
};

export default ProtectedRoute;

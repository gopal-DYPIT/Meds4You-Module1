import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, publicOnly }) => {
  const token = localStorage.getItem("token");

  // If the route is public, allow access without a token (e.g., Home, Contact, Login, Register)
  if (publicOnly && !token) {
    return <Outlet />;
  }

  // If the user is not logged in and tries to access a protected route, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    const userRole = decodedToken.role || decodedToken.userType; // Handle both `role` and `userType`

    // Redirect based on roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("JWT Decode Error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
  
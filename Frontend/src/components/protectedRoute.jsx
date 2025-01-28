import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

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
    const currentTime = Date.now() / 1000; // Convert current time to seconds

    // Check if token has expired
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // If the user is an admin, they can only access the admin route
    if (decodedToken.role === "admin" && allowedRoles && !allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/admin" replace />;
    }

    // If the user does not have the required role, redirect to a default page (e.g., Home)
    if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
      return <Navigate to="/" replace />;
    }

    // For valid tokens with correct roles, render the protected route
    return <Outlet />;
  } catch (error) {
    console.error("JWT Decode Error:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

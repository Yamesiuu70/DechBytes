import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!userInfo) return <Navigate to="/login" replace />;

  // If allowedRoles is provided, check the role
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Admin trying to access user page → go to dashboard
    if (userInfo.role === "ADMIN") return <Navigate to="/dashboard" replace />;

    // Normal user trying to access admin page → go home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

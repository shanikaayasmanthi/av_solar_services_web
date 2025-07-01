import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (
    !token ||
    !user ||
    (user.user_type !== "admin" && user.user_type !== "Super Admin")
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

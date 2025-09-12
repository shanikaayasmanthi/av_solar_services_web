// import { Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import React from "react";

// const ProtectedRoute = ({ children }) => {
//   const { user, token } = useAuth();

//   if (
//     !token ||
//     !user ||
//     (user.user_type !== "admin" && user.user_type !== "Super Admin")
//   ) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import React from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();

if (!token || !user) return <Navigate to="/" replace />;

  // Check if user is active
  if (!user.is_active) {
    return <Navigate to="/" replace />;
  }

    // Allow access to profile for all authenticated users
  if (window.location.pathname === '/profile' || window.location.pathname === '/accounts/profile') {
    return children;
  }

if (user.user_type === "super admin") {
  
  return children;
}

if (!allowedRoles.includes(user.user_type)) {
  return <Navigate to="/" replace />;
}


  return children;
};

export default ProtectedRoute;


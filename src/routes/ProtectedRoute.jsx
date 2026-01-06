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
  return (
    <div className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 rounded-lg shadow-sm bg-red-50" role="alert">
      <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
      </svg>
      <div className="ml-3 text-sm font-medium">
        Access Denied. You do not have the required permissions to view this content.
      </div>
    </div>
  );
}


  return children;
};

export default ProtectedRoute;


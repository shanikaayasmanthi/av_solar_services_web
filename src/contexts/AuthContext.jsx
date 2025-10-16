// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState,useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try{
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        // Check if user is active when loading from storage
        if (parsedAuth.user && !parsedAuth.user.is_active) {
          localStorage.removeItem('auth');
          return { user: null, token: null };
        }
        return parsedAuth;
      }
    } catch (error) {
      console.error("Failed to parse auth data:", error);
    }
    return { user: null, token: null };
  });

   useEffect(() => {
    try {
      localStorage.setItem('auth', JSON.stringify(auth));
    } catch (error) {
      console.error("Failed to save auth data", error);
    }
  }, [auth]);

  const login = (userData, token) => {
    setAuth({ user: userData, token });
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

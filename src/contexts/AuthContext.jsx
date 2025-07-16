// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState,useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try{
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        return JSON.parse(storedAuth);
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

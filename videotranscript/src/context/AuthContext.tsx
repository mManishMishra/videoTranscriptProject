import React, { createContext, useState, useEffect } from "react";
import axios from "axios";



interface AuthContextProps {
  token: string | null;
  role: string | null;
  username: string | null; // Add username
  login: (token: string, role: string, username: string) => void; // Update login signature
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  role: null,
  username: null, // Initialize username as null
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username")); // Add username state

  const login = (token: string, role: string, username: string) => {
    setToken(token);
    setRole(role);
    setUsername(username); // Set username
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username); // Persist username
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null); // Clear username
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username"); // Remove username from storage
  };

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

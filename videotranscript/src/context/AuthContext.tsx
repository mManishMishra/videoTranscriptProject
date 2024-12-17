import React, { createContext, useState, useEffect } from "react";
import axios from "axios";



interface AuthContextProps {
  token: string | null;
  role: string | null;
  username: string | null;
  login: (token: string, role: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  role: null,
  username: null, 
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));

  const login = (token: string, role: string, username: string) => {
    setToken(token);
    setRole(role);
    setUsername(username); 
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null); 
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username"); 
  };

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ErrorPage } from "./ErrorPage";

function Home() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <main className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
     <h1> Dashboard Needs to be updated </h1>
     </main>
  );
}

export default Home;

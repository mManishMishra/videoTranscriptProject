import React, { useContext, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext'; // Import your AuthContext
import { FaBars, FaMoon, FaSignOutAlt, FaSun } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const {username, role, logout } = useContext(AuthContext); // Access user and logout from AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate(); // For navigation after logout

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <header className="p-2 bg-gray-100 dark:bg-gray-800 shadow flex justify-between items-center transition-all duration-500">
        {/* Left Side - Profile */}
        <div className="flex items-center space-x-4">
          {username ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <img
                  src="https://via.placeholder.com/150" // Replace with actual profile image URL if available
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg w-40 text-left">
                  <button
                    onClick={handleLogout}
                    className="block w-full py-1 px-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaSignOutAlt size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
              <span className="text-gray-800 dark:text-gray-100">
                {username} {/* Display logged-in user's username */}
              </span>
            </div>
          ) : (
            <span className="text-gray-800 dark:text-gray-100">Guest</span> // Placeholder for guests
          )}
        </div>

        {/* Right Side - Options */}
        <div className="flex items-center space-x-6">
          <Link
            to="/upload"
            className="hidden md:block text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Upload
          </Link>
         {role==="admin"&& <Link
            to="/manage-users"
            className="hidden md:block text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
          >
            UserManagement
          </Link>
}
          <Link
            to="/contact-us"
            className="hidden md:block text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 flex items-center"
          >
            Contact Us
          </Link>
          {!username && ( // Hide Login if the user is logged in
            <Link
              to="/login"
              className="hidden md:block text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Login
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full transition-all duration-500"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Hamburger Icon for Mobile */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <FaBars size={24} />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="flex justify-end p-4">
            <button onClick={toggleMobileMenu} className="text-white text-3xl">
              ×
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-4">
            <Link
              to="/upload"
              className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Upload
            </Link>
            <Link
              to="/view"
              className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
            >
              View
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

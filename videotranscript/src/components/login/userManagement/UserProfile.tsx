import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState({ username: "", email: "", role: "", profileImage: "" });
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.username}'s profile`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">{user.role}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UserProfile;

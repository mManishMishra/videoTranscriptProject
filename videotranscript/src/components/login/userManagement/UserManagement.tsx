import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // State to toggle the form
  const [newUser, setNewUser] = useState({ username: "", email: "", password:"",role: "" }); // State for new user details
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token from storage
      const response = await fetch("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]); // Add new user to the list
        setShowForm(false); // Hide form after successful creation
        setNewUser({ username: "", email: "", password:"",role: "" }); // Reset form fields
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (id: string) => {
    navigate(`/user-profile/${id}`); // Redirect to user profile
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-user/${id}`); // Redirect to edit user form
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== id));
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <main className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-gray-800 dark:text-gray-100">User Management</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded shadow hover:bg-blue-600 transition ${
              showForm ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? "Cancel" : "Add New User"}
          </button>
        </div>
      </header>

      {/* Form to create a new user */}
      {showForm && (
        <form onSubmit={handleCreateUser} className="bg-white p-4 shadow rounded mb-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
  <label className="block text-sm font-medium text-gray-700">Password</label>
  <input
    type="password"
    value={newUser.password}
    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
    className="mt-1 block w-full px-3 py-2 border rounded"
    required
  />
</div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Create User
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default UserManagement;

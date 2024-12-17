import React from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onView, onEdit, onDelete }) => {
  const placeholderImage = "https://via.placeholder.com/60";
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative transition-all duration-300">
      {/* User Details */}
      <img
        src={user.profileImage || placeholderImage} // Use placeholder if no profile image
        alt={`${user.username}'s profile`}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {user.username}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Email: {user.email}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Role: {user.role}</p>
      </div>

      {/* Action Icons */}
      <div className="absolute top-2 right-2 flex gap-3 text-gray-600 dark:text-gray-400">
        <FaEye
          className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          onClick={() => onView(user._id)}
        />
        <FaEdit
          className="cursor-pointer hover:text-green-500 dark:hover:text-green-300 transition-colors"
          onClick={() => onEdit(user._id)}
        />
        <FaTrash
          className="cursor-pointer text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          onClick={() => onDelete(user._id)}
        />
      </div>
    </div>
  );
};

export default UserCard;

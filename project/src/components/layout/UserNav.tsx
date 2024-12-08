import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, List, LogOut, Settings } from 'lucide-react';

export function UserNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:text-[#A8A8AA]"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">Profile</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
          <Link
            to="/favorites"
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </Link>
          <Link
            to="/my-list"
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            <List className="h-4 w-4 mr-2" />
            My List
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
          <button
            className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
            onClick={() => {/* Add logout logic */}}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
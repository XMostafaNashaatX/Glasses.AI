import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Key, Edit3 } from 'lucide-react';

export function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    email: 'john.doe@example.com',
    password: '••••••••',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80");

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5A1A32] to-[#A8A8AA]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative h-32 bg-[#5A1A32]">
            <div className="absolute top-10 left-8">
              <h1 className="text-xl font-semibold text-white">Welcome, John!</h1>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center -mt-16">
            <div className="relative">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 cursor-pointer">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="py-10 px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
              {[
                { label: 'Username', field: 'username' },
                { label: 'First Name', field: 'firstName' },
                { label: 'Middle Name', field: 'middleName' },
                { label: 'Last Name', field: 'lastName' },
                { label: 'Email', field: 'email' },
                { label: 'Password', field: 'password' },
              ].map(({ label, field }) => (
                <motion.div
                  key={field}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 block mb-2">{label}</label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      value={userInfo[field]}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`w-full bg-transparent text-gray-900 focus:outline-none border-b-2 transition-colors ${
                        isEditing ? 'border-gray-300 focus:border-[#5A1A32]' : 'border-transparent'
                      }`}
                    />
                  </div>
                  {isEditing && <Edit3 className="w-5 h-5 text-gray-500" />}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-right">
              {isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveChanges}
                  className="py-3 px-6 bg-[#5A1A32] text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  Save Changes
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="py-3 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
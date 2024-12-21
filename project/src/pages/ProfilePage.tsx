import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3 } from 'lucide-react';

export function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '••••••••',
    profilePicture: '', // To handle profile picture
  });
  const [isEditing, setIsEditing] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access'));

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo({
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          middleName: data.middle_name,
          email: data.email,
          password: '••••••••',
          profilePicture: data.profile_image || '', // Update profile picture if available
        });
      } else {
        console.error('Failed to fetch user profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          first_name: userInfo.firstName,
          middle_name: userInfo.middleName,
          last_name: userInfo.lastName,
          email: userInfo.email,
          password: userInfo.password, // Keep password in the request
          profile_image: userInfo.profilePicture,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Failed to save changes:', response.status);
      }
    } catch (error) {
      console.error('Error saving profile changes:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

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
              <h1 className="text-xl font-semibold text-white">Welcome, {userInfo.firstName}!</h1>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center -mt-16">
            <div className="relative">
              <img
                src={userInfo.profilePicture}
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
                      className={`w-full bg-transparent text-gray-900 focus:outline-none border-b-2 transition-colors ${isEditing ? 'border-gray-300 focus:border-[#5A1A32]' : 'border-transparent'
                        }`}
                    />
                  </div>
                  {isEditing && <Edit3 className="w-5 h-5 text-gray-500" />}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-right">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#5A1A32] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#A8A8AA] transition"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSaveChanges}
                  className="bg-[#5A1A32] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#A8A8AA] transition"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

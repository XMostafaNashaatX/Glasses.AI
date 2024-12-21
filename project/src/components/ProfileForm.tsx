import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  isEditing: boolean;
  formData: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    username: string;
    bio: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEditToggle: () => void;
}

export function ProfileForm({ isEditing, formData, onSubmit, onChange, onEditToggle }: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onEditToggle}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A1A32] hover:bg-[#4A1528] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A1A32]"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
            Middle Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="middleName"
            id="middleName"
            value={formData.middleName}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            name="bio"
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5A1A32] focus:border-[#5A1A32] disabled:bg-gray-100 resize-none"
          />
        </div>
      </div>
    </form>
  );
}
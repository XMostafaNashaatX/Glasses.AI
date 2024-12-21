import React from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  imageUrl: string;
  onImageChange: () => void;
}

export function ProfileHeader({ imageUrl, onImageChange }: ProfileHeaderProps) {
  return (
    <div className="relative h-48 bg-[#5A1A32]">
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onImageChange}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-5 h-5 text-[#5A1A32]" />
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20" />
    </div>
  );
}
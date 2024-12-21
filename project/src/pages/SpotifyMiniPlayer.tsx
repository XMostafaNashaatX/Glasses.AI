import React from 'react';

export default function SpotifyMiniPlayer({ user, track }) {
  return (
    <div className="fixed top-4 right-4 bg-white p-4 shadow-lg rounded-lg border border-gray-200 flex items-center gap-4 z-50">
      {/* User profile picture */}
      <img
        src={user?.images?.[0]?.url || '/default-avatar.png'}
        alt="User"
        className="w-12 h-12 rounded-full"
      />

      {/* User and track details */}
      <div>
        <h4 className="text-lg font-semibold">{user?.display_name || 'Spotify User'}</h4>
        <p className="text-gray-500">
          {track 
            ? `Playing: ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}` 
            : 'Nothing Playing'}
        </p>
      </div>
    </div>
  );
}

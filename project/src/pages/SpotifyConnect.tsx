import React from 'react';
import { Music, HeadphonesIcon, BookOpenCheck } from 'lucide-react';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import SpotifyMiniPlayer from './SpotifyMiniPlayer';

export default function SpotifyConnect() {
  const {
    isAuthenticated,
    isLoading,
    error,
    login,
    userData,       // New: User data
    currentTrack,   // New: Currently playing track
  } = useSpotifyAuth();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-[#5A1A32]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Render Spotify Mini Player if Authenticated */}
      {isAuthenticated && (
        <SpotifyMiniPlayer user={userData} track={currentTrack} />
      )}

      <h1 className="text-4xl font-bold mb-8 text-[#5A1A32]">Connect with Spotify</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {typeof error === 'string' ? error : 'An error occurred. Please try again.'}
        </div>
      )}

      <div className="bg-white rounded-xl p-8 shadow-sm border border-[#A8A8AA]/20">
        <div className="flex items-center gap-6 mb-8">
          <div className="p-4 rounded-full bg-[#5A1A32]">
            <Music className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#5A1A32]">
              {isAuthenticated ? 'Connected to Spotify' : 'Enhance Your Reading Experience'}
            </h2>
            <p className="text-[#A8A8AA]">
              {isAuthenticated 
                ? 'Your Spotify account is connected. Enjoy personalized music while reading!'
                : 'Connect your Spotify account to access curated playlists for your reading sessions'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-4">
            <HeadphonesIcon className="w-6 h-6 text-[#5A1A32] mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Personalized Playlists</h3>
              <p className="text-gray-600">
                Get music recommendations based on your current book's genre and mood
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <BookOpenCheck className="w-6 h-6 text-[#5A1A32] mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Reading Soundtracks</h3>
              <p className="text-gray-600">
                Access carefully curated ambient sounds and music for focused reading
              </p>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <button
            onClick={login}
            className="w-full md:w-auto px-8 py-3 bg-[#5A1A32] text-white rounded-lg font-semibold hover:bg-[#5A1A32]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Music className="w-5 h-5" />
            Connect with Spotify
          </button>
        )}
      </div>
    </div>
  );
}

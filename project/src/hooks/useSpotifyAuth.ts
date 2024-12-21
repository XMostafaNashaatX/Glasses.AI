import { useState, useEffect } from 'react';
import { spotifyAuth } from '../utils/spotifyAuth';

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const isAuthed = await spotifyAuth.checkAuth();
      setIsAuthenticated(isAuthed);

      if (isAuthed) {
        await fetchUserData();
        await fetchCurrentTrack();
      }
    } catch (err) {
      setError('Failed to check authentication status');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await spotifyAuth.authenticate();
      if (success) {
        setIsAuthenticated(true);
        await fetchUserData();
        await fetchCurrentTrack();
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/spotify/me'); // Your backend endpoint for user data
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError('Failed to fetch user data');
    }
  };

  const fetchCurrentTrack = async () => {
    try {
      const response = await fetch('/api/spotify/current-track'); // Your backend endpoint for current track
      if (!response.ok) throw new Error('Failed to fetch current track');
      const data = await response.json();
      setCurrentTrack(data);
    } catch (err) {
      setError('Failed to fetch current track');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    userData,
    currentTrack,
    checkAuthStatus,
  };
}

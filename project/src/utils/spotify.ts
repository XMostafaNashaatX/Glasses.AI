import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Hardcoded Spotify configuration
const CLIENT_ID = 'afefb479d28447729e904075b6b31a98'; // Replace with your actual Spotify Client ID
const REDIRECT_URI = 'http://localhost:5173/spotify'; // Replace with your actual Redirect URI

// Initialize Spotify API
export const spotifyApi = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  ['streaming', 'user-read-email', 'user-read-private', 'user-library-read']
);

export const checkSpotifyAuth = async () => {
  try {
    const accessToken = await spotifyApi.getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error('Error while checking Spotify authentication:', error);
    return false;
  }
};

import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Hardcoded Spotify configuration
const CLIENT_ID = 'afefb479d28447729e904075b6b31a98'; // Replace with your actual Spotify Client ID
const REDIRECT_URI = 'http://localhost:5173/spotify'; // Replace with your actual Redirect URI

const REQUIRED_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-modify-playback-state',
  'user-read-playback-state',
] as const;

class SpotifyAuthManager {
  private static instance: SpotifyAuthManager;
  private api: SpotifyApi;

  private constructor() {
    this.api = SpotifyApi.withUserAuthorization(
      CLIENT_ID,
      REDIRECT_URI,
      REQUIRED_SCOPES as unknown as string[]
    );
  }

  public static getInstance(): SpotifyAuthManager {
    if (!SpotifyAuthManager.instance) {
      SpotifyAuthManager.instance = new SpotifyAuthManager();
    }
    return SpotifyAuthManager.instance;
  }

  public async checkAuth(): Promise<boolean> {
    try {
      const token = await this.api.getAccessToken();
      return !!token;
    } catch (error) {
      console.error('Error while checking Spotify authentication:', error);
      return false;
    }
  }

  public async authenticate(): Promise<boolean> {
    try {
      await this.api.authenticate();
      return true;
    } catch (error) {
      console.error('Spotify authentication failed:', error);
      return false;
    }
  }

  public getApi(): SpotifyApi {
    return this.api;
  }
}

export const spotifyAuth = SpotifyAuthManager.getInstance();

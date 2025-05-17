/**
 * Garmin Connect API Integration
 * 
 * This file handles authentication and data retrieval from the Garmin Connect API
 * Note: Garmin uses OAuth 1.0a which is more complex than OAuth 2.0
 */

// Types for Garmin data
export interface GarminAuthResponse {
  access_token: string;
  token_secret: string;
  user_id: string;
}

export interface GarminActivityData {
  date: string;
  steps: number;
  distance: number; // in meters
  activeMinutes: number;
  calories: number;
}

export interface GarminSleepData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  efficiency: number; // 0-100 scale
  sleepStages?: {
    deep: number; // in minutes
    light: number;
    rem: number;
    awake: number;
  };
}

export interface GarminHeartRateData {
  date: string;
  restingHeartRate: number;
  maxHeartRate?: number;
  averageHeartRate?: number;
  samples?: Array<{
    time: string;
    heartRate: number;
  }>;
}

export class GarminService {
  private consumerKey: string;
  private accessToken: string | null = null;
  private tokenSecret: string | null = null;
  private userId: string | null = null;
  
  constructor() {
    this.consumerKey = import.meta.env.VITE_GARMIN_CONSUMER_KEY || '';
    
    // Load tokens from localStorage if available
    this.loadTokens();
  }

  /**
   * Check if we have valid Garmin credentials
   */
  public isConfigured(): boolean {
    return Boolean(this.consumerKey);
  }

  /**
   * Check if the user is currently authenticated with Garmin
   */
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken && this.tokenSecret);
  }

  /**
   * Start the Garmin OAuth flow
   * This is a two-step process:
   * 1. Get a request token
   * 2. Redirect the user to authorize
   */
  public async startAuthFlow(): Promise<string> {
    try {
      // In a real implementation, this would get a request token first
      // Since Garmin uses OAuth 1.0a, we'll simplify for the prototype
      
      const callbackUrl = `${window.location.origin}/fitness-tracker/garmin/callback`;
      const state = this.generateRandomState();
      
      // Store state for verification when the user returns
      localStorage.setItem('garmin_auth_state', state);
      
      // In a real implementation, we would use this request token
      // For our prototype, we'll create a dummy URL
      return `https://connect.garmin.com/oauthConfirm?oauth_token=REQUEST_TOKEN&oauth_callback=${encodeURIComponent(callbackUrl)}&state=${state}`;
    } catch (error) {
      console.error('Failed to start Garmin auth flow:', error);
      throw error;
    }
  }

  /**
   * Handle the OAuth callback from Garmin
   * This should be called when the user is redirected back from Garmin
   */
  public async handleAuthCallback(oauthToken: string, oauthVerifier: string, state: string): Promise<boolean> {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('garmin_auth_state');
    if (state !== savedState) {
      throw new Error('OAuth state mismatch. Authentication failed.');
    }
    
    try {
      // Exchange the request token for access token
      const response = await fetch('/api/fitness-trackers/garmin/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier
        })
      });
      
      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }
      
      const tokenData: GarminAuthResponse = await response.json();
      
      // Save the tokens
      this.accessToken = tokenData.access_token;
      this.tokenSecret = tokenData.token_secret;
      this.userId = tokenData.user_id;
      
      // Save to localStorage
      this.saveTokens();
      
      return true;
    } catch (error) {
      console.error('Failed to authenticate with Garmin:', error);
      return false;
    }
  }

  /**
   * Fetch activity data for a specific date range
   */
  public async getActivityData(startDate: string, endDate: string): Promise<GarminActivityData[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Garmin. Please log in.');
    }
    
    try {
      const url = `/api/fitness-trackers/garmin/activity?user_id=${this.userId}&start_date=${startDate}&end_date=${endDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Garmin API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and transform the activity data
      return data.map((item: any) => ({
        date: item.date,
        steps: item.steps || 0,
        distance: item.distance || 0,
        activeMinutes: item.activeMinutes || 0,
        calories: item.calories || 0
      }));
    } catch (error) {
      console.error('Failed to fetch Garmin activity data:', error);
      throw error;
    }
  }

  /**
   * Fetch sleep data for a specific date range
   */
  public async getSleepData(startDate: string, endDate: string): Promise<GarminSleepData[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Garmin. Please log in.');
    }
    
    try {
      const url = `/api/fitness-trackers/garmin/sleep?user_id=${this.userId}&start_date=${startDate}&end_date=${endDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Garmin API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and transform the sleep data
      return data.map((item: any) => ({
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        duration: item.duration || 0,
        efficiency: item.efficiency || 0,
        sleepStages: item.sleepStages ? {
          deep: item.sleepStages.deep || 0,
          light: item.sleepStages.light || 0,
          rem: item.sleepStages.rem || 0,
          awake: item.sleepStages.awake || 0
        } : undefined
      }));
    } catch (error) {
      console.error('Failed to fetch Garmin sleep data:', error);
      throw error;
    }
  }

  /**
   * Fetch heart rate data for a specific date range
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<GarminHeartRateData[]> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Garmin. Please log in.');
    }
    
    try {
      const url = `/api/fitness-trackers/garmin/heart-rate?user_id=${this.userId}&start_date=${startDate}&end_date=${endDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Garmin API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and transform the heart rate data
      return data.map((item: any) => ({
        date: item.date,
        restingHeartRate: item.restingHeartRate || 0,
        maxHeartRate: item.maxHeartRate,
        averageHeartRate: item.averageHeartRate,
        samples: item.samples
      }));
    } catch (error) {
      console.error('Failed to fetch Garmin heart rate data:', error);
      throw error;
    }
  }

  /**
   * Log out the user from Garmin by clearing tokens
   */
  public logout(): void {
    this.accessToken = null;
    this.tokenSecret = null;
    this.userId = null;
    
    // Remove from localStorage
    localStorage.removeItem('garmin_access_token');
    localStorage.removeItem('garmin_token_secret');
    localStorage.removeItem('garmin_user_id');
    localStorage.removeItem('garmin_auth_state');
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('garmin_access_token', this.accessToken);
    }
    
    if (this.tokenSecret) {
      localStorage.setItem('garmin_token_secret', this.tokenSecret);
    }
    
    if (this.userId) {
      localStorage.setItem('garmin_user_id', this.userId);
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('garmin_access_token');
    this.tokenSecret = localStorage.getItem('garmin_token_secret');
    this.userId = localStorage.getItem('garmin_user_id');
  }

  /**
   * Generate a random state string for OAuth security
   */
  private generateRandomState(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
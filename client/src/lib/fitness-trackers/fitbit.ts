/**
 * Fitbit API Integration
 * 
 * This file handles authentication and data retrieval from the Fitbit API
 * Docs: https://dev.fitbit.com/build/reference/web-api/
 */

// Types for Fitbit data
export interface FitbitAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  user_id: string;
}

export interface FitbitActivityData {
  date: string;
  steps: number;
  distance: number;
  activeMinutes: number;
  calories: number;
}

export interface FitbitSleepData {
  date: string;
  duration: number; // in milliseconds
  efficiency: number; // 0-100
  startTime: string;
  endTime: string;
  sleepStages?: {
    deep: number;
    light: number;
    rem: number;
    wake: number;
  };
}

export interface FitbitHeartRateData {
  date: string;
  restingHeartRate: number;
  heartRateZones: {
    name: string;
    min: number;
    max: number;
    minutes: number;
  }[];
}

export class FitbitService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  constructor() {
    this.clientId = import.meta.env.VITE_FITBIT_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_FITBIT_CLIENT_SECRET || '';
    this.redirectUri = `${window.location.origin}/fitness-tracker/fitbit/callback`;
    
    // Load tokens from localStorage if available
    this.loadTokens();
  }

  /**
   * Check if we have valid Fitbit credentials
   */
  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Check if the user is currently authenticated with Fitbit
   */
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken && Date.now() < this.expiresAt);
  }

  /**
   * Generate the Fitbit OAuth authorization URL
   */
  public getAuthUrl(): string {
    const scope = 'activity heartrate sleep profile';
    const state = this.generateRandomState();
    
    // Store state for verification when the user returns
    localStorage.setItem('fitbit_auth_state', state);
    
    return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  }

  /**
   * Handle the OAuth callback from Fitbit
   * This should be called when the user is redirected back from Fitbit
   */
  public async handleAuthCallback(code: string, state: string): Promise<boolean> {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('fitbit_auth_state');
    if (state !== savedState) {
      throw new Error('OAuth state mismatch. Authentication failed.');
    }
    
    try {
      // Exchange the authorization code for access and refresh tokens
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Save the tokens
      this.accessToken = tokenResponse.access_token;
      this.refreshToken = tokenResponse.refresh_token;
      this.expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
      
      // Save to localStorage
      this.saveTokens();
      
      return true;
    } catch (error) {
      console.error('Failed to authenticate with Fitbit:', error);
      return false;
    }
  }

  /**
   * Fetch activity data for a specific date range
   */
  public async getActivityData(startDate: string, endDate: string): Promise<FitbitActivityData[]> {
    await this.ensureValidToken();
    
    const url = `https://api.fitbit.com/1/user/-/activities/steps/date/${startDate}/${endDate}.json`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Fitbit API error: ${response.status} ${response.statusText}`);
      }
      
      const stepsData = await response.json();
      
      // Now fetch the other activity metrics and merge them
      const distanceData = await this.fetchActivityMetric('distance', startDate, endDate);
      const caloriesData = await this.fetchActivityMetric('calories', startDate, endDate);
      const activeMinutesData = await this.fetchActivityMetric('minutesVeryActive', startDate, endDate);
      
      // Combine all data into a single array of activity objects
      return stepsData['activities-steps'].map((day: any, index: number) => ({
        date: day.dateTime,
        steps: parseInt(day.value),
        distance: parseFloat(distanceData['activities-distance'][index].value),
        calories: parseInt(caloriesData['activities-calories'][index].value),
        activeMinutes: parseInt(activeMinutesData['activities-minutesVeryActive'][index].value)
      }));
    } catch (error) {
      console.error('Failed to fetch Fitbit activity data:', error);
      throw error;
    }
  }

  /**
   * Fetch sleep data for a specific date range
   */
  public async getSleepData(startDate: string, endDate: string): Promise<FitbitSleepData[]> {
    await this.ensureValidToken();
    
    const url = `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Fitbit API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and transform the sleep data
      return data.sleep.map((sleep: any) => ({
        date: sleep.dateOfSleep,
        duration: sleep.duration,
        efficiency: sleep.efficiency,
        startTime: sleep.startTime,
        endTime: sleep.endTime,
        sleepStages: sleep.levels?.summary?.stages ? {
          deep: sleep.levels.summary.stages.deep,
          light: sleep.levels.summary.stages.light,
          rem: sleep.levels.summary.stages.rem,
          wake: sleep.levels.summary.stages.wake
        } : undefined
      }));
    } catch (error) {
      console.error('Failed to fetch Fitbit sleep data:', error);
      throw error;
    }
  }

  /**
   * Fetch heart rate data for a specific date range
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<FitbitHeartRateData[]> {
    await this.ensureValidToken();
    
    const url = `https://api.fitbit.com/1/user/-/activities/heart/date/${startDate}/${endDate}.json`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Fitbit API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and transform the heart rate data
      return data['activities-heart'].map((day: any) => ({
        date: day.dateTime,
        restingHeartRate: day.value?.restingHeartRate || 0,
        heartRateZones: day.value?.heartRateZones || []
      }));
    } catch (error) {
      console.error('Failed to fetch Fitbit heart rate data:', error);
      throw error;
    }
  }

  /**
   * Log out the user from Fitbit by clearing tokens
   */
  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    // Remove from localStorage
    localStorage.removeItem('fitbit_access_token');
    localStorage.removeItem('fitbit_refresh_token');
    localStorage.removeItem('fitbit_expires_at');
    localStorage.removeItem('fitbit_auth_state');
  }

  // Private helper methods

  /**
   * Exchange the authorization code for access and refresh tokens
   */
  private async exchangeCodeForToken(code: string): Promise<FitbitAuthResponse> {
    // Due to CORS restrictions, we need to handle token exchange on the server
    // We'll send the code to our backend API
    const response = await fetch('/api/fitness-trackers/fitbit/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        clientId: this.clientId,
        redirectUri: this.redirectUri
      })
    });
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Ensure we have a valid access token, refreshing if necessary
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.isAuthenticated() && this.refreshToken) {
      // Token expired, use refresh token to get a new one
      try {
        const response = await fetch('/api/fitness-trackers/fitbit/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
            clientId: this.clientId
          })
        });
        
        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.expiresAt = Date.now() + (data.expires_in * 1000);
        
        // Save to localStorage
        this.saveTokens();
      } catch (error) {
        console.error('Failed to refresh Fitbit token:', error);
        // Clear tokens as they're no longer valid
        this.logout();
        throw new Error('Authentication expired. Please log in again.');
      }
    } else if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fitbit. Please log in.');
    }
  }

  /**
   * Fetch a specific activity metric
   */
  private async fetchActivityMetric(metric: string, startDate: string, endDate: string): Promise<any> {
    const url = `https://api.fitbit.com/1/user/-/activities/${metric}/date/${startDate}/${endDate}.json`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fitbit API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('fitbit_access_token', this.accessToken);
    }
    
    if (this.refreshToken) {
      localStorage.setItem('fitbit_refresh_token', this.refreshToken);
    }
    
    if (this.expiresAt) {
      localStorage.setItem('fitbit_expires_at', this.expiresAt.toString());
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('fitbit_access_token');
    this.refreshToken = localStorage.getItem('fitbit_refresh_token');
    const expiresAt = localStorage.getItem('fitbit_expires_at');
    this.expiresAt = expiresAt ? parseInt(expiresAt) : 0;
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
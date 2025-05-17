/**
 * Samsung Health API Integration
 * 
 * This file handles authentication and data retrieval from the Samsung Health API
 */

// Types for Samsung Health data
export interface SamsungHealthAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SamsungHealthActivityData {
  date: string;
  steps: number;
  distance: number;
  activeTime: number;
  calories: number;
}

export interface SamsungHealthSleepData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  efficiency: number; // 0-100
  stages?: {
    light: number;
    deep: number;
    rem: number;
    awake: number;
  };
}

export interface SamsungHealthHeartRateData {
  date: string;
  time: string;
  heartRate: number;
  restingHeartRate?: number;
}

export interface SamsungHealthBloodPressureData {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

export class SamsungHealthService {
  private apiKey: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  constructor() {
    this.apiKey = import.meta.env.VITE_SAMSUNG_HEALTH_API_KEY || '';
    this.redirectUri = `${window.location.origin}/fitness-tracker/samsung-health/callback`;
    
    // Load tokens from localStorage if available
    this.loadTokens();
  }

  /**
   * Check if we have valid Samsung Health credentials
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Check if the user is currently authenticated with Samsung Health
   */
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken && Date.now() < this.expiresAt);
  }

  /**
   * Generate the Samsung Health OAuth authorization URL
   */
  public getAuthUrl(): string {
    const state = this.generateRandomState();
    
    // Store state for verification when the user returns
    localStorage.setItem('samsung_health_auth_state', state);
    
    // Samsung Health uses a custom URL scheme for OAuth
    return `https://api.health.samsung.com/auth/authorize?client_id=${this.apiKey}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
  }

  /**
   * Handle the OAuth callback from Samsung Health
   * This should be called when the user is redirected back from Samsung Health
   */
  public async handleAuthCallback(code: string, state: string): Promise<boolean> {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('samsung_health_auth_state');
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
      console.error('Failed to authenticate with Samsung Health:', error);
      return false;
    }
  }

  /**
   * Fetch steps and activity data for a specific date range
   */
  public async getActivityData(startDate: string, endDate: string): Promise<SamsungHealthActivityData[]> {
    await this.ensureValidToken();
    
    // Samsung Health API endpoint for step count and activity data
    const url = `https://api.health.samsung.com/health/v1/tracking/step_count?start_time=${startDate}T00:00:00Z&end_time=${endDate}T23:59:59Z`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Samsung Health API error: ${response.status} ${response.statusText}`);
      }
      
      const stepsData = await response.json();
      
      // Fetch additional activity metrics
      const caloriesUrl = `https://api.health.samsung.com/health/v1/tracking/calories_burned?start_time=${startDate}T00:00:00Z&end_time=${endDate}T23:59:59Z`;
      const caloriesResponse = await fetch(caloriesUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const caloriesData = await caloriesResponse.json();
      
      // Process and combine the data
      return this.processActivityData(stepsData, caloriesData);
    } catch (error) {
      console.error('Failed to fetch Samsung Health activity data:', error);
      throw error;
    }
  }

  /**
   * Fetch sleep data for a specific date range
   */
  public async getSleepData(startDate: string, endDate: string): Promise<SamsungHealthSleepData[]> {
    await this.ensureValidToken();
    
    const url = `https://api.health.samsung.com/health/v1/tracking/sleep?start_time=${startDate}T00:00:00Z&end_time=${endDate}T23:59:59Z`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Samsung Health API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.processSleepData(data);
    } catch (error) {
      console.error('Failed to fetch Samsung Health sleep data:', error);
      throw error;
    }
  }

  /**
   * Fetch heart rate data for a specific date range
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<SamsungHealthHeartRateData[]> {
    await this.ensureValidToken();
    
    const url = `https://api.health.samsung.com/health/v1/tracking/heart_rate?start_time=${startDate}T00:00:00Z&end_time=${endDate}T23:59:59Z`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Samsung Health API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.processHeartRateData(data);
    } catch (error) {
      console.error('Failed to fetch Samsung Health heart rate data:', error);
      throw error;
    }
  }

  /**
   * Log out the user from Samsung Health by clearing tokens
   */
  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    // Remove from localStorage
    localStorage.removeItem('samsung_health_access_token');
    localStorage.removeItem('samsung_health_refresh_token');
    localStorage.removeItem('samsung_health_expires_at');
    localStorage.removeItem('samsung_health_auth_state');
  }

  // Private helper methods

  /**
   * Exchange the authorization code for access and refresh tokens
   */
  private async exchangeCodeForToken(code: string): Promise<SamsungHealthAuthResponse> {
    // Due to CORS restrictions, we need to handle token exchange on the server
    const response = await fetch('/api/fitness-trackers/samsung-health/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        redirectUri: this.redirectUri,
        apiKey: this.apiKey
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
        const response = await fetch('/api/fitness-trackers/samsung-health/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
            apiKey: this.apiKey
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
        console.error('Failed to refresh Samsung Health token:', error);
        // Clear tokens as they're no longer valid
        this.logout();
        throw new Error('Authentication expired. Please log in again.');
      }
    } else if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Samsung Health. Please log in.');
    }
  }

  /**
   * Process and format activity data from Samsung Health
   */
  private processActivityData(stepsData: any, caloriesData: any): SamsungHealthActivityData[] {
    // Implementation depends on the exact format of Samsung Health API responses
    // This is a simplified version that assumes a certain response structure
    const activityByDate: Record<string, SamsungHealthActivityData> = {};
    
    // Process steps data
    if (stepsData.items && Array.isArray(stepsData.items)) {
      for (const item of stepsData.items) {
        const date = item.start_time.split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeTime: 0,
            calories: 0
          };
        }
        
        activityByDate[date].steps += item.count || 0;
        activityByDate[date].distance += item.distance || 0;
        activityByDate[date].activeTime += item.active_time || 0;
      }
    }
    
    // Process calories data
    if (caloriesData.items && Array.isArray(caloriesData.items)) {
      for (const item of caloriesData.items) {
        const date = item.start_time.split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeTime: 0,
            calories: 0
          };
        }
        
        activityByDate[date].calories += item.calories || 0;
      }
    }
    
    // Convert to array and sort by date
    return Object.values(activityByDate).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Process and format sleep data from Samsung Health
   */
  private processSleepData(data: any): SamsungHealthSleepData[] {
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }
    
    return data.items.map((item: any) => {
      const startTime = item.start_time;
      const endTime = item.end_time;
      const date = startTime.split('T')[0];
      
      // Calculate duration in minutes
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      // Extract sleep stages if available
      let stages = undefined;
      if (item.stages && Array.isArray(item.stages)) {
        stages = {
          light: 0,
          deep: 0,
          rem: 0,
          awake: 0
        };
        
        for (const stage of item.stages) {
          if (stage.type === 'light') stages.light += stage.duration || 0;
          else if (stage.type === 'deep') stages.deep += stage.duration || 0;
          else if (stage.type === 'rem') stages.rem += stage.duration || 0;
          else if (stage.type === 'awake') stages.awake += stage.duration || 0;
        }
      }
      
      return {
        date,
        startTime,
        endTime,
        duration: durationMinutes,
        efficiency: item.efficiency || 0,
        stages
      };
    });
  }

  /**
   * Process and format heart rate data from Samsung Health
   */
  private processHeartRateData(data: any): SamsungHealthHeartRateData[] {
    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }
    
    return data.items.map((item: any) => {
      const timestamp = item.timestamp;
      const date = timestamp.split('T')[0];
      const time = timestamp.split('T')[1].replace('Z', '');
      
      return {
        date,
        time,
        heartRate: item.heart_rate || 0,
        restingHeartRate: item.resting_heart_rate
      };
    });
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('samsung_health_access_token', this.accessToken);
    }
    
    if (this.refreshToken) {
      localStorage.setItem('samsung_health_refresh_token', this.refreshToken);
    }
    
    if (this.expiresAt) {
      localStorage.setItem('samsung_health_expires_at', this.expiresAt.toString());
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('samsung_health_access_token');
    this.refreshToken = localStorage.getItem('samsung_health_refresh_token');
    const expiresAt = localStorage.getItem('samsung_health_expires_at');
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
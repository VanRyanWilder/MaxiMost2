/**
 * Google Fit API Integration
 * 
 * This file handles authentication and data retrieval from the Google Fit API
 */

// Types for Google Fit data
export interface GoogleFitAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface GoogleFitActivityData {
  date: string;
  steps: number;
  distance: number; // in meters
  activeMinutes: number;
  calories: number;
}

export interface GoogleFitSleepData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  efficiency: number; // 0-100 scale (estimated)
  sleepStages?: {
    light: number; // in minutes
    deep: number;
    rem: number;
    awake: number;
  };
}

export interface GoogleFitHeartRateData {
  date: string;
  time: string;
  heartRate: number;
}

export class GoogleFitService {
  private clientId: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID || '';
    this.redirectUri = `${window.location.origin}/fitness-tracker/google-fit/callback`;
    
    // Load tokens from localStorage if available
    this.loadTokens();
  }

  /**
   * Check if we have valid Google Fit credentials
   */
  public isConfigured(): boolean {
    return Boolean(this.clientId);
  }

  /**
   * Check if the user is currently authenticated with Google Fit
   */
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken && Date.now() < this.expiresAt);
  }

  /**
   * Generate the Google Fit OAuth authorization URL
   */
  public getAuthUrl(): string {
    const scope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.sleep.read';
    const state = this.generateRandomState();
    
    // Store state for verification when the user returns
    localStorage.setItem('google_fit_auth_state', state);
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline&prompt=consent`;
  }

  /**
   * Handle the OAuth callback from Google Fit
   * This should be called when the user is redirected back from Google
   */
  public async handleAuthCallback(code: string, state: string): Promise<boolean> {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('google_fit_auth_state');
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
      console.error('Failed to authenticate with Google Fit:', error);
      return false;
    }
  }

  /**
   * Fetch steps and activity data for a specific date range
   */
  public async getActivityData(startDate: string, endDate: string): Promise<GoogleFitActivityData[]> {
    await this.ensureValidToken();
    
    try {
      const startTimeMillis = new Date(startDate).setHours(0, 0, 0, 0);
      const endTimeMillis = new Date(endDate).setHours(23, 59, 59, 999);
      
      // Steps request body
      const stepsRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis,
        endTimeMillis
      };
      
      // Calories request body
      const caloriesRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.calories.expended',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis,
        endTimeMillis
      };
      
      // Distance request body
      const distanceRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.distance.delta',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis,
        endTimeMillis
      };
      
      // Active minutes request body
      const activeMinutesRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.active_minutes',
          dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis,
        endTimeMillis
      };
      
      // Make API requests in parallel
      const [stepsResponse, caloriesResponse, distanceResponse, activeMinutesResponse] = await Promise.all([
        this.fetchGoogleFitData(stepsRequestBody),
        this.fetchGoogleFitData(caloriesRequestBody),
        this.fetchGoogleFitData(distanceRequestBody),
        this.fetchGoogleFitData(activeMinutesRequestBody)
      ]);
      
      // Process and combine all data
      return this.processActivityData(
        stepsResponse, 
        caloriesResponse, 
        distanceResponse, 
        activeMinutesResponse
      );
    } catch (error) {
      console.error('Failed to fetch Google Fit activity data:', error);
      throw error;
    }
  }

  /**
   * Fetch sleep data for a specific date range
   */
  public async getSleepData(startDate: string, endDate: string): Promise<GoogleFitSleepData[]> {
    await this.ensureValidToken();
    
    try {
      const startTimeMillis = new Date(startDate).setHours(0, 0, 0, 0);
      const endTimeMillis = new Date(endDate).setHours(23, 59, 59, 999);
      
      // Sleep request body
      const sleepRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.sleep.segment'
        }],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis,
        endTimeMillis
      };
      
      const sleepResponse = await this.fetchGoogleFitData(sleepRequestBody);
      
      // Process sleep data
      return this.processSleepData(sleepResponse);
    } catch (error) {
      console.error('Failed to fetch Google Fit sleep data:', error);
      throw error;
    }
  }

  /**
   * Fetch heart rate data for a specific date range
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<GoogleFitHeartRateData[]> {
    await this.ensureValidToken();
    
    try {
      const startTimeMillis = new Date(startDate).setHours(0, 0, 0, 0);
      const endTimeMillis = new Date(endDate).setHours(23, 59, 59, 999);
      
      // Heart rate request body
      const heartRateRequestBody = {
        aggregateBy: [{
          dataTypeName: 'com.google.heart_rate.bpm',
          dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
        }],
        bucketByTime: { durationMillis: 3600000 }, // 1 hour in milliseconds for more detailed data
        startTimeMillis,
        endTimeMillis
      };
      
      const heartRateResponse = await this.fetchGoogleFitData(heartRateRequestBody);
      
      // Process heart rate data
      return this.processHeartRateData(heartRateResponse);
    } catch (error) {
      console.error('Failed to fetch Google Fit heart rate data:', error);
      throw error;
    }
  }

  /**
   * Log out the user from Google Fit by clearing tokens
   */
  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    // Remove from localStorage
    localStorage.removeItem('google_fit_access_token');
    localStorage.removeItem('google_fit_refresh_token');
    localStorage.removeItem('google_fit_expires_at');
    localStorage.removeItem('google_fit_auth_state');
  }

  // Private helper methods

  /**
   * Exchange the authorization code for access and refresh tokens
   */
  private async exchangeCodeForToken(code: string): Promise<GoogleFitAuthResponse> {
    // Due to CORS restrictions, we need to handle token exchange on the server
    const response = await fetch('/api/fitness-trackers/google-fit/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
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
        const response = await fetch('/api/fitness-trackers/google-fit/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken
          })
        });
        
        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token || this.refreshToken; // Sometimes refresh tokens are not returned
        this.expiresAt = Date.now() + (data.expires_in * 1000);
        
        // Save to localStorage
        this.saveTokens();
      } catch (error) {
        console.error('Failed to refresh Google Fit token:', error);
        // Clear tokens as they're no longer valid
        this.logout();
        throw new Error('Authentication expired. Please log in again.');
      }
    } else if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Fit. Please log in.');
    }
  }

  /**
   * Fetch aggregated data from Google Fit API
   */
  private async fetchGoogleFitData(requestBody: any): Promise<any> {
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Google Fit API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Process and format activity data from Google Fit
   */
  private processActivityData(
    stepsData: any, 
    caloriesData: any, 
    distanceData: any, 
    activeMinutesData: any
  ): GoogleFitActivityData[] {
    // Map to store activity data by date
    const activityByDate: Record<string, GoogleFitActivityData> = {};
    
    // Process steps data
    if (stepsData.bucket && stepsData.bucket.length > 0) {
      stepsData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeMinutes: 0,
            calories: 0
          };
        }
        
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              activityByDate[date].steps += point.value[0].intVal || 0;
            }
          });
        }
      });
    }
    
    // Process calories data
    if (caloriesData.bucket && caloriesData.bucket.length > 0) {
      caloriesData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeMinutes: 0,
            calories: 0
          };
        }
        
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              activityByDate[date].calories += Math.round(point.value[0].fpVal || 0);
            }
          });
        }
      });
    }
    
    // Process distance data
    if (distanceData.bucket && distanceData.bucket.length > 0) {
      distanceData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeMinutes: 0,
            calories: 0
          };
        }
        
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              activityByDate[date].distance += Math.round(point.value[0].fpVal || 0);
            }
          });
        }
      });
    }
    
    // Process active minutes data
    if (activeMinutesData.bucket && activeMinutesData.bucket.length > 0) {
      activeMinutesData.bucket.forEach((bucket: any) => {
        const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = {
            date,
            steps: 0,
            distance: 0,
            activeMinutes: 0,
            calories: 0
          };
        }
        
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              activityByDate[date].activeMinutes += Math.round(point.value[0].intVal || 0);
            }
          });
        }
      });
    }
    
    // Convert to array and sort by date
    return Object.values(activityByDate).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Process and format sleep data from Google Fit
   */
  private processSleepData(data: any): GoogleFitSleepData[] {
    const sleepSessions: Record<string, GoogleFitSleepData> = {};
    
    if (data.bucket && data.bucket.length > 0) {
      data.bucket.forEach((bucket: any) => {
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          
          // Process each sleep segment
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              const startTimeMillis = parseInt(point.startTimeNanos) / 1000000;
              const endTimeMillis = parseInt(point.endTimeNanos) / 1000000;
              const startDate = new Date(startTimeMillis);
              const endDate = new Date(endTimeMillis);
              const date = startDate.toISOString().split('T')[0];
              const sessionId = `${date}_${startTimeMillis}`;
              
              // Create a new sleep session if it doesn't exist
              if (!sleepSessions[sessionId]) {
                sleepSessions[sessionId] = {
                  date,
                  startTime: startDate.toISOString(),
                  endTime: endDate.toISOString(),
                  duration: Math.round((endTimeMillis - startTimeMillis) / 60000), // Convert to minutes
                  efficiency: 0, // Will be calculated later if possible
                  sleepStages: {
                    light: 0,
                    deep: 0,
                    rem: 0,
                    awake: 0
                  }
                };
              }
              
              // Update sleep stages based on the sleep type
              const sleepType = point.value[0].intVal;
              const durationMinutes = Math.round((endTimeMillis - startTimeMillis) / 60000);
              
              if (sleepSessions[sessionId].sleepStages) {
                // Map Google Fit sleep types to our categories
                // 1: Awake, 2: Sleep, 3: Out of bed, 4: Light sleep, 5: Deep sleep, 6: REM
                switch (sleepType) {
                  case 1:
                    sleepSessions[sessionId].sleepStages.awake += durationMinutes;
                    break;
                  case 2:
                  case 4:
                    sleepSessions[sessionId].sleepStages.light += durationMinutes;
                    break;
                  case 5:
                    sleepSessions[sessionId].sleepStages.deep += durationMinutes;
                    break;
                  case 6:
                    sleepSessions[sessionId].sleepStages.rem += durationMinutes;
                    break;
                }
              }
            }
          });
        }
      });
    }
    
    // Calculate sleep efficiency for each session
    // Efficiency = (total sleep time - awake time) / total time * 100
    Object.values(sleepSessions).forEach(session => {
      if (session.sleepStages) {
        const totalTime = session.duration;
        const awakeTime = session.sleepStages.awake;
        const sleepTime = totalTime - awakeTime;
        
        session.efficiency = Math.round((sleepTime / totalTime) * 100);
      }
    });
    
    // Convert to array and sort by date
    return Object.values(sleepSessions).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Process and format heart rate data from Google Fit
   */
  private processHeartRateData(data: any): GoogleFitHeartRateData[] {
    const heartRateData: GoogleFitHeartRateData[] = [];
    
    if (data.bucket && data.bucket.length > 0) {
      data.bucket.forEach((bucket: any) => {
        if (bucket.dataset && bucket.dataset.length > 0 && 
            bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
          
          // Process each heart rate measurement
          bucket.dataset[0].point.forEach((point: any) => {
            if (point.value && point.value.length > 0) {
              const timeMillis = parseInt(point.startTimeNanos) / 1000000;
              const date = new Date(timeMillis);
              
              heartRateData.push({
                date: date.toISOString().split('T')[0],
                time: date.toISOString().split('T')[1].replace('Z', ''),
                heartRate: Math.round(point.value[0].fpVal || 0)
              });
            }
          });
        }
      });
    }
    
    // Sort by date and time
    return heartRateData.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('google_fit_access_token', this.accessToken);
    }
    
    if (this.refreshToken) {
      localStorage.setItem('google_fit_refresh_token', this.refreshToken);
    }
    
    if (this.expiresAt) {
      localStorage.setItem('google_fit_expires_at', this.expiresAt.toString());
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('google_fit_access_token');
    this.refreshToken = localStorage.getItem('google_fit_refresh_token');
    const expiresAt = localStorage.getItem('google_fit_expires_at');
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
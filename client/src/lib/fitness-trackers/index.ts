/**
 * Fitness Tracker Integration Hub
 * 
 * This file provides a central point for managing multiple fitness tracker integrations
 * and combines their data into unified formats for the application to use.
 */

import { FitbitService } from './fitbit';
import { SamsungHealthService } from './samsung-health';
import { MyFitnessPalService } from './myfitnesspal';
import { GoogleFitService } from './google-fit';
import { AppleHealthService } from './apple-health';
import { GarminService } from './garmin';

// Unified types that combine data from different trackers
export interface UnifiedActivityData {
  date: string;
  steps: number;
  distance: number; // in meters
  activeMinutes: number;
  calories: number;
  source: 'fitbit' | 'samsung_health' | 'google_fit' | 'apple_health' | 'garmin' | 'manual';
}

export interface UnifiedSleepData {
  date: string;
  duration: number; // in minutes
  efficiency: number; // 0-100 scale
  startTime: string;
  endTime: string;
  sleepStages?: {
    deep: number; // in minutes
    light: number; // in minutes
    rem: number; // in minutes
    awake: number; // in minutes
  };
  source: 'fitbit' | 'samsung_health' | 'google_fit' | 'apple_health' | 'garmin' | 'manual';
}

export interface UnifiedHeartRateData {
  date: string;
  time?: string;
  heartRate: number; // beats per minute
  restingHeartRate?: number;
  source: 'fitbit' | 'samsung_health' | 'google_fit' | 'apple_health' | 'garmin' | 'manual';
}

export interface UnifiedNutritionData {
  date: string;
  totalCalories: number;
  goalCalories: number;
  totalProtein: number; // in grams
  totalCarbs: number; // in grams
  totalFat: number; // in grams
  meals?: {
    breakfast: any[];
    lunch: any[];
    dinner: any[];
    snack: any[];
  };
  source: 'myfitnesspal' | 'manual';
}

export interface UnifiedWaterData {
  date: string;
  amount: number; // in milliliters
  goal: number; // in milliliters
  source: 'myfitnesspal' | 'manual';
}

export interface UnifiedWeightData {
  date: string;
  weight: number; // in kilograms
  source: 'fitbit' | 'myfitnesspal' | 'samsung_health' | 'google_fit' | 'apple_health' | 'garmin' | 'manual';
}

export interface TrackerStatus {
  fitbit: {
    configured: boolean;
    authenticated: boolean;
  };
  samsungHealth: {
    configured: boolean;
    authenticated: boolean;
  };
  myFitnessPal: {
    configured: boolean;
    authenticated: boolean;
  };
  googleFit: {
    configured: boolean;
    authenticated: boolean;
  };
  appleHealth: {
    supported: boolean;
    lastSynced: Date | null;
  };
  garmin: {
    configured: boolean;
    authenticated: boolean;
  };
}

class FitnessTrackerService {
  private fitbitService: FitbitService;
  private samsungHealthService: SamsungHealthService;
  private myFitnessPalService: MyFitnessPalService;
  private googleFitService: GoogleFitService;
  private appleHealthService: AppleHealthService;
  private garminService: GarminService;
  
  constructor() {
    this.fitbitService = new FitbitService();
    this.samsungHealthService = new SamsungHealthService();
    this.myFitnessPalService = new MyFitnessPalService();
    this.googleFitService = new GoogleFitService();
    this.appleHealthService = new AppleHealthService();
    this.garminService = new GarminService();
  }
  
  /**
   * Get the status of all fitness tracker integrations
   */
  public getStatus(): TrackerStatus {
    const appleHealthStatus = this.appleHealthService.getSyncStatus();
    
    return {
      fitbit: {
        configured: this.fitbitService.isConfigured(),
        authenticated: this.fitbitService.isAuthenticated()
      },
      samsungHealth: {
        configured: this.samsungHealthService.isConfigured(),
        authenticated: this.samsungHealthService.isAuthenticated()
      },
      myFitnessPal: {
        configured: this.myFitnessPalService.isConfigured(),
        authenticated: this.myFitnessPalService.isAuthenticated()
      },
      googleFit: {
        configured: this.googleFitService.isConfigured(),
        authenticated: this.googleFitService.isAuthenticated()
      },
      appleHealth: {
        supported: this.appleHealthService.isSupported(),
        lastSynced: appleHealthStatus.lastSynced
      },
      garmin: {
        configured: this.garminService.isConfigured(),
        authenticated: this.garminService.isAuthenticated()
      }
    };
  }
  
  /**
   * Get OAuth authorization URLs for each service
   */
  public getAuthUrls() {
    // Garmin needs a different approach since it uses a 2-step process
    let garminUrl = null;
    if (this.garminService.isConfigured()) {
      try {
        // Start the Garmin auth flow (this is async but we'll return a promise)
        garminUrl = this.garminService.startAuthFlow();
      } catch (error) {
        console.error('Failed to start Garmin auth flow:', error);
      }
    }
    
    return {
      fitbit: this.fitbitService.isConfigured() ? this.fitbitService.getAuthUrl() : null,
      samsungHealth: this.samsungHealthService.isConfigured() ? this.samsungHealthService.getAuthUrl() : null,
      myFitnessPal: this.myFitnessPalService.isConfigured() ? this.myFitnessPalService.getAuthUrl() : null,
      googleFit: this.googleFitService.isConfigured() ? this.googleFitService.getAuthUrl() : null,
      garmin: garminUrl,
      // Apple Health doesn't have an auth URL since it's accessed through the native iOS app
      appleHealth: null
    };
  }
  
  /**
   * Fetch unified activity data from all available trackers
   */
  public async getActivityData(startDate: string, endDate: string): Promise<UnifiedActivityData[]> {
    const activityData: UnifiedActivityData[] = [];
    
    // Try to get data from Fitbit
    if (this.fitbitService.isAuthenticated()) {
      try {
        const fitbitData = await this.fitbitService.getActivityData(startDate, endDate);
        
        // Convert Fitbit data to unified format
        const unifiedFitbitData = fitbitData.map(data => ({
          date: data.date,
          steps: data.steps,
          distance: data.distance * 1000, // Fitbit uses km, convert to meters
          activeMinutes: data.activeMinutes,
          calories: data.calories,
          source: 'fitbit' as const
        }));
        
        activityData.push(...unifiedFitbitData);
      } catch (error) {
        console.error('Failed to fetch Fitbit activity data:', error);
      }
    }
    
    // Try to get data from Samsung Health
    if (this.samsungHealthService.isAuthenticated()) {
      try {
        const samsungData = await this.samsungHealthService.getActivityData(startDate, endDate);
        
        // Convert Samsung Health data to unified format
        const unifiedSamsungData = samsungData.map(data => ({
          date: data.date,
          steps: data.steps,
          distance: data.distance, // Samsung Health uses meters
          activeMinutes: data.activeTime,
          calories: data.calories,
          source: 'samsung_health' as const
        }));
        
        activityData.push(...unifiedSamsungData);
      } catch (error) {
        console.error('Failed to fetch Samsung Health activity data:', error);
      }
    }
    
    // Merge data from different sources, prioritizing Fitbit if data exists for the same day
    const mergedData: Record<string, UnifiedActivityData> = {};
    
    for (const data of activityData) {
      if (!mergedData[data.date] || mergedData[data.date].source === 'manual') {
        mergedData[data.date] = data;
      } else if (data.source === 'fitbit' && mergedData[data.date].source !== 'fitbit') {
        // Prioritize Fitbit data over other sources
        mergedData[data.date] = data;
      }
    }
    
    // Convert back to array and sort by date
    return Object.values(mergedData).sort((a, b) => a.date.localeCompare(b.date));
  }
  
  /**
   * Fetch unified sleep data from all available trackers
   */
  public async getSleepData(startDate: string, endDate: string): Promise<UnifiedSleepData[]> {
    const sleepData: UnifiedSleepData[] = [];
    
    // Try to get data from Fitbit
    if (this.fitbitService.isAuthenticated()) {
      try {
        const fitbitData = await this.fitbitService.getSleepData(startDate, endDate);
        
        // Convert Fitbit data to unified format
        const unifiedFitbitData = fitbitData.map(data => ({
          date: data.date,
          duration: data.duration / 60000, // Convert ms to minutes
          efficiency: data.efficiency,
          startTime: data.startTime,
          endTime: data.endTime,
          sleepStages: data.sleepStages ? {
            deep: data.sleepStages.deep / 60000, // Convert ms to minutes
            light: data.sleepStages.light / 60000,
            rem: data.sleepStages.rem / 60000,
            awake: data.sleepStages.wake / 60000
          } : undefined,
          source: 'fitbit' as const
        }));
        
        sleepData.push(...unifiedFitbitData);
      } catch (error) {
        console.error('Failed to fetch Fitbit sleep data:', error);
      }
    }
    
    // Try to get data from Samsung Health
    if (this.samsungHealthService.isAuthenticated()) {
      try {
        const samsungData = await this.samsungHealthService.getSleepData(startDate, endDate);
        
        // Convert Samsung Health data to unified format
        const unifiedSamsungData = samsungData.map(data => ({
          date: data.date,
          duration: data.duration, // Already in minutes
          efficiency: data.efficiency,
          startTime: data.startTime,
          endTime: data.endTime,
          sleepStages: data.stages,
          source: 'samsung_health' as const
        }));
        
        sleepData.push(...unifiedSamsungData);
      } catch (error) {
        console.error('Failed to fetch Samsung Health sleep data:', error);
      }
    }
    
    // Merge data from different sources, prioritizing Fitbit
    const mergedData: Record<string, UnifiedSleepData> = {};
    
    for (const data of sleepData) {
      if (!mergedData[data.date] || mergedData[data.date].source === 'manual') {
        mergedData[data.date] = data;
      } else if (data.source === 'fitbit' && mergedData[data.date].source !== 'fitbit') {
        // Prioritize Fitbit data over other sources
        mergedData[data.date] = data;
      }
    }
    
    // Convert back to array and sort by date
    return Object.values(mergedData).sort((a, b) => a.date.localeCompare(b.date));
  }
  
  /**
   * Fetch unified heart rate data from all available trackers
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<UnifiedHeartRateData[]> {
    const heartRateData: UnifiedHeartRateData[] = [];
    
    // Try to get data from Fitbit
    if (this.fitbitService.isAuthenticated()) {
      try {
        const fitbitData = await this.fitbitService.getHeartRateData(startDate, endDate);
        
        // Convert Fitbit data to unified format
        const unifiedFitbitData = fitbitData.map(data => ({
          date: data.date,
          heartRate: data.restingHeartRate, // Use resting heart rate as the main value
          restingHeartRate: data.restingHeartRate,
          source: 'fitbit' as const
        }));
        
        heartRateData.push(...unifiedFitbitData);
      } catch (error) {
        console.error('Failed to fetch Fitbit heart rate data:', error);
      }
    }
    
    // Try to get data from Samsung Health
    if (this.samsungHealthService.isAuthenticated()) {
      try {
        const samsungData = await this.samsungHealthService.getHeartRateData(startDate, endDate);
        
        // Convert Samsung Health data to unified format
        const unifiedSamsungData = samsungData.map(data => ({
          date: data.date,
          time: data.time,
          heartRate: data.heartRate,
          restingHeartRate: data.restingHeartRate,
          source: 'samsung_health' as const
        }));
        
        heartRateData.push(...unifiedSamsungData);
      } catch (error) {
        console.error('Failed to fetch Samsung Health heart rate data:', error);
      }
    }
    
    // Merge data, prioritizing Fitbit for daily summaries
    const mergedData: Record<string, UnifiedHeartRateData> = {};
    
    for (const data of heartRateData) {
      const key = data.time ? `${data.date}T${data.time}` : data.date;
      
      if (!mergedData[key] || mergedData[key].source === 'manual') {
        mergedData[key] = data;
      } else if (data.source === 'fitbit' && !data.time && mergedData[key].source !== 'fitbit') {
        // Prioritize Fitbit data for daily summaries
        mergedData[key] = data;
      }
    }
    
    // Convert back to array and sort by date and time
    return Object.values(mergedData).sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, compare by time if available
      if (a.time && b.time) return a.time.localeCompare(b.time);
      return 0;
    });
  }
  
  /**
   * Fetch unified nutrition data from MyFitnessPal
   */
  public async getNutritionData(startDate: string, endDate: string): Promise<UnifiedNutritionData[]> {
    // Only MyFitnessPal provides nutrition data
    if (!this.myFitnessPalService.isAuthenticated()) {
      return [];
    }
    
    try {
      const mfpData = await this.myFitnessPalService.getNutritionData(startDate, endDate);
      
      // Convert to unified format
      return mfpData.map(data => ({
        date: data.date,
        totalCalories: data.totalCalories,
        goalCalories: data.goalCalories,
        totalProtein: data.totalProtein,
        totalCarbs: data.totalCarbs,
        totalFat: data.totalFat,
        meals: data.meals,
        source: 'myfitnesspal' as const
      }));
    } catch (error) {
      console.error('Failed to fetch MyFitnessPal nutrition data:', error);
      return [];
    }
  }
  
  /**
   * Fetch unified water consumption data from MyFitnessPal
   */
  public async getWaterData(startDate: string, endDate: string): Promise<UnifiedWaterData[]> {
    // Only MyFitnessPal provides water tracking
    if (!this.myFitnessPalService.isAuthenticated()) {
      return [];
    }
    
    try {
      const mfpData = await this.myFitnessPalService.getWaterData(startDate, endDate);
      
      // Convert to unified format
      return mfpData.map(data => ({
        date: data.date,
        amount: data.actualAmount,
        goal: data.goalAmount,
        source: 'myfitnesspal' as const
      }));
    } catch (error) {
      console.error('Failed to fetch MyFitnessPal water data:', error);
      return [];
    }
  }
  
  /**
   * Fetch unified weight data from all available trackers
   */
  public async getWeightData(startDate: string, endDate: string): Promise<UnifiedWeightData[]> {
    const weightData: UnifiedWeightData[] = [];
    
    // Try to get weight data from MyFitnessPal
    if (this.myFitnessPalService.isAuthenticated()) {
      try {
        const mfpData = await this.myFitnessPalService.getWeightData(startDate, endDate);
        
        const unifiedMfpData = mfpData.map(data => ({
          date: data.date,
          weight: data.weight,
          source: 'myfitnesspal' as const
        }));
        
        weightData.push(...unifiedMfpData);
      } catch (error) {
        console.error('Failed to fetch MyFitnessPal weight data:', error);
      }
    }
    
    // Merge data from different sources
    const mergedData: Record<string, UnifiedWeightData> = {};
    
    for (const data of weightData) {
      if (!mergedData[data.date] || mergedData[data.date].source === 'manual') {
        mergedData[data.date] = data;
      } else if (data.source === 'myfitnesspal' && mergedData[data.date].source !== 'myfitnesspal') {
        // Prioritize MyFitnessPal data over other sources for weight
        mergedData[data.date] = data;
      }
    }
    
    // Convert back to array and sort by date
    return Object.values(mergedData).sort((a, b) => a.date.localeCompare(b.date));
  }
  
  /**
   * Handle callback from Fitbit OAuth flow
   */
  public async handleFitbitCallback(code: string, state: string): Promise<boolean> {
    return await this.fitbitService.handleAuthCallback(code, state);
  }
  
  /**
   * Handle callback from Samsung Health OAuth flow
   */
  public async handleSamsungHealthCallback(code: string, state: string): Promise<boolean> {
    return await this.samsungHealthService.handleAuthCallback(code, state);
  }
  
  /**
   * Handle callback from MyFitnessPal OAuth flow
   */
  public async handleMyFitnessPalCallback(code: string, state: string): Promise<boolean> {
    return await this.myFitnessPalService.handleAuthCallback(code, state);
  }
  
  /**
   * Handle callback from Google Fit OAuth flow
   */
  public async handleGoogleFitCallback(code: string, state: string): Promise<boolean> {
    return await this.googleFitService.handleAuthCallback(code, state);
  }
  
  /**
   * Handle callback from Garmin OAuth flow
   */
  public async handleGarminCallback(oauthToken: string, oauthVerifier: string, state: string): Promise<boolean> {
    return await this.garminService.handleAuthCallback(oauthToken, oauthVerifier, state);
  }
  
  /**
   * Sync data from Apple Health (this doesn't use typical OAuth flow)
   */
  public async syncAppleHealthData(startDate: string, endDate: string): Promise<boolean> {
    return await this.appleHealthService.syncHealthData(startDate, endDate);
  }
  
  /**
   * Log out from all fitness trackers
   */
  public logoutAll(): void {
    this.fitbitService.logout();
    this.samsungHealthService.logout();
    this.myFitnessPalService.logout();
    this.googleFitService.logout();
    this.garminService.logout();
    this.appleHealthService.clearData();
  }
  
  /**
   * Log out from a specific fitness tracker
   */
  public logout(tracker: 'fitbit' | 'samsung_health' | 'myfitnesspal' | 'google_fit' | 'garmin' | 'apple_health'): void {
    switch (tracker) {
      case 'fitbit':
        this.fitbitService.logout();
        break;
      case 'samsung_health':
        this.samsungHealthService.logout();
        break;
      case 'myfitnesspal':
        this.myFitnessPalService.logout();
        break;
      case 'google_fit':
        this.googleFitService.logout();
        break;
      case 'garmin':
        this.garminService.logout();
        break;
      case 'apple_health':
        this.appleHealthService.clearData();
        break;
    }
  }
}

// Export a singleton instance
export const fitnessTrackerService = new FitnessTrackerService();
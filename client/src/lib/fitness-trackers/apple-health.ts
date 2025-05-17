/**
 * Apple Health Integration
 * 
 * This file handles the client-side integration with Apple HealthKit data.
 * Since Apple Health doesn't have a REST API like other platforms, the data
 * must be collected on the iOS device and sent to our server.
 */

// Types for Apple Health data
export interface AppleHealthActivityData {
  date: string;
  steps: number;
  distance: number; // in meters
  activeEnergyBurned: number; // calories
  exerciseMinutes: number;
}

export interface AppleHealthSleepData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  sleepStages?: {
    deep: number; // in minutes
    light: number;
    rem: number;
    awake: number;
  };
}

export interface AppleHealthHeartRateData {
  date: string;
  time: string;
  heartRate: number;
  restingHeartRate?: number;
}

export interface AppleHealthSyncStatus {
  lastSynced: Date | null;
  isSyncing: boolean;
  error: string | null;
}

export class AppleHealthService {
  private lastSyncedTime: Date | null = null;
  private isSyncing: boolean = false;
  private syncError: string | null = null;
  private activityData: AppleHealthActivityData[] = [];
  private sleepData: AppleHealthSleepData[] = [];
  private heartRateData: AppleHealthHeartRateData[] = [];

  constructor() {
    // Load last sync time from localStorage
    const lastSyncedStr = localStorage.getItem('apple_health_last_synced');
    if (lastSyncedStr) {
      this.lastSyncedTime = new Date(lastSyncedStr);
    }

    // Load cached data from localStorage
    this.loadCachedData();
  }

  /**
   * Check if we're on an iOS device that supports HealthKit
   */
  public isSupported(): boolean {
    // Check if we're on iOS and the web app is running in Safari
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod/.test(userAgent) && 
           (window.webkit && window.webkit.messageHandlers);
  }

  /**
   * Get the current sync status for Apple Health data
   */
  public getSyncStatus(): AppleHealthSyncStatus {
    return {
      lastSynced: this.lastSyncedTime,
      isSyncing: this.isSyncing,
      error: this.syncError
    };
  }

  /**
   * Request access to Apple Health data
   * This function should be called when the user wants to connect to Apple Health
   */
  public async requestAuthorization(): Promise<boolean> {
    if (!this.isSupported()) {
      this.syncError = 'Apple Health is only available on iOS devices';
      return false;
    }

    try {
      // Since we can't directly access HealthKit from the web, we'll show instructions to the user
      // In a real app, this would use a native app wrapper or a Progressive Web App capability
      return true;
    } catch (error: any) {
      this.syncError = error.message || 'Failed to request Apple Health access';
      console.error('Error requesting Apple Health authorization:', error);
      return false;
    }
  }

  /**
   * Sync Apple Health data
   * In a real implementation, this would communicate with a native app component or use a bridge
   */
  public async syncHealthData(startDate: string, endDate: string): Promise<boolean> {
    if (!this.isSupported()) {
      this.syncError = 'Apple Health is only available on iOS devices';
      return false;
    }

    try {
      this.isSyncing = true;
      this.syncError = null;

      // In a real implementation, this would call into native code
      // For our prototype, we'll simulate the data sync by posting to our server API
      // which would receive data collected from a native iOS app component
      
      // Mock data just for demonstration - in a real app, this would be sent from the native layer
      const mockHealthData = {
        activity: [
          {
            date: new Date().toISOString().split('T')[0],
            steps: 8976,
            distance: 6543.21,
            activeEnergyBurned: 387,
            exerciseMinutes: 42
          }
        ],
        sleep: [
          {
            date: new Date().toISOString().split('T')[0],
            startTime: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
            endTime: new Date().toISOString(),
            duration: 480, // 8 hours in minutes
            sleepStages: {
              deep: 90,
              light: 240,
              rem: 120,
              awake: 30
            }
          }
        ],
        heartRate: [
          {
            date: new Date().toISOString().split('T')[0],
            time: new Date().toISOString().split('T')[1].replace('Z', ''),
            heartRate: 72,
            restingHeartRate: 65
          }
        ]
      };
      
      const response = await fetch('/api/fitness-trackers/apple-health/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          healthData: mockHealthData
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Update local data
      this.activityData = mockHealthData.activity;
      this.sleepData = mockHealthData.sleep;
      this.heartRateData = mockHealthData.heartRate;
      
      // Store cached data
      this.saveCachedData();
      
      // Update last synced time
      this.lastSyncedTime = new Date();
      localStorage.setItem('apple_health_last_synced', this.lastSyncedTime.toISOString());
      
      return true;
    } catch (error: any) {
      this.syncError = error.message || 'Failed to sync Apple Health data';
      console.error('Error syncing Apple Health data:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get activity data for a specific date range
   */
  public async getActivityData(startDate: string, endDate: string): Promise<AppleHealthActivityData[]> {
    // If no synced data, return cached data
    return this.activityData;
  }

  /**
   * Get sleep data for a specific date range
   */
  public async getSleepData(startDate: string, endDate: string): Promise<AppleHealthSleepData[]> {
    // If no synced data, return cached data
    return this.sleepData;
  }

  /**
   * Get heart rate data for a specific date range
   */
  public async getHeartRateData(startDate: string, endDate: string): Promise<AppleHealthHeartRateData[]> {
    // If no synced data, return cached data
    return this.heartRateData;
  }

  /**
   * Clear all Apple Health data and sync status
   */
  public clearData(): void {
    this.activityData = [];
    this.sleepData = [];
    this.heartRateData = [];
    this.lastSyncedTime = null;
    this.syncError = null;
    
    // Clear local storage
    localStorage.removeItem('apple_health_activity_data');
    localStorage.removeItem('apple_health_sleep_data');
    localStorage.removeItem('apple_health_heart_rate_data');
    localStorage.removeItem('apple_health_last_synced');
  }

  /**
   * Save cached data to localStorage
   */
  private saveCachedData(): void {
    localStorage.setItem('apple_health_activity_data', JSON.stringify(this.activityData));
    localStorage.setItem('apple_health_sleep_data', JSON.stringify(this.sleepData));
    localStorage.setItem('apple_health_heart_rate_data', JSON.stringify(this.heartRateData));
  }

  /**
   * Load cached data from localStorage
   */
  private loadCachedData(): void {
    const activityDataStr = localStorage.getItem('apple_health_activity_data');
    const sleepDataStr = localStorage.getItem('apple_health_sleep_data');
    const heartRateDataStr = localStorage.getItem('apple_health_heart_rate_data');

    if (activityDataStr) {
      try {
        this.activityData = JSON.parse(activityDataStr);
      } catch (e) {
        console.error('Error parsing cached Apple Health activity data', e);
      }
    }

    if (sleepDataStr) {
      try {
        this.sleepData = JSON.parse(sleepDataStr);
      } catch (e) {
        console.error('Error parsing cached Apple Health sleep data', e);
      }
    }

    if (heartRateDataStr) {
      try {
        this.heartRateData = JSON.parse(heartRateDataStr);
      } catch (e) {
        console.error('Error parsing cached Apple Health heart rate data', e);
      }
    }
  }
}
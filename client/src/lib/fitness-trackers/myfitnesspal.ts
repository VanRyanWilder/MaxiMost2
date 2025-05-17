/**
 * MyFitnessPal API Integration
 * 
 * This file handles authentication and data retrieval from the MyFitnessPal API
 * for nutrition and calorie tracking
 */

// Types for MyFitnessPal data
export interface MyFitnessPalAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface MyFitnessPalFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingAmount: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MyFitnessPalNutritionData {
  date: string;
  goalCalories: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: {
    breakfast: MyFitnessPalFoodItem[];
    lunch: MyFitnessPalFoodItem[];
    dinner: MyFitnessPalFoodItem[];
    snack: MyFitnessPalFoodItem[];
  };
}

export interface MyFitnessPalWaterData {
  date: string;
  goalAmount: number; // in milliliters
  actualAmount: number; // in milliliters
}

export interface MyFitnessPalWeight {
  date: string;
  weight: number; // in kilograms
}

export class MyFitnessPalService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;

  constructor() {
    this.clientId = import.meta.env.VITE_MYFITNESSPAL_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_MYFITNESSPAL_CLIENT_SECRET || '';
    this.redirectUri = `${window.location.origin}/fitness-tracker/myfitnesspal/callback`;
    
    // Load tokens from localStorage if available
    this.loadTokens();
  }

  /**
   * Check if we have valid MyFitnessPal credentials
   */
  public isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Check if the user is currently authenticated with MyFitnessPal
   */
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken && Date.now() < this.expiresAt);
  }

  /**
   * Generate the MyFitnessPal OAuth authorization URL
   */
  public getAuthUrl(): string {
    const scope = 'diary meals water';
    const state = this.generateRandomState();
    
    // Store state for verification when the user returns
    localStorage.setItem('myfitnesspal_auth_state', state);
    
    return `https://auth.myfitnesspal.com/oauth2/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  }

  /**
   * Handle the OAuth callback from MyFitnessPal
   * This should be called when the user is redirected back from MyFitnessPal
   */
  public async handleAuthCallback(code: string, state: string): Promise<boolean> {
    // Verify state to prevent CSRF attacks
    const savedState = localStorage.getItem('myfitnesspal_auth_state');
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
      console.error('Failed to authenticate with MyFitnessPal:', error);
      return false;
    }
  }

  /**
   * Fetch nutrition data for a specific date range
   */
  public async getNutritionData(startDate: string, endDate: string): Promise<MyFitnessPalNutritionData[]> {
    await this.ensureValidToken();
    
    try {
      const nutritionData: MyFitnessPalNutritionData[] = [];
      
      // Convert dates to Date objects for iteration
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Fetch data for each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        const dayData = await this.fetchDayNutritionData(formattedDate);
        nutritionData.push(dayData);
      }
      
      return nutritionData;
    } catch (error) {
      console.error('Failed to fetch MyFitnessPal nutrition data:', error);
      throw error;
    }
  }

  /**
   * Fetch water consumption data for a specific date range
   */
  public async getWaterData(startDate: string, endDate: string): Promise<MyFitnessPalWaterData[]> {
    await this.ensureValidToken();
    
    try {
      const waterData: MyFitnessPalWaterData[] = [];
      
      // Convert dates to Date objects for iteration
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Fetch data for each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        const dayData = await this.fetchDayWaterData(formattedDate);
        waterData.push(dayData);
      }
      
      return waterData;
    } catch (error) {
      console.error('Failed to fetch MyFitnessPal water data:', error);
      throw error;
    }
  }

  /**
   * Fetch weight data for a specific date range
   */
  public async getWeightData(startDate: string, endDate: string): Promise<MyFitnessPalWeight[]> {
    await this.ensureValidToken();
    
    try {
      // MyFitnessPal API endpoint for weight data
      const url = `https://api.myfitnesspal.com/v2/measurements/weight?from=${startDate}&to=${endDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`MyFitnessPal API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the weight data
      return data.items.map((item: any) => ({
        date: item.date,
        weight: item.value
      }));
    } catch (error) {
      console.error('Failed to fetch MyFitnessPal weight data:', error);
      throw error;
    }
  }

  /**
   * Log out the user from MyFitnessPal by clearing tokens
   */
  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    // Remove from localStorage
    localStorage.removeItem('myfitnesspal_access_token');
    localStorage.removeItem('myfitnesspal_refresh_token');
    localStorage.removeItem('myfitnesspal_expires_at');
    localStorage.removeItem('myfitnesspal_auth_state');
  }

  // Private helper methods

  /**
   * Exchange the authorization code for access and refresh tokens
   */
  private async exchangeCodeForToken(code: string): Promise<MyFitnessPalAuthResponse> {
    // Due to CORS restrictions, we need to handle token exchange on the server
    const response = await fetch('/api/fitness-trackers/myfitnesspal/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
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
        const response = await fetch('/api/fitness-trackers/myfitnesspal/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
            clientId: this.clientId,
            clientSecret: this.clientSecret
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
        console.error('Failed to refresh MyFitnessPal token:', error);
        // Clear tokens as they're no longer valid
        this.logout();
        throw new Error('Authentication expired. Please log in again.');
      }
    } else if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with MyFitnessPal. Please log in.');
    }
  }

  /**
   * Fetch nutrition data for a specific day
   */
  private async fetchDayNutritionData(date: string): Promise<MyFitnessPalNutritionData> {
    // MyFitnessPal API endpoint for diary data
    const url = `https://api.myfitnesspal.com/v2/diary?date=${date}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MyFitnessPal API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process and transform the nutrition data
    return this.processNutritionData(date, data);
  }

  /**
   * Fetch water data for a specific day
   */
  private async fetchDayWaterData(date: string): Promise<MyFitnessPalWaterData> {
    // MyFitnessPal API endpoint for water data
    const url = `https://api.myfitnesspal.com/v2/diary/water?date=${date}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MyFitnessPal API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      date,
      goalAmount: data.goal || 0,
      actualAmount: data.actual || 0
    };
  }

  /**
   * Process and format nutrition data from MyFitnessPal
   */
  private processNutritionData(date: string, data: any): MyFitnessPalNutritionData {
    // Implementation depends on the exact format of MyFitnessPal API responses
    // This is a simplified version that assumes a certain response structure
    
    const result: MyFitnessPalNutritionData = {
      date,
      goalCalories: data.goals?.calories || 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
      }
    };
    
    // Process meals and foods
    if (data.meals && Array.isArray(data.meals)) {
      for (const meal of data.meals) {
        const mealType = meal.name.toLowerCase();
        
        if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner' || mealType === 'snack') {
          // Process each food item in the meal
          if (meal.foods && Array.isArray(meal.foods)) {
            for (const food of meal.foods) {
              const foodItem: MyFitnessPalFoodItem = {
                name: food.name,
                calories: food.nutritionalContents?.energy?.value || 0,
                protein: food.nutritionalContents?.protein?.value || 0,
                carbs: food.nutritionalContents?.carbohydrates?.value || 0,
                fat: food.nutritionalContents?.fat?.value || 0,
                servingSize: food.servingSize?.name || 'serving',
                servingAmount: food.servingSize?.value || 1,
                mealType: mealType as any
              };
              
              // Add to appropriate meal array
              result.meals[mealType as keyof typeof result.meals].push(foodItem);
              
              // Update totals
              result.totalCalories += foodItem.calories;
              result.totalProtein += foodItem.protein;
              result.totalCarbs += foodItem.carbs;
              result.totalFat += foodItem.fat;
            }
          }
        }
      }
    }
    
    return result;
  }

  /**
   * Save tokens to localStorage
   */
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('myfitnesspal_access_token', this.accessToken);
    }
    
    if (this.refreshToken) {
      localStorage.setItem('myfitnesspal_refresh_token', this.refreshToken);
    }
    
    if (this.expiresAt) {
      localStorage.setItem('myfitnesspal_expires_at', this.expiresAt.toString());
    }
  }

  /**
   * Load tokens from localStorage
   */
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('myfitnesspal_access_token');
    this.refreshToken = localStorage.getItem('myfitnesspal_refresh_token');
    const expiresAt = localStorage.getItem('myfitnesspal_expires_at');
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
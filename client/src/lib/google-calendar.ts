/**
 * Google Calendar Integration Utility
 * 
 * This file contains functions for integrating with the Google Calendar API.
 * We need to use the Google Calendar API to:
 * 1. Authenticate the user
 * 2. Get the user's calendars
 * 3. Create events in the user's calendar
 */

// Required scopes for Google Calendar API
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

/**
 * Initialize Google Calendar API
 * This function loads the Google API client and initializes it
 */
export const initGoogleCalendar = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Add Google API script to the page if it doesn't exist
    if (!document.getElementById('google-api-script')) {
      const script = document.createElement('script');
      script.id = 'google-api-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Load the gapi client
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: process.env.VITE_GOOGLE_API_KEY,
            clientId: process.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: SCOPES.join(' ')
          }).then(() => {
            console.log('Google API initialized');
            resolve();
          }).catch((error: any) => {
            console.error('Error initializing Google API', error);
            reject(error);
          });
        });
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google API script', error);
        reject(error);
      };
      
      document.body.appendChild(script);
    } else {
      // Script already exists, so just check if the client is loaded
      if (window.gapi && window.gapi.client) {
        resolve();
      } else {
        // Wait for the client to load
        const checkGapi = setInterval(() => {
          if (window.gapi && window.gapi.client) {
            clearInterval(checkGapi);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGapi);
          reject(new Error('Timeout waiting for Google API to load'));
        }, 10000);
      }
    }
  });
};

/**
 * Sign in to Google Calendar
 * This function attempts to sign the user in to Google Calendar
 */
export const signInToGoogleCalendar = async (): Promise<boolean> => {
  try {
    await initGoogleCalendar();
    
    // Check if the user is already signed in
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      return true;
    }
    
    // Sign in
    await window.gapi.auth2.getAuthInstance().signIn();
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  } catch (error) {
    console.error('Error signing in to Google Calendar', error);
    return false;
  }
};

/**
 * Create a calendar event for a habit
 */
export const createHabitEvent = async (
  title: string,
  description: string, 
  startDate: Date,
  endDate: Date,
  recurringRule?: string // RRULE for recurring events (e.g. 'RRULE:FREQ=DAILY;COUNT=5')
): Promise<string | null> => {
  try {
    // Make sure the user is signed in
    const isSignedIn = await signInToGoogleCalendar();
    if (!isSignedIn) {
      throw new Error('User is not signed in to Google Calendar');
    }
    
    // Create event
    const event = {
      summary: title,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      reminders: {
        useDefault: true
      }
    };
    
    // Add recurrence rule if provided
    if (recurringRule) {
      event.recurrence = [recurringRule];
    }
    
    // Insert event
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    
    return response.result.id;
  } catch (error) {
    console.error('Error creating habit event', error);
    return null;
  }
};

/**
 * Generate a recurring rule based on habit frequency
 */
export const generateRecurringRule = (frequency: string): string => {
  switch (frequency) {
    case 'daily':
      return 'RRULE:FREQ=DAILY';
    case '2x-week':
      return 'RRULE:FREQ=WEEKLY;BYDAY=MO,TH';
    case '3x-week':
      return 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR';
    case '4x-week':
      return 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,TH,FR';
    case 'weekly':
      return 'RRULE:FREQ=WEEKLY';
    default:
      return '';
  }
};

// Add TypeScript declarations for gapi
declare global {
  interface Window {
    gapi: any;
  }
}
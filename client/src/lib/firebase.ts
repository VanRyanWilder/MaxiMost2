import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  // signInWithPopup, // Removed as no longer used
  signInWithRedirect, // Add this
  getRedirectResult,  // Add this
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInAnonymously as firebaseSignInAnonymously
} from "firebase/auth";

/// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // CORRECTED
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // CORRECTED
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // CORRECTED
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    // Changed from signInWithPopup to signInWithRedirect
    await signInWithRedirect(auth, googleProvider);
    // signInWithRedirect doesn't return a result directly here.
    // The result is obtained via getRedirectResult() when the app loads after redirect.
    // For consistency, we can return null or let onAuthStateChanged handle user setting.
    // However, the original function expected to return result.user.
    // This will now be handled by getRedirectResult and onAuthStateChanged.
    // So, this function might not need to return the user directly.
    // Or, it could trigger getRedirectResult if called after redirect, but that's unusual.
    // Let's simplify: this function now just initiates the redirect.
    return null; // Or void, but callers might expect a UserCredential-like object or null
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    // Changed from signInWithPopup to signInWithRedirect
    await signInWithRedirect(auth, facebookProvider);
    return null; // Result handled by getRedirectResult after redirect
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    // Changed from signInWithPopup to signInWithRedirect
    await signInWithRedirect(auth, appleProvider);
    return null; // Result handled by getRedirectResult after redirect
  } catch (error) {
    console.error("Error signing in with Apple:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with the display name
    if (result.user) {
      await updateProfile(result.user, {
        displayName: displayName
      });
    }
    
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Function to listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInAnonymously = async () => {
  try {
    const result = await firebaseSignInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    throw error;
  }
};
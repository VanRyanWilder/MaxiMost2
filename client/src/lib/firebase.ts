import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

// Firebase configuration with actual values
const firebaseConfig = {
  apiKey: "AIzaSyCh7wIPAQrncK-kbierYcUjfRFW2A09MOc",
  authDomain: "maximost-cf6e6.firebaseapp.com",
  projectId: "maximost-cf6e6",
  storageBucket: "maximost-cf6e6.appspot.com",
  appId: "1:413156369520:web:2120fdcdb298257bf380b5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const samsungProvider = new OAuthProvider('samsung.com');

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Apple:", error);
    throw error;
  }
};

export const signInWithSamsung = async () => {
  try {
    const result = await signInWithPopup(auth, samsungProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Samsung:", error);
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
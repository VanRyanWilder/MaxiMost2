import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithRedirect, // Use this for social logins
  getRedirectResult, // To process the result after redirect
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider, // For Apple
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously, // Use this for guest login
  User
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// --- FIX: Export the auth object so other parts of the app can use it ---
export const auth = getAuth(app);

// --- Social Login Functions ---

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const signInWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const signInWithApple = () => {
  const provider = new OAuthProvider('apple.com');
  return signInWithRedirect(auth, provider);
};

// --- Anonymous Login Function ---

export const signInAnonymously = async () => {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Anonymous sign-in failed", error);
    throw error;
  }
};

// --- Email and Auth State Functions ---

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Email sign-in failed", error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

// --- Function to process redirect result ---
export const processRedirectResult = () => {
  return getRedirectResult(auth);
};

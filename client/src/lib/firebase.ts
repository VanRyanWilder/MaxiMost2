import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously,
  User,
} from "firebase/auth";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase and export the auth instance.
// This is the simplest and most direct approach. The logic in user-context.tsx
// is now robust enough to handle any initialization timing.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// --- All helper functions remain the same ---

// Renamed to avoid potential conflicts or build tool confusion
export const listenToAuthChanges = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const processRedirectResult = () => {
  return getRedirectResult(auth);
};

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

export const signInAnonymously = async () => {
  const userCredential = await firebaseSignInAnonymously(auth);
  return userCredential.user;
};

export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUpWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

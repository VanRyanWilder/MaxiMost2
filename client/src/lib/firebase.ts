import { initializeApp, FirebaseApp } from "firebase/app";
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
  Auth,
} from "firebase/auth";

// --- Singleton Pattern to prevent re-initialization ---
let app: FirebaseApp;
let auth: Auth;

const getFirebase = () => {
  if (!app) {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    
    // Check if all config values are present to prevent initialization errors
    if (!firebaseConfig.apiKey) {
      throw new Error("VITE_FIREBASE_API_KEY is not defined. Firebase cannot be initialized.");
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return { app, auth };
};

// --- Exported Functions ---
// Each function now ensures Firebase is initialized before running.

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { auth } = getFirebase();
  return firebaseOnAuthStateChanged(auth, callback);
};

export const processRedirectResult = () => {
  const { auth } = getFirebase();
  return getRedirectResult(auth);
};

export const signInWithGoogle = () => {
  const { auth } = getFirebase();
  const provider = new GoogleAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const signInWithFacebook = () => {
  const { auth } = getFirebase();
  const provider = new FacebookAuthProvider();
  return signInWithRedirect(auth, provider);
};

export const signInWithApple = () => {
  const { auth } = getFirebase();
  const provider = new OAuthProvider('apple.com');
  return signInWithRedirect(auth, provider);
};

export const signInAnonymously = async () => {
  const { auth } = getFirebase();
  const userCredential = await firebaseSignInAnonymously(auth);
  return userCredential.user;
};

export const signInWithEmail = async (email, password) => {
  const { auth } = getFirebase();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUpWithEmail = async (email, password) => {
  const { auth } = getFirebase();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = () => {
  const { auth } = getFirebase();
  return firebaseSignOut(auth);
};

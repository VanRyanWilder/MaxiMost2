// shared/types/firestore.ts

// Assuming you'll have Firebase initialized and can import its types.
// If not, we can use a generic placeholder for Timestamp for now.
// For example, import { Timestamp } from "firebase/firestore";
// For this subtask, let's use a placeholder if firebase/firestore is not available.
type Timestamp = {
  toDate: () => Date;
  // Add other Timestamp properties if needed, or keep it simple
};

export interface FirestoreUser {
  email: string;
  displayName: string;
  createdAt: Timestamp; // Or firebase.firestore.Timestamp
  selectedCoach: "stoic" | "operator" | "nurturer" | string; // More specific types or just string
  premiumStatus: "free" | "premium" | string; // More specific types or just string
  lastLogin: Timestamp; // Or firebase.firestore.Timestamp
}

export interface FirestoreHabit {
  userId: string;
  title: string;
  description: string;
  category: string;
  createdAt: Timestamp; // Or firebase.firestore.Timestamp
  isActive: boolean;
  completions: Timestamp[]; // Or firebase.firestore.Timestamp[]
  isBadHabit: boolean;
  trigger?: string;
  replacementHabit?: string;
}

// shared/types/firestore.ts

// Assuming Timestamp is a type that can represent Firestore Timestamps.
// This might be admin.firestore.Timestamp on the backend,
// or a similar structure like { seconds: number, nanoseconds: number } on the client,
// or a Date object if transformed.
// For consistency with previous steps, we will use the placeholder from before,
// which includes toDate(). Real Firestore Timestamps also have seconds and nanoseconds.
export type FirestoreTimestamp = {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
  // Add other Timestamp properties if needed, or keep it simple
};

export interface FirestoreUser {
  email: string;
  displayName: string;
  createdAt: FirestoreTimestamp;
  selectedCoach: "stoic" | "operator" | "nurturer" | string;
  premiumStatus: "free" | "premium" | string;
  lastLogin: FirestoreTimestamp;
}

// New interface for the structure of objects within the completions array
export interface HabitCompletionEntry {
  date: string; // YYYY-MM-DD
  value: number; // 1 for binary, actual value for quantitative
  timestamp: FirestoreTimestamp; // Server timestamp of the log
}

export interface FirestoreHabit {
  habitId?: string; // Optional because it is not present before document creation in Firestore
  userId: string;
  title: string;
  description?: string; // Make optional as per common practice, can be empty string
  category: string;
  createdAt: FirestoreTimestamp; // Or FieldValue.serverTimestamp() before creation
  isActive: boolean;

  // New fields for V1.1
  type: "binary" | "quantitative";
  targetValue?: number; // Optional, only for quantitative
  targetUnit?: string;  // Optional, only for quantitative

  completions: HabitCompletionEntry[]; // Updated structure for completions

  isBadHabit: boolean;
  trigger?: string;
  replacementHabit?: string;

  // Fields that were present in client-side Habit type, ensure they map or are handled
  icon?: string;
  iconColor?: string;
  impact?: number;
  effort?: number;
  timeCommitment?: string;
  frequency?: string; // E.g., "daily", "3x-week". Consider if this is still needed with new completion logic. For now, keep.
  isAbsolute?: boolean; // Keep for now.
  streak?: number; // Keep for now, though calculation logic might change.
}

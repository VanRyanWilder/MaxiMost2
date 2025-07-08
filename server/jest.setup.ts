// jest.setup.ts
// dotenv loading moved to jest.config.js

import { jest } from '@jest/globals'; // Use this for explicit Jest globals if needed, or rely on global environment

// Define the mock implementations
const mockAuth = {
  verifyIdToken: jest.fn(),
  // Add any other auth functions you use, e.g., getUser: jest.fn()
};

const mockFieldValue = {
  serverTimestamp: jest.fn(() => new Date().toISOString()),
  delete: jest.fn(() => 'MOCK_FIELD_DELETE'), // Used to check if delete is called
};

const mockDocResult = {
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
};

const mockCollectionResult = {
  doc: jest.fn(() => mockDocResult),
  where: jest.fn().mockReturnThis(), // Return this for chaining where clauses
  get: jest.fn(),                   // For collection.get()
  add: jest.fn(),
};

const mockFirestore = {
  collection: jest.fn(() => mockCollectionResult),
  doc: jest.fn(() => mockDocResult), // For db.doc() directly if used
  FieldValue: mockFieldValue, // Static properties like FieldValue
  // Add batch, runTransaction etc. if you use them
};

// Apply the mock
jest.mock('firebase-admin', () => {
  const actualFirebaseAdmin = jest.requireActual('firebase-admin'); // Get actual for non-mocked parts if any

  // Our mock Firestore instance that is returned by admin.firestore()
  const mockFirestoreInstance = {
    collection: jest.fn(() => mockCollectionResult),
    doc: jest.fn(() => mockDocResult),
    // Add batch, runTransaction etc. if you use them on the instance
  };

  return {
    __esModule: true,
    initializeApp: jest.fn(),
    auth: jest.fn(() => mockAuth),
    // admin.firestore is a function that returns a Firestore instance,
    // but it also has static properties like FieldValue.
    firestore: Object.assign(
      jest.fn(() => mockFirestoreInstance), // admin.firestore() returns the instance
      {
        FieldValue: mockFieldValue, // admin.firestore.FieldValue
        // Add other static properties of admin.firestore if needed (e.g., Timestamp)
        // Timestamp: actualFirebaseAdmin.firestore.Timestamp, // Removed to avoid circular type issue
      }
    ),
    // default: jest.fn(() => ({ // if app was using default import
    //   initializeApp: jest.fn(),
    //   auth: jest.fn(() => mockAuth),
    //   firestore: Object.assign(
    //     jest.fn(() => mockFirestoreInstance),
    //     { FieldValue: mockFieldValue }
    //   ),
    // })),
  };
});

console.log('Firebase Admin SDK has been mocked for Jest (final refinement).');

# Firestore Indexing Considerations for Maximost (V1.1)

This document outlines necessary Firestore indexes for the Maximost application based on the defined API endpoints and data schema (Version 1.1).

## Habits Collection (`habits`)

### Index: User Habits Query (Primary)

This index remains crucial for efficiently querying active habits for a specific user, as required by the `GET /api/habits` endpoint.

*   **Collection:** `habits`
*   **Fields to Index:**
    1.  `userId` (Ascending) - To filter habits by the user.
    2.  `isActive` (Ascending/Descending) - To filter by active status.
    3.  `createdAt` (Descending) - To sort habits by creation date (newest first is a common default).

*   **Query Scope:** Collection

**Example Firestore Console Configuration:**

*   Collection ID: `habits`
*   Fields:
    *   `userId` ASC
    *   `isActive` ASC (or DESC)
    *   `createdAt` DESC

**Reasoning:**

This index allows Firestore to quickly find all documents in the `habits` collection that match a specific `userId` and `isActive` status, and then sort them by `createdAt`. Without this index, queries would be slow and costly.

### Considerations for `completions` Array (V1.1 Update)

The `completions` field in the `habits` collection is now an array of objects, each containing `date` (string YYYY-MM-DD), `value` (number), and `timestamp` (FirestoreTimestamp).

**Current API Write Operations:**

*   The `POST /api/habits/{habitId}/complete` endpoint involves adding or updating a completion entry within a specific habit document. The backend logic for this will typically involve:
    1.  Reading the target habit document by its ID (which is efficient).
    2.  Modifying the `completions` array in server-side memory (finding an entry for a specific date, then updating its value or adding a new entry).
    3.  Writing the entire habit document (with the modified `completions` array) back to Firestore.
*   These read-modify-write operations on a single document do **not** typically require specific Firestore indexes on the fields within the `completions` array (e.g., `completions.date`).

**Future Querying Needs (Potential Indexes):**

*   Currently, there are no API endpoints that require querying habits based on the content of the `completions` array across multiple habits (e.g., "fetch all habits completed on date X" or "fetch habits where a completion value was Y").
*   If such query patterns become necessary in the future, specific indexing strategies for arrays of objects might be needed. This could involve:
    *   Using `array-contains` if querying for exact matches of entire objects within the array (less flexible for partial matches like just date).
    *   Denormalizing some completion data into separate top-level fields or a subcollection if complex filtering and sorting on completion data is required across the main `habits` collection.
*   For the MVP scope defined in V1.1, no additional indexes for the `completions` array appear to be immediately required by the specified API endpoints. The primary index on `userId`, `isActive`, and `createdAt` remains the most important.

**General Note on Firestore Indexes:**
Firestore automatically creates single-field indexes. Composite indexes, like the "User Habits Query" index, must be created manually. Always test query performance and consult Firestore documentation as data grows and query patterns evolve.

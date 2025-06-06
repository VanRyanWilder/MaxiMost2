# Firestore Indexing Considerations for Maximost

This document outlines necessary Firestore indexes for the Maximost application based on the defined API endpoints and data schema.

## Habits Collection (`habits`)

To efficiently query habits for a specific user, as required by the `GET /api/habits` endpoint (which fetches all active habits for the authenticated user), a composite index is needed on the `habits` collection.

### Index: User Habits Query

*   **Collection:** `habits`
*   **Fields to Index:**
    1.  `userId` (Ascending) - To filter habits by the user.
    2.  `isActive` (Ascending/Descending) - To filter by active status (the API fetches active habits).
    3.  `createdAt` (Descending) - To sort habits by creation date (newest first is a common default). Alternatively, (Ascending) if an older-first sort is preferred. This field is optional for the query to work but good for ordering.

*   **Query Scope:** Collection

**Example Firestore Console Configuration:**

*   Collection ID: `habits`
*   Fields:
    *   `userId` ASC
    *   `isActive` ASC (or DESC, depending on how you typically filter)
    *   `createdAt` DESC

**Reasoning:**

This index allows Firestore to quickly find all documents in the `habits` collection that match a specific `userId` and `isActive` status, and then sort them by `createdAt`. Without this index, Firestore would have to scan all documents in the `habits` collection for each query, which would be slow and costly, especially as the number of habits grows.

**Note:**

The `GET /api/habits` endpoint specifically mentions fetching *active* habits. Therefore, including `isActive` in the index is beneficial. If queries also need to fetch inactive habits or all habits regardless of status for a user, `isActive` might be omitted from the primary index, or additional indexes might be created. For the current MVP scope (fetching active habits), this index is appropriate.

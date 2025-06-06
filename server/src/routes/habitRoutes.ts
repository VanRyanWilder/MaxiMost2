import { Router } from "express";
import { db } from "../config/firebaseAdmin"; // Path to firebaseAdmin.ts
import { protectWithFirebase, AuthenticatedRequest } from "../middleware/authMiddleware"; // Path to authMiddleware.ts
import { FirestoreHabit } from "../../../shared/types/firestore"; // Adjusted path to shared types
import * as admin from "firebase-admin"; // Import admin for FieldValue

const router = Router();

// GET /api/habits - Fetch all active habits for the authenticated user
router.get("/", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ message: "User ID not found in token." });

    const habitsSnapshot = await db
      .collection("habits")
      .where("userId", "==", userId)
      .where("isActive", "==", true)
      .get();

    if (habitsSnapshot.empty) return res.status(200).json([]);

    const habits: Partial<FirestoreHabit>[] = habitsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { habitId: doc.id, ...data } as FirestoreHabit;
    });
    res.status(200).json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    if (error instanceof Error) res.status(500).json({ message: "Error fetching habits.", error: error.message });
    else res.status(500).json({ message: "Error fetching habits.", error: "An unknown error occurred." });
  }
});

// POST /api/habits - Create a new habit for the authenticated user
router.post("/", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ message: "User ID not found in token." });

    const { title, description, category, isBadHabit, trigger, replacementHabit } = req.body;
    if (!title || !category) return res.status(400).json({ message: "Missing required fields: title and category." });

    const newHabitData: Omit<FirestoreHabit, "habitId"> = {
      userId,
      title,
      description: description || "",
      category,
      createdAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
      isActive: true,
      completions: [],
      isBadHabit: isBadHabit || false,
    };
    if (isBadHabit) {
      if (trigger) newHabitData.trigger = trigger;
      if (replacementHabit) newHabitData.replacementHabit = replacementHabit;
    }

    const habitRef = await db.collection("habits").add(newHabitData);
    const newHabitDoc = await habitRef.get();
    const newHabit = { habitId: newHabitDoc.id, ...newHabitDoc.data() } as FirestoreHabit;
    res.status(201).json(newHabit);
  } catch (error) {
    console.error("Error creating habit:", error);
    if (error instanceof Error) res.status(500).json({ message: "Error creating habit.", error: error.message });
    else res.status(500).json({ message: "Error creating habit.", error: "An unknown error occurred." });
  }
});

// POST /api/habits/:habitId/complete - Mark a habit as complete for the current day
router.post("/:habitId/complete", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    const { habitId } = req.params;

    if (!userId) return res.status(400).json({ message: "User ID not found in token." });
    if (!habitId) return res.status(400).json({ message: "Habit ID not provided in path." });

    const habitRef = db.collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const habitData = habitDoc.data() as FirestoreHabit;
    if (habitData.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: User does not own this habit." });
    }

    await habitRef.update({
      completions: admin.firestore.FieldValue.arrayUnion(admin.firestore.FieldValue.serverTimestamp())
    });
    res.status(200).json({ habitId: habitId, message: "Habit marked as complete." });
  } catch (error) {
    console.error(`Error completing habit ${req.params.habitId}:`, error);
    if (error instanceof Error) res.status(500).json({ message: "Error completing habit.", error: error.message });
    else res.status(500).json({ message: "Error completing habit.", error: "An unknown error occurred." });
  }
});

// DELETE /api/habits/:habitId - Archive a habit (set isActive to false)
router.delete("/:habitId", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    const { habitId } = req.params;

    if (!userId) return res.status(400).json({ message: "User ID not found in token." });
    if (!habitId) return res.status(400).json({ message: "Habit ID not provided in path." });

    const habitRef = db.collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const habitData = habitDoc.data() as FirestoreHabit;
    if (habitData.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: User does not own this habit." });
    }

    // Archive the habit by setting isActive to false
    await habitRef.update({
      isActive: false
    });

    res.status(200).json({ habitId: habitId, message: "Habit archived successfully." });
    // As per spec, a 204 No Content might be more appropriate for DELETE.
    // res.status(204).send();
  } catch (error) {
    console.error(`Error archiving habit ${req.params.habitId}:`, error);
    if (error instanceof Error) res.status(500).json({ message: "Error archiving habit.", error: error.message });
    else res.status(500).json({ message: "Error archiving habit.", error: "An unknown error occurred." });
  }
});

export default router;

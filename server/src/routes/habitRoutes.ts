import { Router } from "express";
import { db } from "../config/firebaseAdmin";
import { protectWithFirebase, AuthenticatedRequest } from "../middleware/authMiddleware";
import { FirestoreHabit, HabitCompletionEntry, FirestoreTimestamp } from "../../../shared/types/firestore";
import * as admin from "firebase-admin";

const router = Router();

const getCurrentDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET /api/habits - Fetch all active habits for the authenticated user (V1.1)
router.get("/", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ message: "User ID not found in token." });
    const habitsSnapshot = await db.collection("habits").where("userId", "==", userId).where("isActive", "==", true).get();
    if (habitsSnapshot.empty) return res.status(200).json([]);
    const habits: FirestoreHabit[] = habitsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { /* ... mapping ... */
        habitId: doc.id, userId: data.userId, title: data.title, description: data.description,
        category: data.category, createdAt: data.createdAt, isActive: data.isActive,
        type: data.type, targetValue: data.targetValue, targetUnit: data.targetUnit,
        completions: (data.completions || []).map((comp: any) => ({ date: comp.date, value: comp.value, timestamp: comp.timestamp })),
        isBadHabit: data.isBadHabit, trigger: data.trigger, replacementHabit: data.replacementHabit,
        icon: data.icon, iconColor: data.iconColor, impact: data.impact, effort: data.effort,
        timeCommitment: data.timeCommitment, frequency: data.frequency, isAbsolute: data.isAbsolute, streak: data.streak,
      } as FirestoreHabit;
    });
    res.status(200).json(habits);
  } catch (error) { /* ... error handling ... */
    console.error("Error fetching habits:", error);
    if (error instanceof Error) res.status(500).json({ message: "Error fetching habits.", error: error.message });
    else res.status(500).json({ message: "Error fetching habits.", error: "An unknown error occurred." });
  }
});

// POST /api/habits - Create a new habit (V1.1)
router.post("/", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(400).json({ message: "User ID not found in token." });
    const { /* ... destructuring ... */
      title, category, type, description, targetValue, targetUnit, isBadHabit, trigger, replacementHabit,
      icon, iconColor, impact, effort, timeCommitment, frequency, isAbsolute,
    } = req.body;
    if (!title || !category || !type) return res.status(400).json({ message: "Missing required fields." });
    if (type !== "binary" && type !== "quantitative") return res.status(400).json({ message: "Invalid type." });
    if (type === "quantitative" && (typeof targetValue !== "number" || !targetUnit)) return res.status(400).json({ message: "Quantitative habits require targetValue and targetUnit." });

    const newHabitData: Omit<FirestoreHabit, "habitId"> = { /* ... data construction ... */
      userId, title, description: description || "", category,
      createdAt: admin.firestore.FieldValue.serverTimestamp() as FirestoreTimestamp,
      isActive: true, type, completions: [], isBadHabit: isBadHabit || false,
      ...(type === "quantitative" && { targetValue, targetUnit }),
      ...(isBadHabit && { trigger, replacementHabit }),
      icon: icon || "default-icon", iconColor: iconColor || "default-color",
      impact: impact || 0, effort: effort || 0, timeCommitment: timeCommitment || "N/A",
      frequency: frequency || "daily", isAbsolute: typeof isAbsolute === "boolean" ? isAbsolute : false,
      streak: 0,
    };
    const habitRef = await db.collection("habits").add(newHabitData);
    const newHabitDoc = await habitRef.get();
    const newHabit = { habitId: newHabitDoc.id, ...newHabitDoc.data() } as FirestoreHabit;
    res.status(201).json(newHabit);
  } catch (error) { /* ... error handling ... */
    console.error("Error creating habit:", error);
    if (error instanceof Error) res.status(500).json({ message: "Error creating habit.", error: error.message });
    else res.status(500).json({ message: "Error creating habit.", error: "An unknown error occurred." });
  }
});

// POST /api/habits/:habitId/complete - Mark a habit as complete for the current day (V1.1)
router.post("/:habitId/complete", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    const { habitId } = req.params;
    const { value } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    if (!habitId) return res.status(400).json({ message: "Habit ID not provided." });
    if (typeof value !== "number") return res.status(400).json({ message: "Invalid value." });

    const habitRef = db.collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();
    if (!habitDoc.exists) return res.status(404).json({ message: "Habit not found." });
    const habitData = habitDoc.data() as FirestoreHabit;
    if (habitData.userId !== userId) return res.status(403).json({ message: "Forbidden." });

    const currentDateStr = getCurrentDateString();
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp() as FirestoreTimestamp;
    let completions: HabitCompletionEntry[] = habitData.completions || [];
    const existingCompletionIndex = completions.findIndex(c => c.date === currentDateStr);

    if (existingCompletionIndex !== -1) {
      completions[existingCompletionIndex].value = value;
      completions[existingCompletionIndex].timestamp = serverTimestamp;
    } else {
      completions.push({ date: currentDateStr, value: value, timestamp: serverTimestamp });
    }
    await habitRef.update({ completions });
    res.status(200).json({ habitId: habitId, message: "Habit completion logged successfully." });
  } catch (error) { /* ... error handling ... */
    console.error(`Error completing habit ${req.params.habitId}:`, error);
    if (error instanceof Error) res.status(500).json({ message: "Error completing habit.", error: error.message });
    else res.status(500).json({ message: "Error completing habit.", error: "An unknown error occurred." });
  }
});

// DELETE /api/habits/:habitId - Archive a habit (set isActive to false) (V1.1 - Unchanged logic)
router.delete("/:habitId", protectWithFirebase, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.uid;
    const { habitId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found in token." });
    }
    if (!habitId) {
      return res.status(400).json({ message: "Habit ID not provided in path." });
    }

    const habitRef = db.collection("habits").doc(habitId);
    const habitDoc = await habitRef.get();

    if (!habitDoc.exists) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const habitData = habitDoc.data() as FirestoreHabit; // FirestoreHabit is now V1.1
    if (habitData.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: User does not own this habit." });
    }

    await habitRef.update({
      isActive: false
    });

    res.status(200).json({ habitId: habitId, message: "Habit archived successfully." });
    // Or: res.status(204).send();

  } catch (error) {
    console.error(`Error archiving habit ${req.params.habitId}:`, error);
    if (error instanceof Error) {
        res.status(500).json({ message: "Error archiving habit.", error: error.message });
    } else {
        res.status(500).json({ message: "Error archiving habit.", error: "An unknown error occurred." });
    }
  }
});

export default router;

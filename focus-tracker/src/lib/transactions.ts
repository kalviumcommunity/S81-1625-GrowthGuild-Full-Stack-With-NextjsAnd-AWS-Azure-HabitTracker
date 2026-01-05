import { prisma } from "./prisma";

export async function transactionDemo() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: create habit
      const habit = await tx.habit.create({
        data: {
          title: "Transaction Test Habit",
          frequency: "daily",
          userId: 1, // make sure user with id=1 exists
        },
      });

      // ❌ Uncomment this line to test rollback
      // throw new Error("Force rollback");

      // Step 2: create habit log
      const log = await tx.habitLog.create({
        data: {
          habitId: habit.id,
          date: new Date(),
          completed: false,
        },
      });

      return { habit, log };
    });

    console.log("✅ Transaction success:", result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Transaction failed. Rolled back.", message);
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats?userId=1
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // 1. Get all active habits for the user
    const habits = await prisma.habit.findMany({
      where: {
        userId: userIdNum,
        isActive: true,
      },
      include: {
        logs: {
          where: {
            date: {
              gte: startOfWeek,
              lt: tomorrow,
            },
          },
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Calculate today's stats
    const totalHabits = habits.length;
    const todayLogs = habits.map((habit) => {
      const todayLog = habit.logs.find((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
      });
      return {
        habitId: habit.id,
        title: habit.title,
        description: habit.description,
        completed: todayLog?.completed || false,
        logId: todayLog?.id || null,
      };
    });

    const completedToday = todayLogs.filter((h) => h.completed).length;

    // 3. Calculate weekly progress (last 7 days including today)
    const weeklyProgress = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      let completedOnDay = 0;
      habits.forEach((habit) => {
        const log = habit.logs.find((l) => {
          const logDate = new Date(l.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === date.getTime() && l.completed;
        });
        if (log) completedOnDay++;
      });

      weeklyProgress.push({
        day: dayNames[date.getDay()],
        date: date.toISOString().split("T")[0],
        completed: completedOnDay,
        total: totalHabits,
      });
    }

    // 4. Calculate streak (consecutive days with all habits completed)
    let currentStreak = 0;
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday

    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);

      let allCompleted = true;
      if (totalHabits === 0) break;

      for (const habit of habits) {
        const log = habit.logs.find((l) => {
          const logDate = new Date(l.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === dayStart.getTime() && l.completed;
        });
        if (!log) {
          allCompleted = false;
          break;
        }
      }

      if (allCompleted) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }

      // Safety limit
      if (currentStreak > 365) break;
    }

    // If today is complete, add to streak
    if (completedToday === totalHabits && totalHabits > 0) {
      currentStreak++;
    }

    // 5. Calculate weekly stats
    const weeklyCompleted = weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
    const weeklyTotal = weeklyProgress.reduce((sum, day) => sum + day.total, 0);
    const weeklyAverage = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

    // 6. Get recent activity (today's habits with timestamps)
    const recentActivity = todayLogs.map((habit) => ({
      habit: habit.title,
      habitId: habit.habitId,
      status: habit.completed ? "completed" : "pending",
      time: habit.completed ? "Completed" : "Pending",
    }));

    return NextResponse.json({
      success: true,
      data: {
        // Summary stats
        completedToday,
        totalHabits,
        currentStreak,
        weeklyAverage,
        weeklyCompleted,
        weeklyTotal,
        
        // Today's habits with completion status
        todayHabits: todayLogs,
        
        // Weekly chart data
        weeklyProgress,
        
        // Recent activity list
        recentActivity,
        
        // Last updated
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

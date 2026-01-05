import { prisma } from "./prisma";

// ❌ Inefficient: Over-fetching all relations
export async function inefficientQuery() {
  return await prisma.user.findMany({
    include: { habits: { include: { logs: true } } },
  });
}

// ✅ Optimized: Select only needed fields
export async function optimizedSelectQuery() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true },
  });
}

// ✅ Optimized: Pagination with skip/take
export async function paginatedQuery(page: number = 1, pageSize: number = 10) {
  return await prisma.habit.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
}

// ✅ Optimized: Batch insert with createMany
export async function batchCreateHabits(userId: number) {
  return await prisma.habit.createMany({
    data: [
      { title: "Morning Exercise", frequency: "daily", userId },
      { title: "Read 30 mins", frequency: "daily", userId },
      { title: "Weekly Review", frequency: "weekly", userId },
    ],
  });
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safeRedisGet, safeRedisSet } from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "users:list";

    // 1️⃣ Check cache (returns null if Redis unavailable)
    const cachedUsers = await safeRedisGet(cacheKey);

    if (cachedUsers) {
      console.log("⚡ Cache Hit");
      const users = JSON.parse(cachedUsers);
      return NextResponse.json({ success: true, data: users });
    }

    // 2️⃣ Cache miss or Redis unavailable → DB
    console.log("🐢 Cache Miss - Fetching from DB");
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 3️⃣ Store in Redis (TTL = 60s) - silently fails if unavailable
    await safeRedisSet(cacheKey, JSON.stringify(users), 60);

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "users:list";

    // 1️⃣ Check cache
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("⚡ Cache Hit");
      return NextResponse.json(JSON.parse(cachedUsers));
    }

    // 2️⃣ Cache miss → DB
    console.log("🐢 Cache Miss - Fetching from DB");
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    // 3️⃣ Store in Redis (TTL = 60s)
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

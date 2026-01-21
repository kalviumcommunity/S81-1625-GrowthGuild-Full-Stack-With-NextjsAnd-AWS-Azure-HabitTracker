import Redis from "ioredis";

let redis: Redis | null = null;
let redisConnected = false;
let initAttempted = false;

// Lazy initialization - only create Redis client when first needed
const getRedisClient = (): Redis | null => {
  if (initAttempted) return redis;
  initAttempted = true;

  try {
    const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 0, // No retries at all
      retryStrategy: () => null, // Never retry connection
      enableOfflineQueue: false, // Don't queue commands
      connectTimeout: 3000, // Quick timeout
      lazyConnect: false,
    });

    client.on("connect", () => {
      redisConnected = true;
      redis = client;
      console.log("✅ Redis connected");
    });

    client.on("error", () => {
      // Completely silent - Redis is optional
      redisConnected = false;
    });

    client.on("close", () => {
      redisConnected = false;
    });

    client.on("end", () => {
      redisConnected = false;
    });

    return client;
  } catch {
    // Redis creation failed - that's fine, it's optional
    return null;
  }
};

// Initialize on module load (but errors are silently ignored)
getRedisClient();

// Helper to check if Redis is available
export const isRedisAvailable = () => redisConnected && redis !== null;

// Safe Redis operations that won't throw if Redis is down
export const safeRedisGet = async (key: string): Promise<string | null> => {
  if (!redisConnected || !redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
};

export const safeRedisSet = async (
  key: string, 
  value: string, 
  expirySeconds?: number
): Promise<boolean> => {
  if (!redisConnected || !redis) return false;
  try {
    if (expirySeconds) {
      await redis.set(key, value, "EX", expirySeconds);
    } else {
      await redis.set(key, value);
    }
    return true;
  } catch {
    return false;
  }
};

export const safeRedisDel = async (key: string): Promise<boolean> => {
  if (!redisConnected || !redis) return false;
  try {
    await redis.del(key);
    return true;
  } catch {
    return false;
  }
};

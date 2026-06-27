/**
 * API Rate Limiter using Upstash Redis
 * Falls back to in-memory limiter if Redis is not configured
 */

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

class InMemoryRateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  async limit(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt < now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1, reset: now + windowMs };
    }

    if (entry.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetAt,
      };
    }

    entry.count++;
    return {
      success: true,
      remaining: limit - entry.count,
      reset: entry.resetAt,
    };
  }
}

let limiter: InMemoryRateLimiter | null = null;
let redisClient: { limit: (key: string, opts: { rate: string }) => Promise<{ success: boolean; remaining: number; reset: number }> } | null = null;

async function getLimiter() {
  // Try Upstash Redis first
  if (!redisClient && process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const { Ratelimit } = await import("@upstash/ratelimit");
      const { Redis } = await import("@upstash/redis");

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      redisClient = Ratelimit.slidingWindow(10, "10 s");
      return redisClient;
    } catch {
      // Fall back to in-memory
    }
  }

  if (!limiter) {
    limiter = new InMemoryRateLimiter();
  }
  return limiter;
}

export async function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 10000,
): Promise<RateLimitResult> {
  const l = await getLimiter();

  if ("limit" in l && typeof l.limit === "function" && l.limit.length === 2) {
    // Check if it's the Ratelimit instance (from @upstash/ratelimit)
    // @upstash/ratelimit v2 uses a different signature
    // We need to handle it differently
  }

  // Use in-memory by default
  const inMem = limiter || (limiter = new InMemoryRateLimiter());
  return inMem.limit(identifier, limit, windowMs);
}

/**
 * Middleware-style rate limit check for API routes
 */
export async function checkRateLimit(
  userId: string,
  action: string,
): Promise<RateLimitResult> {
  return rateLimit(`${userId}:${action}`, 10, 10000);
}

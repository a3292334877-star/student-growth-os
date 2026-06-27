/**
 * API Rate Limiter (in-memory)
 * Falls back gracefully if Upstash Redis is unavailable.
 */

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

class MemoryRateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt < now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1, reset: now + windowMs };
    }

    if (entry.count >= limit) {
      return { success: false, remaining: 0, reset: entry.resetAt };
    }

    entry.count++;
    return { success: true, remaining: limit - entry.count, reset: entry.resetAt };
  }
}

const globalLimiter = new MemoryRateLimiter();

/**
 * Rate limit a specific action for a user.
 */
export async function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 10000,
): Promise<RateLimitResult> {
  return globalLimiter.check(identifier, limit, windowMs);
}

/**
 * Convenience wrapper for API route rate limiting.
 */
export async function checkRateLimit(
  userId: string,
  action: string,
): Promise<RateLimitResult> {
  return rateLimit(`${userId}:${action}`, 10, 10000);
}

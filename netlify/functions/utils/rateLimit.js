// Simple in-memory rate limiter for Netlify functions
const rateLimit = new Map();

const RATE_LIMIT = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10 // 10 requests per minute per IP
};

export function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimit.get(ip) || [];

    // Clean up old requests outside the window
    const recentRequests = userRequests.filter(
        timestamp => now - timestamp < RATE_LIMIT.windowMs
    );

    if (recentRequests.length >= RATE_LIMIT.maxRequests) {
        return {
            allowed: false,
            retryAfter: Math.ceil((recentRequests[0] + RATE_LIMIT.windowMs - now) / 1000)
        };
    }

    // Add current request
    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);

    return { allowed: true };
}

export function getRateLimitHeaders(remaining, resetTime) {
    return {
        'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString()
    };
}

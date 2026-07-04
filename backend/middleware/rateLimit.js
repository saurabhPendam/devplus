/*
  middleware/rateLimit.js — lightweight request rate limiter.

  What problem does this solve?
  ──────────────────────────────────────────────────────────────
  Without this, someone could write a script that hammers our
  backend 1000 times/second, burning through our GitHub token
  quota and making the app unusable for everyone else.

  This middleware tracks how many requests each IP address has
  made in the last minute. If they exceed the limit, we send
  429 Too Many Requests.

  Why not use the 'express-rate-limit' npm package?
  We could — but building it ourselves is only 30 lines,
  teaches you how rate limiting works under the hood, and
  avoids adding another dependency. For production at scale
  you'd use Redis-backed rate limiting.

  How it works:
  - requests = Map { ip → [timestamp, timestamp, ...] }
  - On each request, add the current timestamp for that IP
  - Remove timestamps older than the window (1 minute)
  - If the count exceeds the limit, reject the request
*/

// Store: ip → array of request timestamps
const requests = new Map();

const WINDOW_MS = 60 * 1000;  // 1 minute window
const MAX_PER_WINDOW = 30;     // max 30 requests per IP per minute

function rateLimit(req, res, next) {
  // Use X-Forwarded-For when behind a proxy (Railway/Vercel), fall back to socket IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
           || req.socket.remoteAddress
           || 'unknown';

  const now  = Date.now();
  const hits  = requests.get(ip) || [];

  // Keep only timestamps within the current window
  const recent = hits.filter(t => now - t < WINDOW_MS);
  recent.push(now);
  requests.set(ip, recent);

  // Clean up the Map periodically to prevent memory leaks
  // (only do this 1% of the time to avoid slowing every request)
  if (Math.random() < 0.01) {
    for (const [key, times] of requests.entries()) {
      if (times.every(t => now - t >= WINDOW_MS)) {
        requests.delete(key);
      }
    }
  }

  if (recent.length > MAX_PER_WINDOW) {
    const resetIn = Math.ceil((recent[0] + WINDOW_MS - now) / 1000);
    res.set('Retry-After', resetIn);
    return res.status(429).json({
      error: `Too many requests. Slow down — try again in ${resetIn}s.`,
    });
  }

  // Attach rate limit info to response headers (standard practice)
  res.set('X-RateLimit-Limit',     MAX_PER_WINDOW);
  res.set('X-RateLimit-Remaining', MAX_PER_WINDOW - recent.length);

  next();
}

module.exports = { rateLimit };

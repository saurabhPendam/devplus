/*
  services/cache.js — in-memory response cache.

  Why cache GitHub responses?
  ─────────────────────────────────────────────────────────
  Every profile lookup fires 30+ HTTP requests to GitHub
  (1 profile + 1 repos + up to 30 language calls).

  Without a cache:
  - Searching "torvalds" twice burns 60+ API calls
  - A shared demo link could exhaust your hourly rate limit fast
  - Users wait 3–6 seconds every single time

  With a 5-minute cache:
  - Second lookup for the same username: instant (< 1ms)
  - GitHub API calls drop by ~90% in typical usage
  - Rate limit stays healthy

  We use node-cache — a simple key/value store that lives
  in the Node.js process memory and automatically expires
  entries after a TTL (time-to-live).

  Trade-off: cache lives in RAM and resets when the server
  restarts. That's fine for our use case — we don't need
  persistence across restarts, just within a session.
  Day 9 (deployment) could swap this for Redis if needed.
*/

const NodeCache = require('node-cache');

// TTL = 300 seconds (5 minutes)
// checkperiod = 60 seconds (how often expired keys are purged)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// ── Public API ──────────────────────────────────────────────

/*
  get(key) → value | undefined
  Returns the cached value, or undefined if missing/expired.
*/
function get(key) {
  return cache.get(key);
}

/*
  set(key, value)
  Stores a value under key with the default TTL.
*/
function set(key, value) {
  cache.set(key, value);
}

/*
  stats()
  Returns cache hit/miss/key counts — useful for the /health endpoint.
*/
function stats() {
  const s = cache.getStats();
  return {
    keys:   cache.keys().length,
    hits:   s.hits,
    misses: s.misses,
    // Hit rate as a percentage
    hitRate: s.hits + s.misses > 0
      ? Math.round((s.hits / (s.hits + s.misses)) * 100)
      : 0,
  };
}

/*
  invalidate(key)
  Manually evict a cached entry (useful if you add a "refresh" button).
*/
function invalidate(key) {
  cache.del(key);
}

module.exports = { get, set, stats, invalidate };

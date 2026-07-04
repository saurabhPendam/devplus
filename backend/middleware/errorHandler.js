/*
  middleware/errorHandler.js — centralised Express error handler.

  Express has a special 4-argument middleware signature:
    (err, req, res, next)
  When you call next(err) from any route or middleware,
  Express skips all normal middleware and jumps straight here.

  Why centralise error handling?
  ──────────────────────────────────────────────────────────────
  Without this, every route needs its own try/catch and its own
  logic for deciding which HTTP status code to send. That's:
  - Repetitive (copy-paste the same catch block everywhere)
  - Inconsistent (one route sends 500, another sends { message: ... })
  - Hard to change (update error format in 10 places)

  With a central handler:
  - Routes only need: try { ... } catch(err) { next(err) }
  - Error format is always consistent: { error: "message" }
  - HTTP status mapping lives in one place
  - Easy to add logging, Sentry, etc. later
*/

function errorHandler(err, req, res, _next) {
  // Log the full error in the server terminal (with timestamp + route)
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.path}`);
  console.error(`  Message: ${err.message}`);
  if (err.response) {
    // Axios error — GitHub API responded with an error
    console.error(`  GitHub status: ${err.response.status}`);
  }

  // ── Map known error types to HTTP status codes ──

  // GitHub user not found
  if (err.response?.status === 404) {
    return res.status(404).json({
      error: `GitHub user not found.`,
    });
  }

  // GitHub rate limit (403 = forbidden / token issue, 429 = rate limit)
  if (err.response?.status === 403 || err.response?.status === 429) {
    return res.status(429).json({
      error: 'GitHub API rate limit reached. Add a GITHUB_TOKEN to your .env for 5,000 req/hr.',
      retryAfter: err.response.headers['x-ratelimit-reset']
        ? new Date(err.response.headers['x-ratelimit-reset'] * 1000).toISOString()
        : null,
    });
  }

  // Network timeout — GitHub took too long
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return res.status(504).json({
      error: 'GitHub API is taking too long. Try again shortly.',
    });
  }

  // DNS / network unreachable
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Cannot reach GitHub API. Check your internet connection.',
    });
  }

  // Generic fallback — don't leak stack traces to the client
  res.status(500).json({
    error: 'Something went wrong on our end. Try again shortly.',
  });
}

module.exports = { errorHandler };

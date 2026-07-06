/*
  server.js — DevPulse backend entry point.

  Day 4 changes:
  ──────────────────────────────────────────────────────────────
  1. helmet() — adds 11 security HTTP headers in one line.
     e.g. X-Content-Type-Options, X-Frame-Options, etc.
     These protect against common web attacks at zero cost.

  2. morgan('dev') — structured HTTP request logging.
     Replaces our hand-rolled console.log middleware.
     Format: "GET /api/github/torvalds 200 1842ms"
     Much more useful than raw timestamps.

  3. rateLimit middleware on /api routes — protects against
     abuse without blocking legitimate users.

  4. errorHandler at the very end — Express requires error
     middleware to be registered AFTER all routes. The 4-arg
     signature (err, req, res, next) is what marks it as an
     error handler to Express.

  5. /health endpoint now includes cache stats + GitHub token
     status — useful for debugging on Railway after deploy.

  6. Graceful shutdown — catches SIGTERM (what Railway sends
     when stopping the container) and closes cleanly.
*/

const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const helmet       = require('helmet');
require('dotenv').config();

const githubRoutes   = require('./routes/github');
const { rateLimit }  = require('./middleware/rateLimit');
const { errorHandler } = require('./middleware/errorHandler');
const cache          = require('./services/cache');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security headers ────────────────────────────────────────
// helmet() sets headers like:
//   X-Content-Type-Options: nosniff
//   X-Frame-Options: SAMEORIGIN
//   Strict-Transport-Security: max-age=...
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────
// In development: allow localhost:3000
// In production: allow the Vercel frontend URL (set in CLIENT_URL env var)
// We also allow any *.vercel.app subdomain for preview deployments.
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (covers preview deployments)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods:     ['GET', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// ── Body parsing ────────────────────────────────────────────
app.use(express.json());

// ── HTTP request logging ─────────────────────────────────────
// 'combined' in production gives IP + user-agent — useful for Railway logs
// 'dev' locally gives coloured one-line output
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Rate limiting (API routes only) ─────────────────────────
// We only limit /api routes, not /health or static assets.
app.use('/api', rateLimit);

// ── Routes ──────────────────────────────────────────────────

// Health check — includes cache + token status for debugging
app.get('/health', (_req, res) => {
  res.json({
    status:      'ok',
    timestamp:   new Date().toISOString(),
    githubToken: process.env.GITHUB_TOKEN ? 'loaded' : 'missing',
    cache:       cache.stats(),
    uptime:      `${Math.floor(process.uptime())}s`,
  });
});

app.use('/api/github', githubRoutes);

// ── 404 for unknown routes ───────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Central error handler ────────────────────────────────────
// MUST come after all routes — Express identifies error handlers
// by their 4-argument signature: (err, req, res, next)
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log('');
  console.log('  ◈  DevPulse backend');
  console.log(`  →  http://localhost:${PORT}`);
  console.log(`  →  GitHub token : ${process.env.GITHUB_TOKEN ? '✓ loaded (5,000 req/hr)' : '✗ missing (60 req/hr)'}`);
  console.log(`  →  Cache        : in-memory, 5 min TTL`);
  console.log(`  →  Environment  : ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

// ── Graceful shutdown ────────────────────────────────────────
// Railway (and Docker) send SIGTERM when shutting down.
// We close the HTTP server gracefully before exiting,
// so in-flight requests can finish rather than being cut off.
process.on('SIGTERM', () => {
  console.log('\n[shutdown] SIGTERM received — closing server...');
  server.close(() => {
    console.log('[shutdown] Done.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  // Ctrl+C in development
  console.log('\n[shutdown] Stopping dev server...');
  process.exit(0);
});

module.exports = app; // exported for testing

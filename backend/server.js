/*
  server.js — DevPulse backend entry point.

  Stack: Node.js + Express
  
  Why a separate backend?
  - GitHub API has a rate limit of 60 req/hr for unauthenticated
    requests, but 5000/hr with a personal access token.
  - We CANNOT expose that token in React (client-side code is
    readable by anyone). So the token lives only on the server.
  - The same goes for the Anthropic API key (Day 5).
  
  This file sets up the Express server with middleware,
  a health-check route, and a placeholder user route.
  Real GitHub logic comes in Day 4.
*/

const express = require('express');
const cors    = require('cors');
require('dotenv').config();   // loads .env into process.env

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
// cors: allows our React app (localhost:3000) to call this server.
//       Without this the browser blocks cross-origin requests.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));

// express.json(): parses JSON request bodies automatically.
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────

// Health check — always useful to verify the server is alive.
// Try: curl http://localhost:5000/health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder — GitHub API integration arrives in Day 4.
app.get('/api/user/:username', (req, res) => {
  const { username } = req.params;
  res.json({
    message: `Day 4 will fetch real GitHub data for ${username}`,
    username,
  });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓  DevPulse backend → http://localhost:${PORT}`);
});

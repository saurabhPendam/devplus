/*
  routes/github.js — Day 5 upgrade.

  Changes vs Day 4:
  ──────────────────────────────────────────────────────────────
  The main GET /:username endpoint now also fetches:
    - recentEvents  → day-by-day commit counts (last 90 days)
    - topics        → aggregated repo topic tags
    - docQuality    → per-repo documentation score

  These run in parallel with the existing profile/repos fetch
  where possible, keeping total response time down.

  The assembled response payload now includes all Day 5 fields,
  cached as a single object under "response:<username>".
*/

const express              = require('express');
const router               = express.Router();
const { validateUsername } = require('../middleware/validate');
const cache                = require('../services/cache');
const {
  getUserProfile,
  getUserRepos,
  getLanguageStats,
  getContributionSummary,
  getRecentEvents,
  getTopics,
  getDocQuality,
  getRateLimitStatus,
} = require('../services/github');

// ── GET /api/github/:username ─────────────────────────────────
router.get('/:username', validateUsername, async (req, res, next) => {
  const username    = req.cleanUsername;
  const responseKey = `response:${username}`;
  const cached      = cache.get(responseKey);

  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json({ ...cached, fromCache: true });
  }

  res.set('X-Cache', 'MISS');

  try {
    const startTime = Date.now();
    console.log(`[github] Fetching full profile: ${username}`);

    // Wave 1 — profile, repos, events all at once (independent)
    const [profile, repos, events] = await Promise.all([
      getUserProfile(username),
      getUserRepos(username),
      getRecentEvents(username),
    ]);

    // Wave 2 — language stats depends on repos list
    const languages = await getLanguageStats(username, repos);

    // Wave 3 — pure computation, no API calls
    const summary    = getContributionSummary(repos);
    const topics     = getTopics(repos);
    const docQuality = getDocQuality(repos);

    const elapsed = Date.now() - startTime;
    console.log(`[github] Done in ${elapsed}ms for ${username}`);

    const payload = {
      profile,
      repos,
      languages,
      summary,
      events,
      topics,
      docQuality,
      fetchedAt: new Date().toISOString(),
      fromCache: false,
    };

    cache.set(responseKey, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/github/:username ──────────────────────────────
router.delete('/:username', validateUsername, (req, res) => {
  const username = req.cleanUsername;
  cache.invalidate(`response:${username}`);
  cache.invalidate(`profile:${username}`);
  cache.invalidate(`repos:${username}`);
  cache.invalidate(`events:${username}`);
  console.log(`[github] Cache cleared: ${username}`);
  res.json({ message: `Cache cleared for ${username}. Next request fetches fresh data.` });
});

// ── GET /api/github/meta/rate-limit ──────────────────────────
router.get('/meta/rate-limit', async (_req, res, next) => {
  try {
    res.json(await getRateLimitStatus());
  } catch (err) {
    next(err);
  }
});

module.exports = router;

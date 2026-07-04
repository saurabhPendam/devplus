/*
  utils/score.js — Developer score engine.

  Computes a 0–100 score entirely from public GitHub data.
  No AI needed — this is just math + heuristics.

  The score is broken into 4 dimensions, each worth 25 points:
    1. Activity     — how recently and frequently they push code
    2. Impact       — total stars across original repos
    3. Diversity    — breadth of languages used
    4. Consistency  — repo count and project upkeep

  Why do this in JS instead of on the backend?
  The data is already in the browser after the API call.
  Pure calculations with no I/O belong in utils, not on a server.
*/

// ── Helpers ────────────────────────────────────────────────

// Map a value from one range to another, then clamp 0–maxPts
function scale(value, inputMax, maxPts) {
  return Math.min(Math.round((value / inputMax) * maxPts), maxPts);
}

// ── Sub-scores ─────────────────────────────────────────────

function activityScore(repos) {
  const own = repos.filter(r => !r.isFork);
  const now = Date.now();

  // Count repos pushed within the last 90 days, 180 days, 365 days
  const d90  = own.filter(r => now - new Date(r.pushedAt) < 90  * 86400000).length;
  const d180 = own.filter(r => now - new Date(r.pushedAt) < 180 * 86400000).length;
  const d365 = own.filter(r => now - new Date(r.pushedAt) < 365 * 86400000).length;

  // Weight recent activity more heavily
  const raw = d90 * 3 + d180 * 1.5 + d365 * 0.5;
  return scale(raw, 30, 25); // 30 = "very active" ceiling
}

function impactScore(repos) {
  const own       = repos.filter(r => !r.isFork);
  const totalStars = own.reduce((s, r) => s + r.stars, 0);
  const totalForks = own.reduce((s, r) => s + r.forks, 0);
  // Stars worth more than forks
  return scale(totalStars * 1.5 + totalForks, 500, 25);
}

function diversityScore(languages) {
  if (!languages || languages.length === 0) return 0;
  const count = languages.length;
  // Reward knowing multiple languages but don't penalise focus
  const spread = count >= 5 ? 25 : scale(count, 5, 20);
  // Bonus: top language isn't overwhelming everything else
  const topPct = languages[0]?.percentage || 100;
  const balance = topPct < 60 ? 5 : topPct < 80 ? 3 : 0;
  return Math.min(spread + balance, 25);
}

function consistencyScore(repos, profile) {
  const own = repos.filter(r => !r.isFork);

  // Years on GitHub
  const years = (Date.now() - new Date(profile.createdAt)) / (365.25 * 86400000);
  // Repos per year (capped — quality > quantity)
  const reposPerYear = years > 0 ? own.length / years : own.length;

  // Has a bio, blog, location = cares about their profile
  const profileCompleteness =
    (profile.bio      ? 3 : 0) +
    (profile.blog     ? 2 : 0) +
    (profile.location ? 1 : 0) +
    (profile.company  ? 1 : 0);

  return Math.min(scale(reposPerYear, 12, 18) + profileCompleteness, 25);
}

// ── Main export ────────────────────────────────────────────

export function computeScore(profile, repos, languages) {
  const activity    = activityScore(repos);
  const impact      = impactScore(repos);
  const diversity   = diversityScore(languages);
  const consistency = consistencyScore(repos, profile);
  const total       = activity + impact + diversity + consistency;

  return {
    total,
    breakdown: { activity, impact, diversity, consistency },
    grade: gradeFromScore(total),
    label: labelFromScore(total),
  };
}

function gradeFromScore(n) {
  if (n >= 88) return 'S';
  if (n >= 75) return 'A';
  if (n >= 60) return 'B';
  if (n >= 42) return 'C';
  return 'D';
}

function labelFromScore(n) {
  if (n >= 88) return 'Exceptional';
  if (n >= 75) return 'Strong';
  if (n >= 60) return 'Solid';
  if (n >= 42) return 'Growing';
  return 'Getting started';
}

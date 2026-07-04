/*
  services/api.js — Day 4 update.

  Changes:
  1. refreshProfile() — calls DELETE /api/github/:username
     to bust the server cache, then re-fetches fresh data.

  2. fetchRateLimit() — calls the new /api/github/meta/rate-limit
     endpoint so we can show quota info in the UI.

  3. Both functions share the same BASE URL and error handling
     pattern as fetchProfile().
*/

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper — shared fetch + error-check logic
async function apiFetch(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// Fetch a full GitHub profile (uses server cache if available)
export async function fetchProfile(username) {
  return apiFetch(`/api/github/${username}`);
}

// Invalidate server cache for a username, then fetch fresh data
export async function refreshProfile(username) {
  // Step 1: bust the cache
  await apiFetch(`/api/github/${username}`, { method: 'DELETE' });
  // Step 2: fetch fresh (cache is now empty for this username)
  return apiFetch(`/api/github/${username}`);
}

// Check remaining GitHub API quota
export async function fetchRateLimit() {
  return apiFetch('/api/github/meta/rate-limit');
}

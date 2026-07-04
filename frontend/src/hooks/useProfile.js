/*
  hooks/useProfile.js — Day 4 update.

  New capabilities:
  1. refresh() function — calls refreshProfile() to bust the
     server cache and reload fresh data without navigating away.

  2. fromCache flag — surfaces in the UI so users know if they're
     seeing cached data (and can choose to refresh).

  3. The hook now returns { data, loading, error, refresh, fromCache }
     — additional fields don't break existing components because
     they just ignore the ones they don't need.
*/

import { useState, useEffect, useCallback } from 'react';
import { fetchProfile, refreshProfile } from '../services/api';

export function useProfile(username) {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [fromCache, setFromCache] = useState(false);

  // Core load function — reused by initial load and refresh
  const load = useCallback(async (forceRefresh = false) => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      // forceRefresh = true calls DELETE first, then re-fetches
      const result = forceRefresh
        ? await refreshProfile(username)
        : await fetchProfile(username);

      setData(result);
      setFromCache(result.fromCache ?? false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Load on mount and whenever username changes
  useEffect(() => {
    setData(null); // clear stale data from previous username
    load(false);
  }, [load]);

  // refresh() is exposed to components — call it to force reload
  const refresh = useCallback(() => load(true), [load]);

  return { data, loading, error, refresh, fromCache };
}

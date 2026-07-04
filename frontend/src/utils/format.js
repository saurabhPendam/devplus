/*
  utils/format.js — pure helper functions with no side effects.

  "Pure" means: same input always gives same output, no API calls,
  no state, nothing external. Easy to test, easy to reuse.
*/

// Language → colour mapping for the language bars.
// These are the official colours used by GitHub's linguist library.
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  'C++':      '#f34b7d',
  C:          '#555555',
  'C#':       '#178600',
  Ruby:       '#701516',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  PHP:        '#4F5D95',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  Dart:       '#00B4AB',
  Vue:        '#41b883',
  Scala:      '#c22d40',
  Haskell:    '#5e5086',
};

export function getLanguageColor(lang) {
  return LANGUAGE_COLORS[lang] || '#8b949e';
}

// Format a large number with k/m suffix: 12400 → "12.4k"
export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// "2019-05-12T00:00:00Z" → "May 2019"
export function formatMonthYear(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    year:  'numeric',
  });
}

// How long ago was this date? "3 years ago"
export function timeAgo(isoString) {
  if (!isoString) return '—';
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  const units = [
    { label: 'year',  secs: 31536000 },
    { label: 'month', secs: 2592000  },
    { label: 'day',   secs: 86400    },
    { label: 'hour',  secs: 3600     },
    { label: 'minute',secs: 60       },
  ];
  for (const { label, secs } of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

// Clamp a number between min and max
export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

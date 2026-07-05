/*
  utils/export.js — Day 8.

  All export/share logic lives here — no libraries, no dependencies.

  Three export formats:
  ─────────────────────────────────────────────────────────────
  1. Copy link    — navigator.clipboard (already in ShareCard)

  2. SVG card     — builds a self-contained SVG string entirely
                    from template literals. The SVG includes the
                    developer's avatar as a base64 data URL (fetched
                    via fetch + FileReader), their stats, top languages
                    as coloured dots, and score grade.
                    The user gets a .svg file they can embed in a README.

  3. PDF export   — injects a <link> print stylesheet into the DOM,
                    calls window.print(), then removes the stylesheet.
                    The print CSS (in index.css @media print) already
                    defines the page layout. This is zero-dependency,
                    works in every browser, and produces a clean PDF
                    through the browser's native PDF engine.

  Why no jsPDF or puppeteer?
  - Both require significant setup and bundle size
  - window.print() produces better typography because the browser
    renders the actual React component tree
  - jsPDF can't handle custom fonts or SVG charts well
  - This approach is what senior engineers use in internal tools
*/

import { getLanguageColor } from './format';

// ── 1. Fetch avatar as base64 data URL ───────────────────────
// We need base64 because SVG files can't reference external URLs
// (they'd show broken images when opened locally or in email).
export async function fetchAvatarBase64(url) {
  try {
    const resp   = await fetch(url);
    const blob   = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null; // fail gracefully — SVG renders without avatar
  }
}

// ── 2. Build SVG card string ─────────────────────────────────
export function buildSVGCard({ profile, score, languages, summary, avatarBase64 }) {
  const W = 640;
  const H = 320;

  // Grade colour map
  const gradeColor = {
    S: '#16a34a', A: '#2563eb', B: '#7c3aed', C: '#d97706', D: '#dc2626',
  }[score.grade] || '#6b7280';

  // Top 5 languages as coloured dots
  const topLangs = languages.slice(0, 5);

  // Escape XML special characters in text fields
  const esc = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const name     = esc(profile.name);
  const login    = esc(profile.login);
  const bio      = esc((profile.bio || '').slice(0, 72));
  const location = esc(profile.location || '');

  // Truncate bio with ellipsis if needed
  const bioDisplay = profile.bio && profile.bio.length > 72
    ? bio + '...'
    : bio;

  // Language dots row
  const langDots = topLangs.map((l, i) => `
    <circle cx="${340 + i * 22}" cy="188" r="7" fill="${esc(getLanguageColor(l.language))}" />
    <text x="${340 + i * 22}" y="204" text-anchor="middle" font-family="monospace" font-size="9" fill="#6b7280">${esc(l.language.slice(0,3))}</text>
  `).join('');

  // Stat columns
  const stats = [
    { label: 'Repos',   value: String(profile.publicRepos) },
    { label: 'Stars',   value: String(summary.totalStars)  },
    { label: 'Followers', value: String(profile.followers) },
  ];

  const statCols = stats.map((s, i) => `
    <text x="${340 + i * 90}" y="242" text-anchor="middle" font-family="monospace" font-size="20" font-weight="700" fill="#0f1623">${esc(s.value)}</text>
    <text x="${340 + i * 90}" y="258" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#9aa5b4">${esc(s.label)}</text>
  `).join('');

  // Avatar image element (or placeholder circle)
  const avatarEl = avatarBase64
    ? `<image href="${avatarBase64}" x="40" y="80" width="80" height="80" clip-path="url(#avatarClip)" />`
    : `<circle cx="80" cy="120" r="40" fill="#e2e5ef" />`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="avatarClip">
      <circle cx="80" cy="120" r="40" />
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#ffffff" rx="12" />
  <rect width="${W}" height="${H}" fill="none" stroke="#e2e5ef" stroke-width="1" rx="12" />

  <!-- Left accent bar -->
  <rect x="0" y="0" width="5" height="${H}" fill="${gradeColor}" rx="2" />

  <!-- Avatar -->
  ${avatarEl}
  <circle cx="80" cy="120" r="41" fill="none" stroke="#e2e5ef" stroke-width="1.5" />

  <!-- Name + login -->
  <text x="140" y="106" font-family="-apple-system, sans-serif" font-size="22" font-weight="700" fill="#0f1623">${name}</text>
  <text x="140" y="124" font-family="monospace" font-size="13" fill="#6b7280">@${login}</text>

  <!-- Bio -->
  <text x="140" y="148" font-family="-apple-system, sans-serif" font-size="12" fill="#4a5568">${bioDisplay}</text>

  <!-- Location -->
  ${location ? `<text x="140" y="166" font-family="-apple-system, sans-serif" font-size="11" fill="#9aa5b4">${location}</text>` : ''}

  <!-- Divider -->
  <line x1="32" y1="220" x2="${W - 32}" y2="220" stroke="#e2e5ef" stroke-width="1" />

  <!-- Grade badge -->
  <rect x="40" y="232" width="60" height="60" rx="8" fill="${gradeColor}" opacity="0.1" />
  <text x="70" y="272" text-anchor="middle" font-family="monospace" font-size="36" font-weight="800" fill="${gradeColor}">${esc(score.grade)}</text>

  <!-- Score number -->
  <text x="115" y="253" font-family="monospace" font-size="14" font-weight="700" fill="#0f1623">${score.total}<tspan font-size="11" fill="#9aa5b4">/100</tspan></text>
  <text x="115" y="270" font-family="monospace" font-size="11" fill="${gradeColor}">${esc(score.label)}</text>

  <!-- Language dots -->
  ${langDots}

  <!-- Stats -->
  ${statCols}

  <!-- Divider -->
  <line x1="32" y1="220" x2="${W - 32}" y2="220" stroke="#e2e5ef" stroke-width="1" />

  <!-- Footer -->
  <text x="${W - 32}" y="${H - 16}" text-anchor="end" font-family="monospace" font-size="10" fill="#c7cdd8">devpulse · github.com/${login}</text>
</svg>`;
}

// ── 3. Trigger SVG file download ─────────────────────────────
export function downloadSVG(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── 4. PDF export via window.print() ─────────────────────────
// We programmatically trigger the browser's print dialog with a
// print-specific stylesheet active. The @media print rules in
// index.css already define the clean PDF layout.
//
// We also inject a temporary <style> that sets @page size and
// hides the browser's default header/footer URLs.
export function exportPDF(username) {
  // Create a temporary stylesheet for this specific print
  const style = document.createElement('style');
  style.id    = 'devpulse-print-style';
  style.textContent = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 16mm 16mm 16mm 16mm;
      }
      /* Show the username as a running header */
      body::before {
        content: "DevPulse — github.com/${username}";
        display: block;
        font-family: monospace;
        font-size: 10px;
        color: #9aa5b4;
        padding-bottom: 12px;
        border-bottom: 1px solid #e2e5ef;
        margin-bottom: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // Small delay so the DOM can update before print dialog opens
  setTimeout(() => {
    window.print();
    // Remove the temporary stylesheet after printing
    setTimeout(() => {
      const el = document.getElementById('devpulse-print-style');
      if (el) el.remove();
    }, 1000);
  }, 100);
}

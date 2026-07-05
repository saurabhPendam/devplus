/*
  ProfileShareCard.js — Day 8.

  Renders a visual preview of the shareable profile card
  inside the browser, then lets the user download it as an SVG.

  The card preview is built as a real React component (not a canvas).
  When the user clicks "Download card", we call buildSVGCard()
  from utils/export.js to produce the same layout as a pure SVG
  string and trigger a file download.

  Why show a preview instead of just downloading?
  - Users want to see what they're sharing before they share it
  - The preview builds trust — no mystery file
  - It doubles as a nice visual element on the profile page itself

  The card shows:
  - Avatar + name + login + bio
  - Score grade (large, colour-coded)
  - Top 5 languages as coloured dots
  - 3 key stats: repos, stars, followers
  - DevPulse branding in the footer
*/

import React, { useState } from 'react';
import { getLanguageColor, formatNumber } from '../utils/format';
import { fetchAvatarBase64, buildSVGCard, downloadSVG } from '../utils/export';
import './ProfileShareCard.css';

const GRADE_COLORS = {
  S: '#16a34a', A: '#2563eb', B: '#7c3aed', C: '#d97706', D: '#dc2626',
};

export default function ProfileShareCard({ profile, score, languages, summary }) {
  const [downloading, setDownloading] = useState(false);

  const gradeColor = GRADE_COLORS[score.grade] || '#6b7280';
  const topLangs   = languages.slice(0, 5);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch avatar as base64 so it embeds in the SVG
      const avatarBase64 = await fetchAvatarBase64(profile.avatar);
      const svg = buildSVGCard({ profile, score, languages, summary, avatarBase64 });
      downloadSVG(svg, `${profile.login}-devpulse.svg`);
    } catch (err) {
      console.error('SVG export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="psc-wrap fade-in">
      <div className="psc-header">
        <div>
          <h2 className="psc-title">Profile card</h2>
          <p className="psc-sub">Download as SVG to embed in your GitHub README</p>
        </div>
        <button
          className="psc-download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Preparing...' : 'Download SVG'}
        </button>
      </div>

      {/* Live preview of the card */}
      <div className="psc-preview" aria-label="Profile card preview">
        {/* Left accent bar */}
        <div className="psc-accent-bar" style={{ background: gradeColor }} />

        <div className="psc-body">
          {/* Left: avatar + identity */}
          <div className="psc-identity">
            <img
              className="psc-avatar"
              src={profile.avatar}
              alt={profile.login}
            />
            <div className="psc-identity-text">
              <span className="psc-name">{profile.name}</span>
              <span className="psc-login">@{profile.login}</span>
              {profile.bio && (
                <span className="psc-bio">
                  {profile.bio.length > 80
                    ? profile.bio.slice(0, 80) + '...'
                    : profile.bio}
                </span>
              )}
              {profile.location && (
                <span className="psc-location">{profile.location}</span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="psc-divider" />

          {/* Right: score + langs + stats */}
          <div className="psc-metrics">
            {/* Grade */}
            <div className="psc-grade-row">
              <span className="psc-grade" style={{ color: gradeColor }}>
                {score.grade}
              </span>
              <div className="psc-grade-meta">
                <span className="psc-score-num">{score.total}<span className="psc-score-denom">/100</span></span>
                <span className="psc-score-label" style={{ color: gradeColor }}>
                  {score.label}
                </span>
              </div>
            </div>

            {/* Language dots */}
            {topLangs.length > 0 && (
              <div className="psc-langs">
                {topLangs.map(l => (
                  <div key={l.language} className="psc-lang-item">
                    <span
                      className="psc-lang-dot"
                      style={{ background: getLanguageColor(l.language) }}
                    />
                    <span className="psc-lang-name">
                      {l.language.length > 6
                        ? l.language.slice(0, 5) + '.'
                        : l.language}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stats row */}
            <div className="psc-stats">
              <div className="psc-stat">
                <span className="psc-stat-val">{profile.publicRepos}</span>
                <span className="psc-stat-label">repos</span>
              </div>
              <div className="psc-stat">
                <span className="psc-stat-val">{formatNumber(summary.totalStars)}</span>
                <span className="psc-stat-label">stars</span>
              </div>
              <div className="psc-stat">
                <span className="psc-stat-val">{formatNumber(profile.followers)}</span>
                <span className="psc-stat-label">followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card footer */}
        <div className="psc-footer">
          devpulse · github.com/{profile.login}
        </div>
      </div>

      {/* README embed hint */}
      <div className="psc-hint">
        <span className="psc-hint-label">README embed:</span>
        <code className="psc-hint-code">
          {`![DevPulse](https://your-deployment.vercel.app/cards/${profile.login}.svg)`}
        </code>
      </div>
    </div>
  );
}

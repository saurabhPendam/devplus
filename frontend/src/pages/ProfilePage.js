import React from 'react';
import './ProfilePage.css';

/*
  ProfilePage — shows the analyzed GitHub profile.

  Day 1: This is a skeleton/placeholder.
  - The header and back button are real and fully working.
  - The content area uses skeleton loaders to preview
    what the real profile will look like.

  Days 2–6 will replace the skeletons with real data.

  Props:
    username (string) — the GitHub handle being analyzed
    onBack   (fn)     — called when user hits ← Back
*/
export default function ProfilePage({ username, onBack }) {
  return (
    <div className="profile-page">
      {/* ── Sticky top bar ── */}
      <header className="profile-topbar">
        <div className="container profile-topbar-inner">
          <button className="back-btn" onClick={onBack}>
            ← back
          </button>
          <span className="topbar-logo">◈ devpulse</span>
          <div style={{ width: 64 }} /> {/* spacer to center the logo */}
        </div>
      </header>

      <div className="container profile-content">
        {/* ── Profile card skeleton ── */}
        <div className="card profile-card fade-in">
          <div className="skeleton profile-avatar-skeleton" />
          <div className="profile-meta-skeleton">
            <div className="skeleton" style={{ height: 24, width: 160 }} />
            <div className="skeleton" style={{ height: 14, width: 110, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 14, width: 240, marginTop: 10 }} />
            <div className="skeleton" style={{ height: 14, width: 200, marginTop: 6 }} />
          </div>
        </div>

        {/* ── Stats row skeleton ── */}
        <div className="stats-row fade-in">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card stat-card-skeleton">
              <div className="skeleton" style={{ height: 28, width: 50, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: 70 }} />
            </div>
          ))}
        </div>

        {/* ── Language bars skeleton ── */}
        <div className="card fade-in">
          <div className="skeleton" style={{ height: 16, width: 140, marginBottom: 20 }} />
          {[90, 65, 45, 30].map((w, i) => (
            <div key={i} className="lang-row-skeleton">
              <div className="skeleton" style={{ height: 12, width: 60 }} />
              <div className="skeleton" style={{ height: 8, width: `${w}%`, flex: 'none' }} />
              <div className="skeleton" style={{ height: 12, width: 32 }} />
            </div>
          ))}
        </div>

        {/* ── Placeholder message ── */}
        <p className="coming-soon-note">
          <span className="coming-soon-mono">// </span>
          Analyzing <strong>@{username}</strong> — GitHub API arrives in Day 2 🚀
        </p>
      </div>
    </div>
  );
}

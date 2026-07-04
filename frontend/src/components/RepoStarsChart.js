/*
  RepoStarsChart.js — Day 6, brand new.

  A horizontal bar chart showing the top repos ranked by star count.

  Why horizontal bars for repos?
  - Repo names are long — horizontal layout fits them naturally on the left
  - Easy to scan top-to-bottom and compare lengths
  - Requires zero libraries — just a div with a percentage width

  Data: repos[] from the GitHub API (already in memory).
  We take the top 8 original repos sorted by stars.

  Each bar also shows the primary language as a small colour dot,
  linking visually back to the language chart.
*/

import React, { useState } from 'react';
import { getLanguageColor } from '../utils/format';
import './RepoStarsChart.css';

export default function RepoStarsChart({ repos }) {
  const [hovered, setHovered] = useState(null);

  // Top 8 non-fork repos by stars — only show repos with at least 1 star
  const top = repos
    .filter(r => !r.isFork && r.stars >= 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 8);

  if (top.length === 0) return null;

  const maxStars = Math.max(...top.map(r => r.stars), 1);

  return (
    <div className="rsc-card card fade-in">
      <div className="rsc-header">
        <div>
          <h2 className="rsc-title">Repositories by stars</h2>
          <p className="rsc-sub">Top {top.length} original repos ranked by star count</p>
        </div>
        <div className="rsc-total-badge">
          {top.reduce((s, r) => s + r.stars, 0)} total stars
        </div>
      </div>

      <ul className="rsc-list">
        {top.map((repo, i) => {
          const pct       = maxStars > 0 ? (repo.stars / maxStars) * 100 : 0;
          const isHovered = hovered === i;

          return (
            <li
              key={repo.id}
              className={`rsc-item ${isHovered ? 'rsc-item--hovered' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Rank */}
              <span className="rsc-rank">#{i + 1}</span>

              {/* Repo name + language dot */}
              <div className="rsc-name-wrap">
                <a
                  className="rsc-name"
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  {repo.name}
                </a>
                {repo.language && (
                  <span
                    className="rsc-lang-dot"
                    style={{ background: getLanguageColor(repo.language) }}
                    title={repo.language}
                  />
                )}
              </div>

              {/* Bar track */}
              <div className="rsc-track">
                <div
                  className="rsc-bar"
                  style={{ width: `${Math.max(pct, repo.stars > 0 ? 2 : 0)}%` }}
                />
              </div>

              {/* Star count */}
              <span className="rsc-stars">
                {repo.stars > 0 ? repo.stars : '—'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

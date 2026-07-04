/*
  components/LanguageBar.js — Day 3 redesign.
  Larger stacked bar, cleaner row layout, hover tooltips.
*/
import React from 'react';
import { getLanguageColor } from '../utils/format';
import './LanguageBar.css';

export default function LanguageBar({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="lang-card card fade-in">
        <p className="lang-empty">No language data available.</p>
      </div>
    );
  }

  const bar = languages.slice(0, 7);

  return (
    <div className="lang-card card fade-in">
      <h2 className="lang-heading">Languages</h2>

      {/* Stacked proportional bar */}
      <div className="lang-bar" aria-label="Language usage breakdown">
        {bar.map(({ language, percentage }) => (
          <div
            key={language}
            className="lang-segment"
            style={{ width: `${percentage}%`, background: getLanguageColor(language) }}
            title={`${language} · ${percentage}%`}
          />
        ))}
      </div>

      {/* Legend — the dot + name pattern */}
      <div className="lang-legend">
        {languages.map(({ language, percentage }) => (
          <span key={language} className="lang-legend-item">
            <span className="lang-dot" style={{ background: getLanguageColor(language) }} />
            {language}
            <span className="lang-pct">{percentage}%</span>
          </span>
        ))}
      </div>

      {/* Full ranked list */}
      <ul className="lang-list">
        {languages.map(({ language, percentage }, i) => (
          <li key={language} className="lang-item">
            <span className="lang-rank">#{i + 1}</span>
            <span className="lang-name">{language}</span>
            <div className="lang-track">
              <div
                className="lang-fill"
                style={{
                  width: `${percentage}%`,
                  background: getLanguageColor(language),
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="lang-pct-col">{percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

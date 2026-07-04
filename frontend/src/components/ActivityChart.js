/*
  ActivityChart.js — Day 6 rewrite.

  12-month push frequency chart, completely rebuilt:
  - Animated bars on first render (CSS transition)
  - Hover tooltip showing exact count + month
  - Value label above each active bar
  - Current month highlighted
  - Y-axis gridlines so bars have a visual reference
  - No chart library — SVG + CSS only
*/

import React, { useState, useMemo } from 'react';
import './ActivityChart.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ActivityChart({ repos }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const bars = useMemo(() => {
    const now    = new Date();
    const counts = {};

    for (let i = 11; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
      counts[key] = 0;
    }

    repos.forEach(repo => {
      if (!repo.pushedAt) return;
      const d   = new Date(repo.pushedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
      if (key in counts) counts[key]++;
    });

    const entries  = Object.entries(counts);
    const maxCount = Math.max(...Object.values(counts), 1);

    return entries.map(([key, count], idx) => {
      const [, month] = key.split('-');
      const isCurrentMonth = idx === entries.length - 1;
      return {
        key,
        label:  MONTHS[parseInt(month, 10) - 1],
        count,
        height: Math.round((count / maxCount) * 100),
        isCurrentMonth,
      };
    });
  }, [repos]);

  const total    = bars.reduce((s, b) => s + b.count, 0);
  const maxCount = Math.max(...bars.map(b => b.count), 1);

  // Gridline values: 0, 25%, 50%, 75%, 100% of max
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxCount));

  return (
    <div className="ac-card card fade-in">
      <div className="ac-header">
        <div>
          <h2 className="ac-title">Push activity</h2>
          <p className="ac-sub">Repos pushed per month over the last 12 months</p>
        </div>
        <div className="ac-badge">{total} total pushes</div>
      </div>

      <div className="ac-chart">
        {/* Y-axis labels + gridlines */}
        <div className="ac-yaxis">
          {[...gridLines].reverse().map((val, i) => (
            <span key={i} className="ac-ylabel">{val}</span>
          ))}
        </div>

        <div className="ac-plot">
          {/* Gridlines */}
          <div className="ac-grid">
            {gridLines.map((_, i) => (
              <div key={i} className="ac-gridline" />
            ))}
          </div>

          {/* Bars */}
          <div className="ac-bars">
            {bars.map((bar, i) => (
              <div
                key={bar.key}
                className="ac-col"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {hoveredIndex === i && bar.count > 0 && (
                  <div className="ac-tooltip">
                    <span className="ac-tooltip-month">{bar.label}</span>
                    <span className="ac-tooltip-count">{bar.count} push{bar.count !== 1 ? 'es' : ''}</span>
                  </div>
                )}

                {/* Value label above bar */}
                {bar.count > 0 && (
                  <span className={`ac-value-label ${hoveredIndex === i ? 'ac-value-label--visible' : ''}`}>
                    {bar.count}
                  </span>
                )}

                <div className="ac-bar-wrap">
                  <div
                    className={`ac-bar ${bar.count === 0 ? 'ac-bar--empty' : ''} ${bar.isCurrentMonth ? 'ac-bar--current' : ''}`}
                    style={{ height: `${Math.max(bar.height, bar.count > 0 ? 6 : 0)}%` }}
                  />
                </div>

                <span className={`ac-month ${bar.isCurrentMonth ? 'ac-month--current' : ''}`}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

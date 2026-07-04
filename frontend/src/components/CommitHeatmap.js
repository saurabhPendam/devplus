/*
  CommitHeatmap.js — Day 6 rewrite.

  Rebuilt with:
  - Hover tooltip showing date + commit count
  - Weekday labels on the left (Mon / Wed / Fri)
  - Month labels aligned to the correct column
  - Summary stats: total commits, best day, streak
  - Clean light-theme colour scale
*/

import React, { useMemo, useState } from 'react';
import './CommitHeatmap.css';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getLevel(count) {
  if (count === 0)  return 0;
  if (count <= 2)   return 1;
  if (count <= 5)   return 2;
  if (count <= 10)  return 3;
  return 4;
}

export default function CommitHeatmap({ events }) {
  const { dayCounts = {}, totalCommits = 0, streak = 0, mostActiveDay } = events || {};
  const [tooltip, setTooltip] = useState(null); // { label, count, x, y }

  const { days, monthMarkers, weekCount } = useMemo(() => {
    const arr   = [];
    const today = new Date();

    // Start from the most recent Sunday to fill complete weeks
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 89);
    // Pad to the nearest Sunday before startDate
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const seen   = new Set();
    const months = [];
    let   col    = 0;

    const d = new Date(startDate);
    while (d <= today) {
      const key     = d.toISOString().slice(0, 10);
      const count   = dayCounts[key] || 0;
      const weekCol = col;

      // Month marker on first day of each month
      const m = d.getMonth();
      if (!seen.has(m) && d.getDay() === 0) {
        seen.add(m);
        months.push({ col: weekCol, label: MONTH_NAMES[m] });
      }

      arr.push({
        key,
        date:    new Date(d),
        count,
        level:   getLevel(count),
        weekCol,
        weekRow: d.getDay(),
        future:  d > today,
      });

      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) col++;
    }

    return { days: arr, monthMarkers: months, weekCount: col + 1 };
  }, [dayCounts]);

  const handleMouseEnter = (e, day) => {
    const dateLabel = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setTooltip({
      label: dateLabel,
      count: day.count,
      future: day.future,
    });
  };

  const bestDayLabel = mostActiveDay
    ? new Date(mostActiveDay[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div className="hm-card card fade-in">
      <div className="hm-header">
        <div>
          <h2 className="hm-title">Commit activity</h2>
          <p className="hm-sub">Last 90 days of public activity</p>
        </div>
        <div className="hm-stats">
          <div className="hm-stat">
            <span className="hm-stat-value">{totalCommits}</span>
            <span className="hm-stat-label">commits</span>
          </div>
          {streak > 0 && (
            <div className="hm-stat">
              <span className="hm-stat-value hm-stat-value--streak">{streak}</span>
              <span className="hm-stat-label">day streak</span>
            </div>
          )}
          {bestDayLabel && mostActiveDay && (
            <div className="hm-stat">
              <span className="hm-stat-value">{mostActiveDay[1]}</span>
              <span className="hm-stat-label">best day ({bestDayLabel})</span>
            </div>
          )}
        </div>
      </div>

      <div className="hm-body">
        {/* Weekday labels */}
        <div className="hm-weekdays">
          {['','Mon','','Wed','','Fri',''].map((d, i) => (
            <span key={i} className="hm-weekday">{d}</span>
          ))}
        </div>

        {/* Grid wrapper */}
        <div className="hm-grid-wrap">
          {/* Month labels */}
          <div
            className="hm-months"
            style={{ gridTemplateColumns: `repeat(${weekCount}, 1fr)` }}
          >
            {monthMarkers.map(({ col, label }) => (
              <span
                key={label}
                className="hm-month-label"
                style={{ gridColumn: col + 1 }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* The heatmap grid */}
          <div
            className="hm-grid"
            style={{ gridTemplateColumns: `repeat(${weekCount}, 1fr)` }}
            onMouseLeave={() => setTooltip(null)}
          >
            {days.map(day => (
              <div
                key={day.key}
                className={`hm-cell hm-cell--l${day.level} ${day.future ? 'hm-cell--future' : ''}`}
                style={{
                  gridColumn: day.weekCol + 1,
                  gridRow:    day.weekRow + 1,
                }}
                onMouseEnter={e => handleMouseEnter(e, day)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="hm-tooltip-bar">
          <span className="hm-tooltip-date">{tooltip.label}</span>
          <span className="hm-tooltip-count">
            {tooltip.future ? 'Future date' : `${tooltip.count} commit${tooltip.count !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="hm-legend">
        <span className="hm-legend-label">Less</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} className={`hm-cell hm-cell--l${l} hm-legend-cell`} />
        ))}
        <span className="hm-legend-label">More</span>
      </div>
    </div>
  );
}

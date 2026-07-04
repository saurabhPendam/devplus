/*
  ScoreRadar.js — Day 6, brand new.

  A pentagon-style SVG radar chart visualising the 4 score dimensions:
  Activity, Impact, Diversity, Consistency.

  How an SVG radar chart works:
  - Place N axes radiating from the centre, evenly spaced in degrees
  - For each axis, plot a point at (score / max) * radius distance from centre
  - Connect those points into a filled polygon
  - Draw concentric guide polygons at 25%, 50%, 75%, 100% of max

  Why 4 axes instead of 5 (pentagon)?
  We have exactly 4 score dimensions, so we use a square layout —
  one axis pointing up, right, down, left. Clean and readable.

  No library — pure SVG math, about 60 lines of JS.
*/

import React, { useState } from 'react';
import './ScoreRadar.css';

const SIZE   = 200;
const CX     = 100;
const CY     = 100;
const RADIUS = 75;

// 4 axes at 0°, 90°, 180°, 270° (top, right, bottom, left)
const AXES = [
  { key: 'activity',    label: 'Activity',    angle: -90 },
  { key: 'impact',      label: 'Impact',      angle:   0 },
  { key: 'consistency', label: 'Consistency', angle:  90 },
  { key: 'diversity',   label: 'Diversity',   angle: 180 },
];

// Polar → cartesian
function point(cx, cy, r, angleDeg) {
  const rad = angleDeg * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build a polygon points string from an array of {x,y}
function toPoints(pts) {
  return pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

export default function ScoreRadar({ score }) {
  const [hovered, setHovered] = useState(null);
  const { breakdown } = score;
  const maxVal = 25; // each dimension is 0–25

  // Guide rings at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1].map(frac => {
    const r    = frac * RADIUS;
    const pts  = AXES.map(ax => point(CX, CY, r, ax.angle));
    return { frac, points: toPoints(pts) };
  });

  // Data polygon
  const dataPoints = AXES.map(ax => {
    const val  = breakdown[ax.key] || 0;
    const frac = val / maxVal;
    return point(CX, CY, frac * RADIUS, ax.angle);
  });

  // Axis endpoint + label position
  const axisInfo = AXES.map(ax => {
    const tip      = point(CX, CY, RADIUS + 2, ax.angle);
    const labelR   = RADIUS + 22;
    const labelPos = point(CX, CY, labelR, ax.angle);
    return { ...ax, tip, labelPos };
  });

  const gradeColor = {
    S: '#16a34a', A: '#3b6ef8', B: '#2952cc', C: '#b45309', D: '#dc2626',
  }[score.grade] || '#3b6ef8';

  return (
    <div className="radar-card card fade-in">
      <div className="radar-header">
        <div>
          <h2 className="radar-title">Score breakdown</h2>
          <p className="radar-sub">4 dimensions, 25 points each</p>
        </div>
        <div className="radar-grade" style={{ color: gradeColor }}>
          {score.grade}
          <span className="radar-grade-total">/{score.total}</span>
        </div>
      </div>

      <div className="radar-body">
        {/* SVG chart */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="radar-svg"
          aria-label="Score radar chart"
        >
          {/* Guide rings */}
          {rings.map(ring => (
            <polygon
              key={ring.frac}
              points={ring.points}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {axisInfo.map(ax => (
            <line
              key={ax.key}
              x1={CX} y1={CY}
              x2={ax.tip.x} y2={ax.tip.y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Data polygon */}
          <polygon
            points={toPoints(dataPoints)}
            fill={gradeColor}
            fillOpacity="0.15"
            stroke={gradeColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data point dots */}
          {dataPoints.map((pt, i) => (
            <circle
              key={AXES[i].key}
              cx={pt.x}
              cy={pt.y}
              r={hovered === i ? 6 : 4}
              fill={gradeColor}
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: 'default', transition: 'r 0.15s' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {/* Axis labels */}
          {axisInfo.map((ax, i) => (
            <text
              key={ax.key}
              x={ax.labelPos.x}
              y={ax.labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`radar-axis-label ${hovered === i ? 'radar-axis-label--active' : ''}`}
            >
              {ax.label}
            </text>
          ))}

          {/* Tooltip on hover */}
          {hovered !== null && (
            <g>
              <text x={CX} y={CY - 6} textAnchor="middle" className="radar-tooltip-val">
                {breakdown[AXES[hovered].key]}/25
              </text>
              <text x={CX} y={CY + 10} textAnchor="middle" className="radar-tooltip-label">
                {AXES[hovered].label}
              </text>
            </g>
          )}
        </svg>

        {/* Dimension stats */}
        <ul className="radar-stats">
          {AXES.map((ax, i) => {
            const val  = breakdown[ax.key] || 0;
            const pct  = Math.round((val / maxVal) * 100);
            return (
              <li
                key={ax.key}
                className={`radar-stat ${hovered === i ? 'radar-stat--active' : ''}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="radar-stat-row">
                  <span className="radar-stat-name">{ax.label}</span>
                  <span className="radar-stat-score">{val}<span className="radar-stat-max">/25</span></span>
                </div>
                <div className="radar-stat-track">
                  <div
                    className="radar-stat-fill"
                    style={{ width: `${pct}%`, background: gradeColor }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

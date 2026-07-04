/*
  LanguagePieChart.js — Day 6, brand new.

  A proper SVG donut chart for language distribution.
  Built with pure SVG — no Recharts, no Chart.js.

  How SVG arcs work:
  - Each language gets a slice proportional to its percentage
  - We convert percentage → radians → SVG arc path commands
  - The "donut hole" is made by a white circle on top
  - Hover highlights the slice and shows the label in the centre

  Why SVG instead of a library?
  - Total code: ~80 lines JS, ~60 lines CSS
  - Zero bundle size cost
  - Full control over look and interaction
  - You can explain exactly how it works in an interview
*/

import React, { useState } from 'react';
import { getLanguageColor } from '../utils/format';
import './LanguagePieChart.css';

const SIZE   = 200;   // viewBox size
const CX     = 100;   // centre X
const CY     = 100;   // centre Y
const RADIUS = 80;    // outer radius
const INNER  = 52;    // inner radius (donut hole)

// Convert polar coordinates to cartesian
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// Build an SVG arc path for a slice
function arcPath(cx, cy, r, inner, startDeg, endDeg) {
  // Clamp to avoid full-circle edge case
  const end   = Math.min(endDeg, startDeg + 359.99);
  const large = end - startDeg > 180 ? 1 : 0;

  const o1 = polar(cx, cy, r,     startDeg);
  const o2 = polar(cx, cy, r,     end);
  const i1 = polar(cx, cy, inner, end);
  const i2 = polar(cx, cy, inner, startDeg);

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${i2.x} ${i2.y}`,
    'Z',
  ].join(' ');
}

export default function LanguagePieChart({ languages }) {
  const [hovered, setHovered] = useState(null);

  if (!languages || languages.length === 0) return null;

  // Build slices
  let cursor = 0;
  const slices = languages.slice(0, 8).map(({ language, percentage }) => {
    const deg   = (percentage / 100) * 360;
    const start = cursor;
    cursor += deg;
    return { language, percentage, start, end: cursor };
  });

  const active = hovered !== null ? slices[hovered] : null;

  return (
    <div className="lpc-card card fade-in">
      <h2 className="lpc-title">Language distribution</h2>

      <div className="lpc-body">
        {/* SVG donut */}
        <div className="lpc-chart-wrap">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="lpc-svg"
            aria-label="Language distribution donut chart"
          >
            {slices.map((slice, i) => (
              <path
                key={slice.language}
                d={arcPath(CX, CY, RADIUS, INNER, slice.start, slice.end)}
                fill={getLanguageColor(slice.language)}
                opacity={hovered === null || hovered === i ? 1 : 0.35}
                stroke="#fff"
                strokeWidth="2"
                style={{ cursor: 'default', transition: 'opacity 0.2s' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* Centre label */}
            {active ? (
              <>
                <text x={CX} y={CY - 8} textAnchor="middle" className="lpc-centre-pct">
                  {active.percentage}%
                </text>
                <text x={CX} y={CY + 10} textAnchor="middle" className="lpc-centre-lang">
                  {active.language}
                </text>
              </>
            ) : (
              <text x={CX} y={CY + 5} textAnchor="middle" className="lpc-centre-default">
                Languages
              </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        <ul className="lpc-legend">
          {slices.map((slice, i) => (
            <li
              key={slice.language}
              className={`lpc-legend-item ${hovered === i ? 'lpc-legend-item--active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="lpc-legend-dot"
                style={{ background: getLanguageColor(slice.language) }}
              />
              <span className="lpc-legend-name">{slice.language}</span>
              <span className="lpc-legend-pct">{slice.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

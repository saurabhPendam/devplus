import React from 'react';
import './ScoreCard.css';

const DIMENSION_LABELS = {
  activity:    'Activity',
  impact:      'Impact',
  diversity:   'Diversity',
  consistency: 'Consistency',
};

const GRADE_COLORS = {
  S: '#16a34a', A: '#2563eb', B: '#7c3aed', C: '#d97706', D: '#dc2626',
};

export default function ScoreCard({ score }) {
  const { total, grade, label, breakdown } = score;
  const color = GRADE_COLORS[grade] || '#6b7280';

  return (
    <div className="score-card card fade-in">
      <div className="score-left">
        <div className="score-grade" style={{ color }}>{grade}</div>
        <div className="score-total">
          <span className="score-number">{total}</span>
          <span className="score-denom">/100</span>
        </div>
        <span className="score-label" style={{ color }}>{label}</span>
      </div>
      <div className="score-dimensions">
        <p className="score-dimensions-title">Breakdown</p>
        {Object.entries(breakdown).map(([key, pts]) => (
          <div key={key} className="score-dim">
            <div className="score-dim-header">
              <span className="score-dim-name">{DIMENSION_LABELS[key]}</span>
              <span className="score-dim-pts">{pts}<span className="score-dim-max">/25</span></span>
            </div>
            <div className="score-dim-track">
              <div className="score-dim-fill" style={{ width: `${(pts/25)*100}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
  InsightPanel.js — cleaned for light theme.
  Removed icon symbols, replaced with coloured dots.
*/
import React from 'react';
import './InsightPanel.css';

export default function InsightPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <section className="insight-panel card fade-in">
      <div className="insight-header">
        <h2 className="insight-title">Profile insights</h2>
        <span className="insight-subtitle">based on your public GitHub data</span>
      </div>
      <ul className="insight-list">
        {insights.map((item, i) => (
          <li key={i} className={`insight-item insight-item--${item.type}`}>
            <span className="insight-dot" />
            <p className="insight-text">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

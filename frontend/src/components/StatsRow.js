import React from 'react';
import { formatNumber } from '../utils/format';
import './StatsRow.css';

export default function StatsRow({ profile, summary }) {
  const stats = [
    { label: 'Public repos',  value: formatNumber(profile.publicRepos), sub: 'owned'        },
    { label: 'Followers',     value: formatNumber(profile.followers),   sub: 'developers'   },
    { label: 'Stars earned',  value: formatNumber(summary.totalStars),  sub: 'across repos' },
    { label: 'Active repos',  value: summary.activeRepos,               sub: 'last 30 days' },
  ];
  return (
    <div className="stats-row fade-in">
      {stats.map(({ label, value, sub }) => (
        <div key={label} className="stat-card card">
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
          <span className="stat-sub">{sub}</span>
        </div>
      ))}
    </div>
  );
}

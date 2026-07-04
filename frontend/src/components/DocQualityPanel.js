import React from 'react';
import './DocQualityPanel.css';

function ScorePip({ score }) {
  const filled = Math.round(score / 25);
  return (
    <div className="doc-pips">
      {[0,1,2,3].map(i => <span key={i} className={`doc-pip ${i < filled ? 'doc-pip--on' : ''}`} />)}
    </div>
  );
}

export default function DocQualityPanel({ docQuality }) {
  if (!docQuality || docQuality.length === 0) return null;
  return (
    <div className="doc-card card fade-in">
      <div className="doc-header">
        <h2 className="doc-title">Repo polish score</h2>
        <span className="doc-sub">description · topics · license · content</span>
      </div>
      <ul className="doc-list">
        {docQuality.map(repo => (
          <li key={repo.name} className="doc-item">
            <div className="doc-item-top">
              <a className="doc-repo-name" href={repo.htmlUrl} target="_blank" rel="noreferrer">{repo.name}</a>
              {repo.stars > 0 && <span className="doc-stars">{repo.stars} stars</span>}
              <ScorePip score={repo.score} />
              <span className={`doc-score-pct doc-score--${Math.round(repo.score/25)}`}>{repo.score}%</span>
            </div>
            {repo.tips.length > 0 ? (
              <div className="doc-tips">{repo.tips.map(tip => <span key={tip} className="doc-tip">{tip}</span>)}</div>
            ) : (
              <span className="doc-tip doc-tip--ok">Fully documented</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

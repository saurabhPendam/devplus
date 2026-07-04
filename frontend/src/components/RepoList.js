import React, { useState } from 'react';
import { getLanguageColor, timeAgo } from '../utils/format';
import './RepoList.css';

const TABS = ['Top starred', 'Most recent', 'All'];

export default function RepoList({ repos }) {
  const [tab, setTab] = useState('Top starred');
  const own = repos.filter(r => !r.isFork);

  const displayed = (() => {
    if (tab === 'Top starred') return [...own].sort((a,b) => b.stars - a.stars).slice(0,6);
    if (tab === 'Most recent') return [...own].sort((a,b) => new Date(b.pushedAt)-new Date(a.pushedAt)).slice(0,6);
    return own.slice(0,9);
  })();

  if (own.length === 0) return null;

  return (
    <section className="repolist fade-in">
      <div className="repolist-header">
        <h2 className="repolist-title">Repositories</h2>
        <div className="repolist-tabs">
          {TABS.map(t => (
            <button key={t} className={`repo-tab ${tab===t?'repo-tab--active':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="repolist-grid">
        {displayed.map(repo => (
          <a key={repo.id} className="repo-card card" href={repo.htmlUrl} target="_blank" rel="noreferrer">
            <div className="repo-top">
              <span className="repo-name">{repo.name}</span>
              {repo.isFork && <span className="badge badge-orange">fork</span>}
            </div>
            {repo.description && <p className="repo-desc">{repo.description}</p>}
            {repo.topics.length > 0 && (
              <div className="repo-topics">
                {repo.topics.slice(0,3).map(t => <span key={t} className="badge badge-blue">{t}</span>)}
              </div>
            )}
            <div className="repo-footer">
              {repo.language && (
                <span className="repo-lang">
                  <span className="repo-lang-dot" style={{ background: getLanguageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              {repo.stars > 0 && <span className="repo-stat">{repo.stars} stars</span>}
              {repo.forks > 0 && <span className="repo-stat">{repo.forks} forks</span>}
              <span className="repo-pushed">{timeAgo(repo.pushedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

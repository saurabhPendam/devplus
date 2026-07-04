/*
  ProfilePage.js — Day 6 final layout.

  Chart section order (designed to tell a story):
  1. Who they are  → ProfileCard + ScoreCard side by side
  2. Summary numbers → StatsRow
  3. Score detail   → ScoreRadar (the 4 dimensions as a radar)
  4. Share + Recruiter → ShareCard, RecruiterCard
  5. Insights       → InsightPanel
  6. Activity       → CommitHeatmap (90-day grid) + ActivityChart (12-month bars)
  7. Languages      → LanguagePieChart (donut) + LanguageBar (ranked list)
  8. Repos          → RepoStarsChart (by stars) + RepoList (full grid)
  9. Topics + Docs  → TopicsCloud + DocQualityPanel
*/

import React, { useMemo } from 'react';
import { useProfile }       from '../hooks/useProfile';
import ProfileCard           from '../components/ProfileCard';
import StatsRow              from '../components/StatsRow';
import ScoreCard             from '../components/ScoreCard';
import ScoreRadar            from '../components/ScoreRadar';
import InsightPanel          from '../components/InsightPanel';
import CommitHeatmap         from '../components/CommitHeatmap';
import ActivityChart         from '../components/ActivityChart';
import LanguageBar           from '../components/LanguageBar';
import LanguagePieChart      from '../components/LanguagePieChart';
import TopicsCloud           from '../components/TopicsCloud';
import RepoList              from '../components/RepoList';
import RepoStarsChart        from '../components/RepoStarsChart';
import DocQualityPanel       from '../components/DocQualityPanel';
import RecruiterCard         from '../components/RecruiterCard';
import ShareCard             from '../components/ShareCard';
import { computeScore }      from '../utils/score';
import { generateInsights }  from '../utils/insights';
import './ProfilePage.css';

export default function ProfilePage({ username, onBack }) {
  const { data, loading, error, refresh, fromCache } = useProfile(username);

  const score = useMemo(() => {
    if (!data) return null;
    return computeScore(data.profile, data.repos, data.languages);
  }, [data]);

  const insights = useMemo(() => {
    if (!data || !score) return [];
    return generateInsights(data.profile, data.repos, data.languages, score);
  }, [data, score]);

  return (
    <div className="profile-page">
      {/* Sticky top bar */}
      <header className="profile-topbar">
        <div className="container profile-topbar-inner">
          <button className="back-btn" onClick={onBack}>Back</button>
          <span className="topbar-logo">
            <span className="topbar-logo-dot" />
            devpulse
          </span>
          <button className="refresh-btn" onClick={refresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      <div className="container profile-content">
        {loading && <ProfileSkeleton />}
        {error   && <ErrorState message={error} username={username} onBack={onBack} />}

        {data && !loading && score && (
          <>
            {/* Row 1 — Profile card + Score card */}
            <div className="profile-hero-row">
              <ProfileCard profile={data.profile} />
              <ScoreCard   score={score} />
            </div>

            {/* Row 2 — 4 headline numbers */}
            <StatsRow profile={data.profile} summary={data.summary} />

            {/* Row 3 — Score radar (replaces ScoreCard breakdown on wide screens) */}
            <ScoreRadar score={score} />

            {/* Row 4 — Share + Recruiter side by side */}
            <div className="profile-two-col">
              <ShareCard
                profile={data.profile}
                score={score}
                languages={data.languages}
                summary={data.summary}
              />
              <RecruiterCard
                profile={data.profile}
                repos={data.repos}
                languages={data.languages}
                events={data.events}
                score={score}
              />
            </div>

            {/* Row 5 — Insights */}
            <InsightPanel insights={insights} />

            {/* Section: Activity */}
            <div className="profile-section-label">Activity</div>
            <CommitHeatmap events={data.events} />
            <ActivityChart repos={data.repos} />

            {/* Section: Languages */}
            <div className="profile-section-label">Languages</div>
            <div className="profile-two-col">
              <LanguagePieChart languages={data.languages} />
              <LanguageBar      languages={data.languages} />
            </div>

            {/* Section: Repositories */}
            <div className="profile-section-label">Repositories</div>
            <RepoStarsChart repos={data.repos} />
            <RepoList       repos={data.repos} />

            {/* Section: Profile health */}
            <div className="profile-section-label">Profile health</div>
            <div className="profile-two-col">
              <TopicsCloud   topics={data.topics} />
              <DocQualityPanel docQuality={data.docQuality} />
            </div>

            {/* Footer */}
            <p className="fetch-note">
              github.com/{username}
              {' · '}
              {new Date(data.fetchedAt).toLocaleTimeString()}
              {' · '}
              <span className={fromCache ? 'cache-hit' : 'cache-miss'}>
                {fromCache ? 'cached' : 'live'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* Skeleton shown while loading */
function ProfileSkeleton() {
  return (
    <div className="profile-skeleton">
      <div className="profile-hero-row">
        <div className="card sk-pcard">
          <div className="skeleton sk-avatar" />
          <div className="sk-lines">
            <div className="skeleton" style={{ height: 22, width: 160 }} />
            <div className="skeleton" style={{ height: 13, width: 100, marginTop: 6 }} />
            <div className="skeleton" style={{ height: 13, width: 260, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 13, width: 200, marginTop: 6 }} />
          </div>
        </div>
        <div className="card sk-score">
          <div className="skeleton" style={{ height: 72, width: 72, borderRadius: 8 }} />
          <div className="sk-lines" style={{ flex: 1 }}>
            {[100, 80, 65, 50].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 10, width: `${w}%`, marginBottom: 10 }} />
            ))}
          </div>
        </div>
      </div>
      <div className="stats-row">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="skeleton" style={{ height: 28, width: 52 }} />
            <div className="skeleton" style={{ height: 11, width: 70 }} />
          </div>
        ))}
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 14, width: 130 }} />
        {[90, 75, 60, 50].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: 12, width: `${w}%` }} />
        ))}
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 14, width: 160, marginBottom: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13,1fr)', gridTemplateRows: 'repeat(7,12px)', gap: 3 }}>
          {Array.from({ length: 91 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ borderRadius: 2 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Error state */
function ErrorState({ message, username, onBack }) {
  const notFound = message.toLowerCase().includes('not found');
  return (
    <div className="error-state card fade-in">
      <h2 className="error-title">
        {notFound ? `@${username} was not found on GitHub` : 'Something went wrong'}
      </h2>
      <p className="error-msg">{message}</p>
      <button className="error-btn" onClick={onBack}>Try another username</button>
    </div>
  );
}

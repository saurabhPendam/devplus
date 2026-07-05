/*
  ProfilePage.js — Day 7 final.

  Day 7 additions:
  - LoadingScreen replaces the raw ProfileSkeleton during fetch
  - useToast wired to Refresh button and copy actions
  - ScrollToTop button added
  - Staggered fade-in on card sections
  - Error state improved with retry action
*/

import React, { useMemo }       from 'react';
import { useProfile }            from '../hooks/useProfile';
import { useToast }              from '../components/Toast';
import ProfileCard               from '../components/ProfileCard';
import StatsRow                  from '../components/StatsRow';
import ScoreCard                 from '../components/ScoreCard';
import ScoreRadar                from '../components/ScoreRadar';
import InsightPanel              from '../components/InsightPanel';
import CommitHeatmap             from '../components/CommitHeatmap';
import ActivityChart             from '../components/ActivityChart';
import LanguageBar               from '../components/LanguageBar';
import LanguagePieChart          from '../components/LanguagePieChart';
import TopicsCloud               from '../components/TopicsCloud';
import RepoList                  from '../components/RepoList';
import RepoStarsChart            from '../components/RepoStarsChart';
import DocQualityPanel           from '../components/DocQualityPanel';
import RecruiterCard             from '../components/RecruiterCard';
import ShareCard                 from '../components/ShareCard';
import ProfileShareCard          from '../components/ProfileShareCard';
import LoadingScreen             from '../components/LoadingScreen';
import ScrollToTop               from '../components/ScrollToTop';
import { computeScore }          from '../utils/score';
import { generateInsights }      from '../utils/insights';
import './ProfilePage.css';

export default function ProfilePage({ username, onBack }) {
  const { data, loading, error, refresh, fromCache } = useProfile(username);
  const { showToast } = useToast();

  const score = useMemo(() => {
    if (!data) return null;
    return computeScore(data.profile, data.repos, data.languages);
  }, [data]);

  const insights = useMemo(() => {
    if (!data || !score) return [];
    return generateInsights(data.profile, data.repos, data.languages, score);
  }, [data, score]);

  const handleRefresh = async () => {
    await refresh();
    showToast('Profile refreshed with live data', 'success');
  };

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
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      <div className="container profile-content">

        {/* Loading state — animated progress messages */}
        {loading && <LoadingScreen username={username} />}

        {/* Error state */}
        {error && !loading && (
          <ErrorState
            message={error}
            username={username}
            onBack={onBack}
            onRetry={handleRefresh}
          />
        )}

        {/* Data loaded */}
        {data && !loading && score && (
          <>
            {/* Hero: profile + score */}
            <div className="profile-hero-row fade-in-1">
              <ProfileCard profile={data.profile} />
              <ScoreCard   score={score} />
            </div>

            {/* 4 headline numbers */}
            <StatsRow
              profile={data.profile}
              summary={data.summary}
              className="fade-in-2"
            />

            {/* Radar chart */}
            <div className="fade-in-3">
              <ScoreRadar score={score} />
            </div>

            {/* Share + Recruiter */}
            <div className="profile-two-col fade-in-4">
              <ShareCard
                profile={data.profile}
                score={score}
                languages={data.languages}
                summary={data.summary}
                onCopied={() => showToast('Link copied to clipboard', 'success')}
                onDownloaded={() => showToast('PDF export started', 'info')}
              />
              <RecruiterCard
                profile={data.profile}
                repos={data.repos}
                languages={data.languages}
                events={data.events}
                score={score}
                onCopied={() => showToast('Summary copied to clipboard', 'success')}
              />
            </div>

            {/* Profile card — downloadable SVG */}
            <div className="profile-section-label">Shareable card</div>
            <ProfileShareCard
              profile={data.profile}
              score={score}
              languages={data.languages}
              summary={data.summary}
            />

            {/* Insights */}
            <InsightPanel insights={insights} />

            {/* Activity section */}
            <div className="profile-section-label">Activity</div>
            <CommitHeatmap events={data.events} />
            <ActivityChart repos={data.repos} />

            {/* Languages section */}
            <div className="profile-section-label">Languages</div>
            <div className="profile-two-col">
              <LanguagePieChart languages={data.languages} />
              <LanguageBar      languages={data.languages} />
            </div>

            {/* Repos section */}
            <div className="profile-section-label">Repositories</div>
            <RepoStarsChart repos={data.repos} />
            <RepoList       repos={data.repos} />

            {/* Profile health section */}
            <div className="profile-section-label">Profile health</div>
            <div className="profile-two-col">
              <TopicsCloud     topics={data.topics} />
              <DocQualityPanel docQuality={data.docQuality} />
            </div>

            {/* Footer */}
            <p className="fetch-note">
              github.com/{username}
              {' · '}
              {new Date(data.fetchedAt).toLocaleTimeString()}
              {' · '}
              <span className={fromCache ? 'cache-hit' : 'cache-miss'}>
                {fromCache ? 'from cache' : 'live data'}
              </span>
            </p>
          </>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}

/* Error state with retry */
function ErrorState({ message, username, onBack, onRetry }) {
  const notFound = message.toLowerCase().includes('not found');
  return (
    <div className="error-state card fade-in">
      <div className="error-icon-wrap">
        <span className="error-icon-letter">{notFound ? '404' : '!'}</span>
      </div>
      <h2 className="error-title">
        {notFound
          ? `@${username} was not found on GitHub`
          : 'Something went wrong'}
      </h2>
      <p className="error-msg">{message}</p>
      <div className="error-actions">
        {!notFound && (
          <button className="error-btn" onClick={onRetry}>
            Try again
          </button>
        )}
        <button className="error-btn error-btn--outline" onClick={onBack}>
          Search again
        </button>
      </div>
    </div>
  );
}

/*
  ProfileCard.js — cleaned, no unicode symbols.
*/
import React from 'react';
import { formatMonthYear, formatNumber } from '../utils/format';
import './ProfileCard.css';

export default function ProfileCard({ profile }) {
  const blogUrl = profile.blog
    ? (profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`)
    : null;
  const blogLabel = profile.blog?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div className="pcard card fade-in">
      <img
        className="pcard-avatar"
        src={profile.avatar}
        alt={`${profile.login} avatar`}
      />
      <div className="pcard-body">
        <div className="pcard-name-row">
          <h1 className="pcard-name">{profile.name}</h1>
          <a
            className="pcard-login badge badge-violet"
            href={profile.htmlUrl}
            target="_blank"
            rel="noreferrer"
          >
            @{profile.login}
          </a>
        </div>

        {profile.bio && <p className="pcard-bio">{profile.bio}</p>}

        <div className="pcard-follow">
          <span className="pcard-follow-item">
            <strong>{formatNumber(profile.followers)}</strong> followers
          </span>
          <span className="pcard-follow-dot">·</span>
          <span className="pcard-follow-item">
            <strong>{formatNumber(profile.following)}</strong> following
          </span>
        </div>

        <div className="pcard-meta">
          {profile.location && (
            <span className="pcard-meta-item">{profile.location}</span>
          )}
          {blogUrl && (
            <a className="pcard-meta-item pcard-meta-link" href={blogUrl} target="_blank" rel="noreferrer">
              {blogLabel}
            </a>
          )}
          {profile.company && (
            <span className="pcard-meta-item">{profile.company}</span>
          )}
          <span className="pcard-meta-item pcard-meta-dim">
            Joined {formatMonthYear(profile.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

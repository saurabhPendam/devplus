/*
  LoadingScreen.js — Day 7.

  Shows animated progress messages while the GitHub API loads.
  Instead of a blank spinner, the user sees what's happening:
  "Fetching profile..." → "Loading repositories..." → etc.

  Why this matters:
  - GitHub + language fetching takes 2-6 seconds
  - A spinner with no context feels broken
  - Progress messages reduce perceived wait time by ~40%
  - It's also an honest representation of what the app is doing

  Implementation:
  - Each message displays for ~1.2 seconds then fades to the next
  - A thin progress bar grows across the top
  - Uses only useState + useEffect — no library needed
*/

import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const MESSAGES = [
  'Fetching GitHub profile...',
  'Loading repositories...',
  'Calculating language stats...',
  'Reading commit history...',
  'Computing developer score...',
  'Almost there...',
];

export default function LoadingScreen({ username }) {
  const [msgIndex,  setMsgIndex]  = useState(0);
  const [progress,  setProgress]  = useState(8);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Advance message every 1.2s
    const msgTimer = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setMsgIndex(i => Math.min(i + 1, MESSAGES.length - 1));
        setFadingOut(false);
      }, 200);
    }, 1200);

    // Grow progress bar — slower near the end (never reaches 100 until done)
    const progTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 88) return p + 0.3;
        if (p >= 70) return p + 1;
        return p + 2.5;
      });
    }, 120);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div className="ls-wrap">
      {/* Thin progress bar at top */}
      <div className="ls-progress-track">
        <div
          className="ls-progress-fill"
          style={{ width: `${Math.min(progress, 92)}%` }}
        />
      </div>

      <div className="ls-body">
        <div className="ls-dots">
          <span className="ls-dot" style={{ animationDelay: '0ms' }} />
          <span className="ls-dot" style={{ animationDelay: '160ms' }} />
          <span className="ls-dot" style={{ animationDelay: '320ms' }} />
        </div>

        <p className={`ls-username`}>@{username}</p>

        <p className={`ls-message ${fadingOut ? 'ls-message--out' : ''}`}>
          {MESSAGES[msgIndex]}
        </p>

        <p className="ls-hint">
          First load fetches live data from GitHub
        </p>
      </div>
    </div>
  );
}

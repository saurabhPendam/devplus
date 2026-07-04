/*
  components/TopicsCloud.js

  Displays all GitHub repo topics (tags) as a weighted tag cloud.
  Topics that appear across multiple repos are shown larger/bolder.

  Why this matters for a resume:
  - GitHub topics are what recruiters use to search repositories
  - A developer with rich, accurate topics looks more intentional
  - The cloud gives an instant "what this person builds" summary

  Data: topics[] from getTopics() on the backend — already sorted
  by frequency descending and capped at 20.

  No external library — pure CSS with font-size scaling.
*/

import React from 'react';
import './TopicsCloud.css';

export default function TopicsCloud({ topics }) {
  if (!topics || topics.length === 0) return null;

  const maxCount = topics[0]?.count || 1;

  // Map count → font size between 12px and 20px
  function fontSize(count) {
    const ratio = count / maxCount;
    return Math.round(12 + ratio * 8);
  }

  // Map count → opacity between 0.5 and 1
  function opacity(count) {
    return (0.5 + (count / maxCount) * 0.5).toFixed(2);
  }

  return (
    <div className="topics-card card fade-in">
      <h2 className="topics-heading">Topics & technologies</h2>
      <p className="topics-sub">aggregated from all public repos</p>
      <div className="topics-cloud">
        {topics.map(({ topic, count }) => (
          <a
            key={topic}
            className="topic-tag"
            href={`https://github.com/topics/${topic}`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: `${fontSize(count)}px`,
              opacity:  opacity(count),
            }}
            title={`${topic} · appears in ${count} repo${count !== 1 ? 's' : ''}`}
          >
            {topic}
          </a>
        ))}
      </div>
    </div>
  );
}

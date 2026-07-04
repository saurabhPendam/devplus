import React, { useMemo } from 'react';
import { formatMonthYear } from '../utils/format';
import './RecruiterCard.css';

function buildSummary(profile, repos, languages, events, score) {
  const own        = repos.filter(r => !r.isFork);
  const years      = Math.floor((Date.now() - new Date(profile.createdAt)) / (365.25*86400000));
  const topLangs   = languages.slice(0,3).map(l => l.language);
  const topRepo    = [...own].sort((a,b) => b.stars - a.stars)[0];
  const totalStars = own.reduce((s,r) => s + r.stars, 0);
  const d90        = own.filter(r => Date.now() - new Date(r.pushedAt) < 90*86400000).length;

  const expStr  = years >= 2 ? `${years}-year GitHub developer` : years === 1 ? `GitHub developer since ${formatMonthYear(profile.createdAt)}` : 'actively building on GitHub';
  const langStr = topLangs.length > 0 ? `primarily working in ${topLangs.join(', ')}` : 'working across multiple technologies';
  const headline = `${profile.name} is a ${expStr}, ${langStr}.`;

  const bullets = [];
  if (own.length > 0) bullets.push(`${own.length} original repositories across ${languages.length} language${languages.length!==1?'s':''}.`);
  if (totalStars >= 10) bullets.push(`${totalStars} total stars earned across repositories.`);
  if (topRepo && topRepo.stars > 0) bullets.push(`Top project: "${topRepo.name}" (${topRepo.stars} stars)${topRepo.description ? ' — ' + topRepo.description.slice(0,80) : ''}.`);
  if (d90 >= 3) bullets.push(`${d90} repositories pushed in the last 90 days.`);
  else if (events?.totalCommits > 0) bullets.push(`${events.totalCommits} commits in the last 90 days.`);
  if (events?.streak >= 3) bullets.push(`Current coding streak: ${events.streak} consecutive days.`);
  bullets.push(`Developer score: ${score.total}/100 (${score.label}).`);

  return { headline, bullets };
}

export default function RecruiterCard({ profile, repos, languages, events, score }) {
  const { headline, bullets } = useMemo(
    () => buildSummary(profile, repos, languages, events, score),
    [profile, repos, languages, events, score]
  );

  const handleCopy = () => {
    const text = [headline, '', ...bullets.map(b => `- ${b}`)].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="recruiter-card card fade-in">
      <div className="recruiter-header">
        <div>
          <h2 className="recruiter-title">Recruiter summary</h2>
          <p className="recruiter-sub">generated from public GitHub data — copy and paste ready</p>
        </div>
        <button className="recruiter-copy-btn" onClick={handleCopy}>Copy</button>
      </div>
      <p className="recruiter-headline">{headline}</p>
      <ul className="recruiter-bullets">
        {bullets.map((b,i) => (
          <li key={i} className="recruiter-bullet">
            <span className="recruiter-bullet-dot" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

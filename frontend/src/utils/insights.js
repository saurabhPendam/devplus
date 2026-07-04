/*
  utils/insights.js — rule-based profile insights.

  Generates specific, readable observations from GitHub data.
  This is NOT AI — it's if/else logic that picks from a library
  of observation templates based on real numbers.

  The result reads like a human wrote it because:
  - observations are concrete ("14 repos pushed this year")
  - they reference the actual user's numbers
  - tone varies based on how good/bad the metric is
*/

export function generateInsights(profile, repos, languages, score) {
  const own    = repos.filter(r => !r.isFork);
  const now    = Date.now();
  const years  = (now - new Date(profile.createdAt)) / (365.25 * 86400000);

  const d90    = own.filter(r => now - new Date(r.pushedAt) < 90  * 86400000).length;
  const d365   = own.filter(r => now - new Date(r.pushedAt) < 365 * 86400000).length;
  const totalStars = own.reduce((s, r) => s + r.stars, 0);
  const topLang    = languages[0]?.language;
  const topLangs   = languages.slice(0, 3).map(l => l.language);
  const topRepo    = [...own].sort((a, b) => b.stars - a.stars)[0];

  const insights = [];

  // ── Activity ───────────────────────────────────────────────
  if (d90 >= 5) {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: `${d90} repos pushed in the last 3 months — consistent recent output.`,
    });
  } else if (d90 === 0 && d365 > 0) {
    insights.push({
      type: 'neutral',
      icon: '◇',
      text: `No pushes in the last 90 days, but ${d365} repos touched this year. Consider keeping at least one project active.`,
    });
  } else if (d90 === 0 && d365 === 0) {
    insights.push({
      type: 'warn',
      icon: '△',
      text: `No recent activity detected. Employers look at the green squares — even small commits help.`,
    });
  }

  // ── Language ───────────────────────────────────────────────
  if (languages.length >= 5) {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: `Writes in ${languages.length} languages. Strongest in ${topLangs.join(', ')}.`,
    });
  } else if (languages.length >= 2) {
    insights.push({
      type: 'neutral',
      icon: '◇',
      text: `Primary stack is ${topLangs.join(' + ')}. Adding a third language signals versatility to recruiters.`,
    });
  } else if (topLang) {
    insights.push({
      type: 'neutral',
      icon: '◇',
      text: `Almost exclusively ${topLang} (${languages[0]?.percentage}% of code). Strong focus, but branching out would help.`,
    });
  }

  // ── Impact ─────────────────────────────────────────────────
  if (totalStars >= 100) {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: `${totalStars} total stars across original repos — real community recognition.`,
    });
  } else if (totalStars >= 10) {
    insights.push({
      type: 'neutral',
      icon: '◇',
      text: `${totalStars} stars so far. A README improvement on top repos can double this.`,
    });
  }

  // ── Top repo ───────────────────────────────────────────────
  if (topRepo && topRepo.stars >= 5) {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: `"${topRepo.name}" is the standout project with ${topRepo.stars} ★. Lead with this on your resume.`,
    });
  } else if (topRepo) {
    insights.push({
      type: 'neutral',
      icon: '◇',
      text: `"${topRepo.name}" is the most-starred repo (${topRepo.stars} ★). A blog post or demo video would help it gain traction.`,
    });
  }

  // ── Tenure vs output ───────────────────────────────────────
  const reposPerYear = years > 0 ? (own.length / years).toFixed(1) : own.length;
  if (years >= 2 && own.length < 5) {
    insights.push({
      type: 'warn',
      icon: '△',
      text: `${own.length} original repos after ${Math.floor(years)} years on GitHub. More projects = more signal for employers.`,
    });
  } else if (years >= 1 && own.length >= 10) {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: `${reposPerYear} original repos created per year on average — strong build habit.`,
    });
  }

  // ── Profile completeness ───────────────────────────────────
  const missing = [];
  if (!profile.bio)      missing.push('bio');
  if (!profile.blog)     missing.push('website');
  if (!profile.location) missing.push('location');

  if (missing.length > 0) {
    insights.push({
      type: 'warn',
      icon: '△',
      text: `Profile is missing ${missing.join(', ')}. Recruiters scan these in 10 seconds.`,
    });
  } else {
    insights.push({
      type: 'positive',
      icon: '◆',
      text: 'Profile is complete — bio, website, and location all filled in.',
    });
  }

  // Return up to 5 insights, most actionable first
  return insights.slice(0, 5);
}

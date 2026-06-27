import React, { useState, useEffect, useRef } from 'react';
import './SearchPage.css';

/*
  SearchPage — the landing page.

  What it does:
  1. Shows a "terminal prompt" search — the signature design element.
     Developers instantly recognise the $ prompt style.
  2. Validates the input before handing off to App.js
  3. Shows example usernames as quick-launch chips
  4. Three feature cards explain what the analyzer does

  Props:
    onSearch(username: string) — called when form submits successfully
*/
export default function SearchPage({ onSearch }) {
  const [input, setInput]       = useState('');
  const [error, setError]       = useState('');
  const [blinkOn, setBlinkOn]   = useState(true);  // cursor blink state
  const inputRef                = useRef(null);

  // Blinking cursor effect — purely cosmetic, makes it feel like a real terminal
  useEffect(() => {
    const timer = setInterval(() => setBlinkOn(b => !b), 530);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus the input so users can type immediately
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();

    // Validation
    if (!trimmed) {
      setError('Type a GitHub username first.');
      return;
    }
    if (trimmed.length > 39) {
      setError('GitHub usernames can\'t be longer than 39 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(trimmed)) {
      setError('Invalid username — only letters, numbers, and hyphens.');
      return;
    }

    setError('');
    onSearch(trimmed);
  };

  const handleExample = (name) => {
    setInput(name);
    setError('');
    inputRef.current?.focus();
  };

  const examples = [
    { name: 'torvalds',      label: 'Linus Torvalds' },
    { name: 'gaearon',       label: 'Dan Abramov'    },
    { name: 'sindresorhus',  label: 'Sindre Sorhus'  },
    { name: 'yyx990803',     label: 'Evan You'       },
  ];

  const features = [
    {
      icon: '▸',
      title: 'Language breakdown',
      desc:  'See which languages dominate your repos and how they\'ve shifted over time.',
    },
    {
      icon: '▸',
      title: 'AI-written analysis',
      desc:  'Claude reads your commit history and tells you what kind of developer you actually are.',
    },
    {
      icon: '▸',
      title: 'Shareable score',
      desc:  'Get a link you can drop in your resume or Twitter bio.',
    },
  ];

  return (
    <div className="search-page">
      {/* ── Top nav strip ── */}
      <nav className="search-nav container">
        <span className="nav-logo">
          <span className="nav-logo-symbol">◈</span> devpulse
        </span>
        <a
          className="nav-link"
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
      </nav>

      {/* ── Hero ── */}
      <main className="search-main">
        <div className="hero-eyebrow">
          <span className="badge badge-violet">v0.1 — beta</span>
        </div>

        <h1 className="hero-heading">
          What does your<br />
          GitHub say about you?
        </h1>

        <p className="hero-body">
          Paste any GitHub username. Get a brutally honest breakdown
          of skills, consistency, and where to level up — powered by AI.
        </p>

        {/* ── Terminal prompt search ── SIGNATURE ELEMENT ── */}
        <form className="terminal-form" onSubmit={handleSubmit} noValidate>
          <div className={`terminal-box ${error ? 'has-error' : ''}`}>
            {/* Line 1 — static context line */}
            <div className="terminal-line terminal-line--dim">
              <span className="t-prompt">~</span>
              <span className="t-cmd">devpulse analyze</span>
            </div>

            {/* Line 2 — active input */}
            <div className="terminal-line">
              <span className="t-prompt">$</span>
              <span className="t-flag">--user</span>
              <input
                ref={inputRef}
                className="t-input"
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(''); }}
                placeholder="username"
                autoComplete="off"
                spellCheck={false}
                aria-label="GitHub username"
              />
              {/* Blinking caret — shows only when input is empty */}
              {!input && (
                <span
                  className="t-caret"
                  style={{ opacity: blinkOn ? 1 : 0 }}
                />
              )}
            </div>
          </div>

          {error && (
            <p className="terminal-error" role="alert">
              ✗ {error}
            </p>
          )}

          <button className="run-btn" type="submit">
            Run analysis
            <span className="run-btn-arrow">→</span>
          </button>
        </form>

        {/* ── Example chips ── */}
        <div className="examples-row">
          <span className="examples-label">Try:</span>
          <div className="examples-chips">
            {examples.map(ex => (
              <button
                key={ex.name}
                className="chip"
                type="button"
                onClick={() => handleExample(ex.name)}
                title={ex.label}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── Feature list ── */}
      <section className="features-section container">
        <p className="features-label">what you get</p>
        <ul className="features-list">
          {features.map(f => (
            <li key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Footer ── */}
      <footer className="search-footer">
        <p>Built with React · GitHub API · Claude AI</p>
      </footer>
    </div>
  );
}

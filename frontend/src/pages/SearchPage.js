import React, { useState, useEffect, useRef } from 'react';
import './SearchPage.css';

export default function SearchPage({ onSearch }) {
  const [input,   setInput]   = useState('');
  const [error,   setError]   = useState('');
  const [blinkOn, setBlinkOn] = useState(true);
  const inputRef              = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setBlinkOn(b => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = input.trim().toLowerCase();
    if (!val) { setError('Enter a GitHub username to continue.'); return; }
    if (val.length > 39) { setError('GitHub usernames are max 39 characters.'); return; }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(val)) {
      setError('Only letters, numbers, and hyphens are allowed.'); return;
    }
    setError('');
    onSearch(val);
  };

  const examples = [
    { name: 'torvalds',     label: 'Linus Torvalds' },
    { name: 'gaearon',      label: 'Dan Abramov'    },
    { name: 'sindresorhus', label: 'Sindre Sorhus'  },
    { name: 'yyx990803',    label: 'Evan You'        },
  ];

  const features = [
    {
      num: '01',
      title: 'Developer score',
      desc: 'A 0 to 100 score across activity, impact, language diversity, and consistency.',
    },
    {
      num: '02',
      title: 'Language breakdown',
      desc: 'See which languages dominate your repositories with byte-level accuracy.',
    },
    {
      num: '03',
      title: 'Profile insights',
      desc: 'Data-driven observations to help you stand out to recruiters and collaborators.',
    },
  ];

  return (
    <div className="search-page">
      <nav className="search-nav container">
        <span className="nav-logo">
          <span className="nav-logo-dot" />
          devpulse
        </span>
        <a className="nav-link" href="https://github.com" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>

      <main className="search-main">
        <div className="hero-eyebrow">
          <span className="badge badge-violet">GitHub Profile Analyzer</span>
        </div>

        <h1 className="hero-heading">
          What does your GitHub profile say about you?
        </h1>

        <p className="hero-body">
          Enter any GitHub username and get a detailed breakdown of
          skills, activity, and how your profile looks to recruiters.
        </p>

        <form className="terminal-form" onSubmit={handleSubmit} noValidate>
          <div className={`terminal-box ${error ? 'has-error' : ''}`}>
            <div className="terminal-line terminal-line--dim">
              <span className="t-prompt">~</span>
              <span className="t-cmd">devpulse analyze</span>
            </div>
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
              {!input && (
                <span className="t-caret" style={{ opacity: blinkOn ? 1 : 0 }} />
              )}
            </div>
          </div>

          {error && <p className="terminal-error" role="alert">{error}</p>}

          <button className="run-btn" type="submit">
            Analyze profile <span className="run-btn-arrow">-&gt;</span>
          </button>
        </form>

        <div className="examples-row">
          <span className="examples-label">Examples:</span>
          <div className="examples-chips">
            {examples.map(ex => (
              <button
                key={ex.name}
                className="chip"
                type="button"
                onClick={() => { setInput(ex.name); setError(''); inputRef.current?.focus(); }}
                title={ex.label}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>
      </main>

      <section className="features-section container">
        <p className="features-label">What you get</p>
        <ul className="features-list">
          {features.map(f => (
            <li key={f.num} className="feature-item">
              <span className="feature-num">{f.num}</span>
              <div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="search-footer">
        <p>Built with React, Node.js and the GitHub REST API</p>
      </footer>
    </div>
  );
}

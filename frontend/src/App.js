/*
  App.js — Day 6 update.

  New: reads ?u=username from the URL on page load.
  This makes shared links work — if someone visits
  devpulse.app/?u=torvalds, the profile loads automatically.

  When the user navigates back, we clear the URL parameter
  so the search page shows cleanly.
*/

import React, { useState, useEffect } from 'react';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [username, setUsername] = useState(null);

  // On first load, check for ?u= param in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    if (u && /^[a-zA-Z0-9-]{1,39}$/.test(u)) {
      setUsername(u.toLowerCase());
    }
  }, []);

  const handleSearch = (u) => {
    setUsername(u);
    // Update URL without page reload so the back button works
    window.history.pushState({}, '', `?u=${u}`);
  };

  const handleBack = () => {
    setUsername(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div>
      {username ? (
        <ProfilePage username={username} onBack={handleBack} />
      ) : (
        <SearchPage onSearch={handleSearch} />
      )}
    </div>
  );
}

export default App;

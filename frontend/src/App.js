/*
  App.js — Day 7.
  Wraps the whole app in ToastProvider so any component
  can call useToast(). Everything else unchanged.
*/

import React, { useState, useEffect } from 'react';
import SearchPage           from './pages/SearchPage';
import ProfilePage          from './pages/ProfilePage';
import { ToastProvider }    from './components/Toast';

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    if (u && /^[a-zA-Z0-9-]{1,39}$/.test(u)) {
      setUsername(u.toLowerCase());
    }
  }, []);

  const handleSearch = (u) => {
    setUsername(u);
    window.history.pushState({}, '', `?u=${u}`);
  };

  const handleBack = () => {
    setUsername(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <ToastProvider>
      {username ? (
        <ProfilePage username={username} onBack={handleBack} />
      ) : (
        <SearchPage onSearch={handleSearch} />
      )}
    </ToastProvider>
  );
}

export default App;

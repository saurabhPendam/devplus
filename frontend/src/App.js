import React, { useState } from 'react';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

/*
  App.js — the root of the component tree.

  We use a simple "username" piece of state to
  decide which page to show. No router needed yet —
  Day 3 adds react-router-dom when there are more pages.

  Data flow:
    App  →  SearchPage  (user types a username)
         ←  calls onSearch(username)
    App  →  ProfilePage (renders results)
         ←  calls onBack() to return to search
*/
function App() {
  const [activeUsername, setActiveUsername] = useState(null);

  return (
    <div>
      {activeUsername ? (
        <ProfilePage
          username={activeUsername}
          onBack={() => setActiveUsername(null)}
        />
      ) : (
        <SearchPage onSearch={setActiveUsername} />
      )}
    </div>
  );
}

export default App;
